const nodemailer = require('nodemailer');
const { sanitizeString } = require('./validators');

const smtpDebug = process.env.SMTP_DEBUG === 'true';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true pour 465, false pour autres ports
  logger: smtpDebug,
  debug: smtpDebug,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

if (smtpDebug) {
  transporter.verify((err, success) => {
    if (err) {
      console.error('❌ SMTP verify error:', err.message);
    } else if (success) {
      console.log('✅ SMTP transport ready');
    }
  });
}

const logMailResult = (info, tag) => {
  if (!info) return;
  const accepted = Array.isArray(info.accepted) ? info.accepted.join(', ') : '';
  const rejected = Array.isArray(info.rejected) ? info.rejected.join(', ') : '';
  console.log(`📧 ${tag} messageId=${info.messageId || 'n/a'} accepted=${accepted} rejected=${rejected}`);
};

const getFromAddress = () => {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  return `"AideTonProchain" <${from}>`;
};

async function sendConfirmationEmail(to, firstName, activationLink) {
  const safeName = sanitizeString(firstName || '');
  const safeLink = sanitizeString(activationLink || '');
  const info = await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject: '✉️ Activez votre compte AideTonProchain',
    html: `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .wrapper { background-color: #f5f5f5; padding: 20px 0; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #003366 0%, #004d99 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 40px 30px; }
            .content p { color: #555; font-size: 15px; margin: 15px 0; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 6px; margin: 25px 0; font-weight: 600; text-align: center; }
            .cta-button:hover { opacity: 0.9; }
            .button-wrapper { text-align: center; }
            .copy-link { background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 6px; padding: 12px 15px; margin: 15px 0; word-break: break-all; font-family: monospace; font-size: 12px; color: #666; }
            .security-box { background: #e3f2fd; border-left: 4px solid #0066cc; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .security-box strong { color: #003366; display: block; margin-bottom: 8px; font-size: 14px; }
            .security-box ul { margin: 8px 0; padding-left: 20px; font-size: 13px; color: #1565c0; line-height: 1.8; }
            .security-box li { margin: 5px 0; }
            .footer { background: #f9f9f9; padding: 20px 30px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; text-align: center; }
            .footer p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>🎉 Bienvenue sur AideTonProchain !</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong>${safeName}</strong>,</p>
                <p>Merci de votre inscription sur notre plateforme. Nous sommes heureux de vous accueillir !</p>
                <p>Pour activer votre compte et commencer à utiliser AideTonProchain, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
                
                <div class="button-wrapper">
                  <a href="${safeLink}" class="cta-button">✓ Confirmer mon compte</a>
                </div>
                
                <p style="color: #999; font-size: 13px; text-align: center;">Ou copiez ce lien dans votre navigateur :</p>
                <div class="copy-link">${safeLink}</div>
                
                <div class="security-box">
                  <strong>🔒 Sécurité de votre compte :</strong>
                  <ul>
                    <li>Ce lien expire dans 24 heures</li>
                    <li>Si vous n'avez pas créé ce compte, ignorez simplement cet email</li>
                    <li>Nous ne demandons jamais votre mot de passe par email</li>
                  </ul>
                </div>
                
                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                  Cordialement,<br>
                  <strong>L'équipe AideTonProchain</strong>
                </p>
              </div>
              <div class="footer">
                <p>© 2026 AideTonProchain. Tous droits réservés.</p>
                <p>Vous recevez cet email parce que vous avez créé un compte sur notre plateforme.</p>
              </div>
            </div>
          </div>
        </body>
      </html>`
  });
  logMailResult(info, 'Activation');
}

