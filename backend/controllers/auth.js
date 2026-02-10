// -------------------- ACTIVATION EMAIL --------------------
exports.activate = async (req, res) => {
  const { token, email } = req.query;
  if (!token || !email) {
    return res.status(400).json({ message: "Lien d'activation invalide" });
  }
  const user = await User.findOne({ where: { email, emailToken: token } });
  if (!user) {
    return res.status(400).json({ message: "Lien d'activation invalide ou expiré" });
  }
  user.emailVerified = true;
  user.emailToken = null;
  await user.save();
  return res.json({ message: 'Votre compte a été activé avec succès !' });
};
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateRegister, sanitizeString } = require('../utils/validators');
const { sendConfirmationEmail } = require('../utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET ou JWT_REFRESH_SECRET manquant');
}

// Génération des tokens
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '1h', algorithm: 'HS256' }
  );

  const refreshToken = jwt.sign(
    { userId, role },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d', algorithm: 'HS256' }
  );

  return { accessToken, refreshToken };
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

    const { accessToken, refreshToken } = generateTokens(newUser.id, newUser.role);

    return res.status(201).json({
      message: 'Compte créé avec succès. Vérifiez votre email pour activer votre compte.',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        email: newUser.email,
        role: newUser.role,
        emailVerified: false
      },
      accessToken,
      refreshToken
    });
// -------------------- ACTIVATION EMAIL --------------------
exports.activate = async (req, res) => {
  const { token, email } = req.query;
  if (!token || !email) {
    return res.status(400).json({ message: 'Lien d\'activation invalide' });
  }
  const user = await User.findOne({ where: { email, emailToken: token } });
  if (!user) {
    return res.status(400).json({ message: 'Lien d\'activation invalide ou expiré' });
  }
  user.emailVerified = true;
  user.emailToken = null;
  await user.save();
  return res.json({ message: 'Votre compte a été activé avec succès !' });
};

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
          { userId: decoded.userId, role: decoded.role },
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
