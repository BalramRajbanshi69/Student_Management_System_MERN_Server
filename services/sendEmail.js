const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail app password
    },
  });

  const mailOptions = {
    from: `"Student Management System - Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL, // Your personal email to receive messages
    replyTo: options.email, // User’s email for reply
    subject: options.subject,
    text: `Name: ${options.name}\nEmail: ${options.email}\nSubject: ${options.subject}\nMessage: ${options.message}`,
    html: `<p><strong>Name:</strong> ${options.name}</p>
           <p><strong>Email:</strong> ${options.email}</p>
           <p><strong>Subject:</strong> ${options.subject}</p>
           <p><strong>Message:</strong> ${options.message}</p>`,
  };

  await transporter.sendMail(mailOptions);
};