async function sendAdminOrderEmail(order) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  const clientName = sanitizeString(order.clientName || order.userId || 'Client');
  const amount = sanitizeString(String(order.amount || ''));
  const method = sanitizeString(order.paymentMethod || '');
  const description = sanitizeString(order.description || '');
  const createdAt = sanitizeString(order.createdAt || '');
  
  const info = await transporter.sendMail({
    from: getFromAddress(),
    to: adminEmail,
    subject: '🔔 Nouvelle commande reçue sur AideTonProchain',
    html: `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .wrapper { background-color: #f5f5f5; padding: 20px 0; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 40px 30px; }
            .alert-box { background: #fff3cd; border: 2px solid #ffc107; border-radius: 6px; padding: 15px; margin: 20px 0; }
            .alert-box strong { color: #856404; }
            .order-card { background: #f9f9f9; border-left: 4px solid #ff6b6b; padding: 20px; border-radius: 4px; margin: 20px 0; }
            .order-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
            .order-row:last-child { border-bottom: none; }
            .label { font-weight: 600; color: #003366; width: 40%; }
            .value { color: #555; width: 60%; text-align: right; }
            .amount-highlight { background: #e8f5e9; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 20px; font-weight: 600; color: #28a745; text-align: center; }
            .action-button { display: inline-block; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px; font-size: 13px; }
            .footer { background: #f9f9f9; padding: 20px 30px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; text-align: center; }
            .footer p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>🔔 Nouvelle Commande !</h1>
              </div>
              <div class="content">
                <div class="alert-box">
                  <strong>⚡ Une nouvelle commande a été reçue sur AideTonProchain</strong>
                </div>
                
                <div class="order-card">
                  <div class="order-row">
                    <div class="label">👤 Client :</div>
                    <div class="value">${clientName}</div>
                  </div>
                  <div class="order-row">
                    <div class="label">💰 Montant :</div>
                    <div class="value"><strong>${amount} €</strong></div>
                  </div>
                  <div class="order-row">
                    <div class="label">💳 Méthode :</div>
                    <div class="value">${method}</div>
                  </div>
                  <div class="order-row">
                    <div class="label">📅 Date :</div>
                    <div class="value">${createdAt}</div>
                  </div>
                </div>
                
                <div class="amount-highlight">
                  Montant total : ${amount} €
                </div>
                
                <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; margin: 20px 0;">
                  <strong>📝 Description :</strong>
                  <div style="margin-top: 10px; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #0066cc; color: #555;">
                    ${description || 'Aucune description fournie'}
                  </div>
                </div>
                
                <p style="color: #999; font-size: 13px; margin-top: 20px; text-align: center;">
                  Veuillez traiter cette commande aussi rapidement que possible pour offrir la meilleure expérience à votre client.
                </p>
              </div>
              <div class="footer">
                <p>© 2026 AideTonProchain. Message automatique de notification.</p>
              </div>
            </div>
          </div>
        </body>
      </html>`
  });
  logMailResult(info, 'AdminOrder');
}

async function sendPasswordResetEmail(to, firstName, resetLink) {
  const safeName = sanitizeString(firstName || '');
  const safeLink = sanitizeString(resetLink || '');
  const info = await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject: '🔐 Réinitialisation sécurisée de votre mot de passe',
    html: `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .wrapper { background-color: #f5f5f5; padding: 20px 0; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 40px 30px; }
            .content p { color: #555; font-size: 15px; margin: 15px 0; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 6px; margin: 25px 0; font-weight: 600; text-align: center; }
            .cta-button:hover { opacity: 0.9; }
            .button-wrapper { text-align: center; }
            .copy-link { background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 6px; padding: 12px 15px; margin: 15px 0; word-break: break-all; font-family: monospace; font-size: 12px; color: #666; }
            .warning-box { background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .warning-box strong { color: #e65100; display: block; margin-bottom: 8px; font-size: 14px; }
            .warning-box ul { margin: 8px 0; padding-left: 20px; font-size: 13px; color: #e65100; line-height: 1.8; }
            .warning-box li { margin: 5px 0; }
            .footer { background: #f9f9f9; padding: 20px 30px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; text-align: center; }
            .footer p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>🔐 Réinitialiser votre mot de passe</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong>${safeName}</strong>,</p>
                <p>Vous avez demandé la réinitialisation de votre mot de passe AideTonProchain. Pour sécuriser votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
                
                <div class="button-wrapper">
                  <a href="${safeLink}" class="cta-button">🔓 Réinitialiser mon mot de passe</a>
                </div>
                
                <p style="color: #999; font-size: 13px; text-align: center;">Ou copiez ce lien dans votre navigateur :</p>
                <div class="copy-link">${safeLink}</div>
                
                <div class="warning-box">
                  <strong>⚠️ À retenir :</strong>
                  <ul>
                    <li><strong>Ce lien expire dans 1 heure</strong> - passé ce délai, vous devrez recommencer une nouvelle demande</li>
                    <li>Si vous n'avez <strong>pas</strong> demandé cette réinitialisation, <strong>ignorez cet email</strong> - votre compte restera sécurisé</li>
                    <li>Nous ne vous demandons jamais votre mot de passe par email</li>
                    <li>Gardez ce lien confidentiel - ne le partagez avec personne</li>
                  </ul>
                </div>
                
                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                  Cordialement,<br>
                  <strong>L'équipe AideTonProchain</strong>
                </p>
              </div>
              <div class="footer">
                <p>© 2026 AideTonProchain. Tous droits réservés.</p>
                <p>Besoin d'aide ? Contactez notre support.</p>
              </div>
            </div>
          </div>
        </body>
      </html>`
  });
  logMailResult(info, 'PasswordReset');
}

