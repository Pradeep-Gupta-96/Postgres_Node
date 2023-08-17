import nodemailer from "nodemailer";

// Create the transporter for sending emails
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: 'Mrlucifer9651@gmail.com',
        pass: "piahxhdeksphqsns"
    }
});

// Function to send password reset email
export const sendPasswordResetEmail = async (toEmail, username, OTP) => {
    // Define the email content using HTML
    const htmlContent = `
        <p>Hello ${username},</p>
        <p>Your OTP for password reset is: <b>${OTP}</b></p>
        <p>Please use this OTP within 05 minutes to reset your password.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>
        <p>Best regards,<br/>Your Team</p>
    `;

    try {
        // Send the email
        const info = await transporter.sendMail({
            from: 'Mrlucifer9651@gmail.com',
            to: toEmail,
            subject: "Password Reset OTP",
            html: htmlContent,
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};



// Function to verify users email
export const sendVerificationOTP = async (toEmail, username, OTP) => {
    // Define the email content using HTML
    const htmlContent = `
        <p>Hello ${username},</p>
        <p>Your verification OTP is: <b>${OTP}</b></p>
        <p>Please use this OTP to verify your email.</p>
    `;

    try {
        // Send the email
        const info = await transporter.sendMail({
            from: 'Mrlucifer9651@gmail.com',
            to: toEmail,
            subject: "Password Reset OTP",
            html: htmlContent,
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
