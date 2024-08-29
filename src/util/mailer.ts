// src/util/mailer.ts
import nodemailer from 'nodemailer';

export async function sendMail(to: string, subject: string, text: string) {
    // Ensure to use environment variables for sensitive information
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // your Gmail email
            pass: process.env.EMAIL_PASS, // your Gmail password or app password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