async function sendOrderConfirmationEmail(to, firstName, orderDetails) {
  const safeName = sanitizeString(firstName || '');
  const safeTotal = sanitizeString(orderDetails.total || '');
  const safeMethod = sanitizeString(orderDetails.paymentMethod || '');
  const safeAddress = sanitizeString(orderDetails.address || '');
  const safeDate = sanitizeString(orderDetails.reservationDate || 'Non spécifiée');
  const safeItems = (orderDetails.items || []).map((item) => {
    const title = sanitizeString(item.title || '');
    const qty = sanitizeString(String(item.qty || 1));
    const price = sanitizeString(String(item.price || ''));
    return `<tr><td style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-weight: 500;">${title}</td><td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center; color: #0066cc; font-weight: 600;">×${qty}</td><td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right; color: #28a745; font-weight: 600;">${price ? price + ' €' : 'N/A'}</td></tr>`;
  }).join('');

  const info = await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject: '✅ Votre commande est confirmée - AideTonProchain',
    html: `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
            .wrapper { background-color: #f5f5f5; padding: 20px 0; }
            .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 6px 16px rgba(0,0,0,0.2); }
            .header { background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); color: white; padding: 50px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 36px; font-weight: 700; }
            .header p { margin: 12px 0 0 0; font-size: 16px; opacity: 0.95; }
            .timeline { display: flex; justify-content: space-between; padding: 40px 30px; background: linear-gradient(to right, #f0fdf4, #f7fee7, #fefce8, #f0fdf4); }
            .timeline-step { flex: 1; text-align: center; position: relative; }
            .timeline-step:not(:last-child)::after { content: ''; position: absolute; top: 25px; right: -50%; width: 100%; height: 2px; background: #28a745; }
            .timeline-icon { width: 50px; height: 50px; background: #28a745; color: white; font-size: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-weight: 700; }
            .timeline-label { font-size: 12px; color: #666; font-weight: 600; text-transform: uppercase; }
            .content { padding: 40px 30px; }
            .greeting { font-size: 16px; color: #555; margin: 0 0 30px 0; }
            .section-title { color: #28a745; font-size: 18px; font-weight: 700; margin: 30px 0 15px 0; padding-bottom: 10px; border-bottom: 3px solid #28a745; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: #fafafa; border-radius: 8px; overflow: hidden; }
            .items-table thead { background: #f0f0f0; }
            .items-table th { padding: 15px; text-align: left; font-weight: 700; color: #333; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
            .items-table tbody tr { border-bottom: 1px solid #e0e0e0; }
            .detail-box { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 5px solid #28a745; }
            .detail-row { display: flex; justify-content: space-between; padding: 12px 0; font-size: 14px; }
            .detail-label { color: #666; font-weight: 500; }
            .detail-value { color: #003366; font-weight: 600; text-align: right; flex: 1; margin-left: 15px; }
            .total-box { background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin: 25px 0; }
            .total-label { font-size: 14px; opacity: 0.9; margin-bottom: 10px; }
            .total-value { font-size: 40px; font-weight: 700; }
            .info-box { background: #e8f5e9; border: 2px solid #28a745; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .info-box p { color: #1b5e20; font-size: 14px; margin: 8px 0; }
            .reservation-highlight { background: #fff9e6; border-left: 5px solid #ffc107; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .reservation-highlight strong { color: #f57f17; display: block; margin-bottom: 10px; font-size: 16px; }
            .reservation-date { color: #003366; font-size: 18px; font-weight: 700; }
            .footer { background: #f9f9f9; padding: 30px; border-top: 2px solid #e0e0e0; text-align: center; }
            .footer p { color: #999; font-size: 12px; margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>✅ Commande Confirmée !</h1>
                <p>Merci pour votre confiance</p>
              </div>

              <div class="timeline">
                <div class="timeline-step">
                  <div class="timeline-icon">1️⃣</div>
                  <div class="timeline-label">Commande Reçue</div>
                </div>
                <div class="timeline-step">
                  <div class="timeline-icon" style="background: #ffc107; color: #333;">2️⃣</div>
                  <div class="timeline-label">Préparation</div>
                </div>
                <div class="timeline-step">
                  <div class="timeline-icon" style="background: #ffc107; color: #333;">3️⃣</div>
                  <div class="timeline-label">Confirmation</div>
                </div>
                <div class="timeline-step">
                  <div class="timeline-icon" style="background: #ccc; color: #666;">✓</div>
                  <div class="timeline-label">Complétée</div>
                </div>
              </div>

              <div class="content">
                <p class="greeting">Bonjour <strong>${safeName}</strong>,</p>
                <p>Nous avons reçu votre commande et vous remercions pour votre confiance ! Voici les détails de votre réservation.</p>

                <div class="section-title">📅 Date de Réservation</div>
                <div class="reservation-highlight">
                  <strong>📆 Vous avez sélectionné :</strong>
                  <div class="reservation-date">${safeDate}</div>
                </div>

                <div class="section-title">📦 Détails de Votre Commande</div>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th style="text-align: center;">Quantité</th>
                      <th style="text-align: right;">Prix</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${safeItems || '<tr><td colspan="3" style="padding: 20px; text-align: center; color: #999;">Aucun article</td></tr>'}
                  </tbody>
                </table>

                <div class="total-box">
                  <div class="total-label">Montant Total à Payer</div>
                  <div class="total-value">${safeTotal} €</div>
                </div>

                <div class="section-title">📍 Informations de Livraison</div>
                <div class="detail-box">
                  <div class="detail-row">
                    <span class="detail-label">📍 Adresse :</span>
                    <span class="detail-value">${safeAddress}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">💳 Paiement :</span>
                    <span class="detail-value">${safeMethod === 'CARD' ? '💳 Carte Bancaire' : safeMethod === 'CASH' ? '💵 Paiement sur place' : safeMethod}</span>
                  </div>
                </div>

                <div class="info-box">
                  <p><strong>⏱️ Qu'est-ce qu'il se passe maintenant ?</strong></p>
                  <p>Notre équipe prépare votre commande et vous confirmera la date exacte de l'intervention.</p>
                  <p>Vous recevrez un email de suivi dans les prochaines 24 heures.</p>
                </div>

                <div style="background: #f0f7ff; border-left: 5px solid #0066cc; padding: 20px; border-radius: 6px; margin: 20px 0;">
                  <p style="color: #003366; font-size: 14px; margin: 0;">
                    <strong>💡 Conseil :</strong> Rendez-vous sur votre compte pour suivre l'évolution de votre commande en temps réel.
                  </p>
                </div>

                <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
                  Cordialement,<br>
                  <strong>L'équipe AideTonProchain</strong>
                </p>
              </div>

              <div class="footer">
                <p><strong>Questions ?</strong></p>
                <p>Si vous avez des questions sur votre commande, n'hésitez pas à nous contacter.</p>
                <p style="margin-top: 15px; color: #bbb; font-size: 11px;">© 2026 AideTonProchain | Confirmation de Commande</p>
              </div>
            </div>
          </div>
        </body>
      </html>`
  });
  logMailResult(info, 'OrderConfirmation');
}

