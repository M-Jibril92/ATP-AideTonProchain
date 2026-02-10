const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true pour 465, false pour autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendConfirmationEmail(to, firstName, activationLink) {
  await transporter.sendMail({
    from: `"AideTonProchain" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Bienvenue sur AideTonProchain !',
    html: `<h2>Merci de vous être inscrit, ${firstName} !</h2><p>Pour activer votre compte, cliquez sur ce lien : <a href="${activationLink}">Activer mon compte</a></p>`
  });
}

async function sendAdminOrderEmail(order) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  await transporter.sendMail({
    from: `"AideTonProchain" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: 'Nouvelle commande reçue',
    html: `<h2>Nouvelle commande</h2>
      <ul>
        <li><b>Client :</b> ${order.clientName || order.userId}</li>
        <li><b>Montant :</b> ${order.amount} €</li>
        <li><b>Méthode :</b> ${order.paymentMethod}</li>
        <li><b>Description :</b> <pre>${order.description}</pre></li>
        <li><b>Date :</b> ${order.createdAt}</li>
      </ul>`
  });
}

module.exports = { sendConfirmationEmail, sendAdminOrderEmail };
