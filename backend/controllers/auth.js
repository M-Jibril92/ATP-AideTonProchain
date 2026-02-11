const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateRegister, sanitizeString } = require('../utils/validators');
const { sendConfirmationEmail, sendRegistrationSecurityEmail, sendPasswordResetEmail } = require('../utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET ou JWT_REFRESH_SECRET manquant');
}

// Génération des tokens
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    { expiresIn: '1h', algorithm: 'HS256' }
  );

  const refreshToken = jwt.sign(
    { id: userId, role },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d', algorithm: 'HS256' }
  );

  return { accessToken, refreshToken };
};

// -------------------- ACTIVATION EMAIL --------------------
exports.activate = async (req, res) => {
  const { token, email } = req.query;
  
  console.log('🔍 [ACTIVATE] Paramètres reçus:', { token: token?.substring(0, 10) + '...', email });
  
  if (!token || !email) {
    console.error('❌ [ACTIVATE] Paramètres manquants:', { token: !!token, email: !!email });
    return res.status(400).json({ message: "Lien d'activation invalide" });
  }
  
  const user = await User.findOne({ where: { email, emailToken: token } });
  
  if (!user) {
    console.error('❌ [ACTIVATE] Utilisateur non trouvé pour:', { email, tokenFound: !!token });
    return res.status(400).json({ message: "Lien d'activation invalide ou expiré" });
  }
  
  console.log('✅ [ACTIVATE] Utilisateur trouvé:', user.email);
  
  user.emailVerified = true;
  user.emailToken = null;
  await user.save();
  
  // 🔓 Générer les tokens et connecter automatiquement l'utilisateur
  const { accessToken, refreshToken } = generateTokens(user.id, user.role);
  
  console.log('✅ [ACTIVATE] Tokens générés pour:', user.email);
  
  return res.json({
    message: 'Votre compte a été activé avec succès ! Vous êtes maintenant connecté.',
    user: {
      id: user.id,
      firstName: user.firstName,
      email: user.email,
      role: user.role,
      emailVerified: true
    },
    accessToken,
    refreshToken
  });
};

// -------------------- INSCRIPTION --------------------
exports.register = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Corps de requête manquant' });
    }

    const { firstName, lastName, email, password, phone, bio, location } = req.body;

    const sanitizedData = {
      firstName: sanitizeString(firstName),
      lastName: sanitizeString(lastName),
      email: email?.toLowerCase().trim(),
      role: 'CLIENT', // 🔒 rôle imposé
      phone: phone ? sanitizeString(phone) : null,
      bio: bio ? sanitizeString(bio) : null,
      location: location ? sanitizeString(location) : null
    };

    const validationErrors = validateRegister({
      ...sanitizedData,
      password
    });

    if (validationErrors) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: validationErrors
      });
    }

    const existingUser = await User.findOne({
      where: { email: sanitizedData.email }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);


    // Générer un token d'activation
    const emailToken = require('crypto').randomBytes(32).toString('hex');
    const newUser = await User.create({
      ...sanitizedData,
      password: hashedPassword,
      emailToken,
      emailVerified: false
    });

    // Envoi de l'email de confirmation avec lien d'activation
    const activationLink = `${process.env.FRONTEND_URL}/activate?token=${emailToken}&email=${encodeURIComponent(newUser.email)}`;
    sendConfirmationEmail(newUser.email, newUser.firstName, activationLink).catch(console.error);
    
    // Envoi d'un email supplémentaire de sécurité pour double opt-in
    sendRegistrationSecurityEmail(newUser.email, newUser.firstName, activationLink).catch(console.error);

    // 🔒 SÉCURITÉ : Ne pas retourner de tokens - l'utilisateur doit confirmer son email d'abord
    return res.status(201).json({
      message: 'Compte créé avec succès. Un email de confirmation a été envoyé à votre adresse. Veuillez cliquer sur le lien pour activer votre compte avant de vous connecter.',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        email: newUser.email,
        role: newUser.role,
        emailVerified: false
      }
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- CONNEXION --------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    return res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error('Erreur login:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- REFRESH TOKEN --------------------
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token manquant' });
    }

    jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET,
      { algorithms: ['HS256'] },
      (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Refresh token invalide ou expiré' });
        }

        const newAccessToken = jwt.sign(
          { id: decoded.id, role: decoded.role },
          JWT_SECRET,
          { expiresIn: '1h', algorithm: 'HS256' }
        );

        return res.json({
          message: 'Token rafraîchi',
          accessToken: newAccessToken
        });
      }
    );

  } catch (error) {
    console.error('Erreur refresh:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- PASSWORD RESET REQUEST --------------------
exports.passwordResetRequest = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() }
    });

    // ✅ Ne pas révéler si l'email existe ou non (sécurité)
    if (!user) {
      return res.status(200).json({
        message: 'Si cet email existe, un lien de réinitialisation vous sera envoyé'
      });
    }

    // Générer un token sécurisé valide 1 heure
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 heure

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    // Envoyer l'email avec le lien de réinitialisation
    const resetLink = `${process.env.FRONTEND_URL}/password-reset-confirm?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
    try {
      await sendPasswordResetEmail(user.email, user.firstName, resetLink);
    } catch (mailError) {
      console.error('Erreur envoi mail reset:', mailError.message);
    }

    return res.status(200).json({
      message: 'Si cet email existe, un lien de réinitialisation vous sera envoyé'
    });

  } catch (error) {
    console.error('Erreur password reset request:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// -------------------- PASSWORD RESET CONFIRM --------------------
exports.passwordResetConfirm = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body || {};

    if (!token || !email || !newPassword) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user || !user.resetToken || user.resetToken !== token) {
      return res.status(400).json({ message: 'Lien de réinitialisation invalide' });
    }

    // Vérifier que le token n'a pas expiré
    if (new Date() > user.resetTokenExpires) {
      user.resetToken = null;
      user.resetTokenExpires = null;
      await user.save();
      return res.status(400).json({ message: 'Lien de réinitialisation expiré' });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    return res.json({ message: 'Mot de passe réinitialisé avec succès' });

  } catch (error) {
    console.error('Erreur password reset confirm:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