async function sendRegistrationSecurityEmail(to, firstName, activationLink) {
  const safeName = sanitizeString(firstName || '');
  const safeLink = sanitizeString(activationLink || '');
  const info = await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject: '🔐 Confirmez votre inscription à AideTonProchain',
    html: `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
            .wrapper { background-color: #f5f5f5; padding: 20px 0; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 40px 30px; }
            .content p { color: #555; font-size: 15px; margin: 15px 0; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 6px; margin: 25px 0; font-weight: 600; text-align: center; }
            .cta-button:hover { opacity: 0.9; }
            .button-wrapper { text-align: center; }
            .copy-link { background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 6px; padding: 12px 15px; margin: 15px 0; word-break: break-all; font-family: monospace; font-size: 12px; color: #666; }
            .security-box { background: #e8eaf6; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .security-box strong { color: #3f51b5; display: block; margin-bottom: 8px; font-size: 14px; }
            .security-box ul { margin: 8px 0; padding-left: 20px; font-size: 13px; color: #3f51b5; line-height: 1.8; }
            .security-box li { margin: 5px 0; }
            .steps { background: #f9f9f9; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .step { margin: 12px 0; padding: 10px; border-left: 3px solid #667eea; padding-left: 15px; }
            .step-num { font-weight: 600; color: #667eea; }
            .footer { background: #f9f9f9; padding: 20px 30px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; text-align: center; }
            .footer p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>🔐 Confirmez votre inscription</h1>
              </div>
              <div class="content">
                <p>Bonjour <strong>${safeName}</strong>,</p>
                <p>Merci de vous être inscrit sur AideTonProchain ! Pour sécuriser votre compte et accéder à tous nos services, veuillez confirmer votre adresse email.</p>
                
                <div class="button-wrapper">
                  <a href="${safeLink}" class="cta-button">✓ Confirmer mon email</a>
                </div>
                
                <p style="color: #999; font-size: 13px; text-align: center;">Ou copiez ce lien dans votre navigateur :</p>
                <div class="copy-link">${safeLink}</div>
                
                <div class="steps">
                  <div style="font-weight: 600; color: #333; margin-bottom: 12px;">📋 Voici ce qui se passe :</div>
                  <div class="step">
                    <span class="step-num">1️⃣ Cliquez sur le bouton</span> ou copiez le lien ci-dessus
                  </div>
                  <div class="step">
                    <span class="step-num">2️⃣ Confirmez votre adresse</span> pour activer votre compte
                  </div>
                  <div class="step">
                    <span class="step-num">3️⃣ Connectez-vous</span> et commencez à utiliser AideTonProchain
                  </div>
                </div>
                
                <div class="security-box">
                  <strong>🛡️ Sécurité & Confidentialité :</strong>
                  <ul>
                    <li>Ce lien reste valide 24 heures</li>
                    <li>Nous ne vous demandons jamais votre mot de passe par email</li>
                    <li>Votre email sera utilisé pour la sécurité de votre compte</li>
                    <li>Si vous n'avez pas créé ce compte, <strong>ignorez cet email</strong></li>
                  </ul>
                </div>
                
                <p style="color: #999; font-size: 12px; margin-top: 30px;">
                  Cordialement,<br>
                  <strong>L'équipe AideTonProchain</strong>
                </p>
              </div>
              <div class="footer">
                <p>© 2026 AideTonProchain. Tous droits réservés.</p>
                <p>Vous recevez cet email parce que vous avez créé un compte sur notre plateforme.</p>
              </div>
            </div>
          </div>
        </body>
      </html>`
  });
  logMailResult(info, 'RegistrationSecurity');
}

module.exports = {
  sendConfirmationEmail,
  sendAdminOrderEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendRegistrationSecurityEmail,
};
