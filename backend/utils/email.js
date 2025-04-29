const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your-email@gmail.com",
        pass: "your-email-password",
    },
});

async function sendEmail(to, subject, text) {
    await transporter.sendMail({
        from: "E-Healthcare <your-email@gmail.com>",
        to,
        subject,
        text,
    });
}

module.exports = sendEmail;
