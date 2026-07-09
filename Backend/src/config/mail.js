const nodemailer = require('nodemailer');
const config = require('./env');

let transporter;

const setupTransporter = () => {
  if (config.smtp.user && config.smtp.pass) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
      }
    });
  } else {
    // Console output logger fallback for local dev
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('====================================');
        console.log(`[MOCK EMAIL SENT TO: ${mailOptions.to}]`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Text Body:\n${mailOptions.text}`);
        console.log('====================================');
        return { messageId: 'mock-id-' + Date.now() };
      }
    };
  }
};

setupTransporter();

/**
 * Send an email.
 * @param {Object} options - Email parameters
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} [options.html] - HTML content alternative
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
    to,
    subject,
    text,
    html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail
};
