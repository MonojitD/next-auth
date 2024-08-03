import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(
                userId,
                {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                }
            )
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(
                userId,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000
                }
            )
        }

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: `${process.env.MAIL_USER}`,
                pass: `${process.env.MAIL_PASS}`
            }
        });

        const mailOptions = {
            from: 'monojitdeb8@gmail.com',
            to: email,
            subject: emailType === "VERIFY"? "Verify your email" : "Reset your password",
            html: `<p>You have applied to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}. <a href="${process.env.DOMAIN}/${emailType === "VERIFY" ?"verifyemail" : "resetpassword"}?token=${hashedToken}" target="_blank">Click here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"} or copy and paste this link in your browser.
            <br>
            ${process.env.DOMAIN}/${emailType === "VERIFY" ?"verifyemail" : "resetpassword"}?token=${hashedToken}
            </p>`
        }

        const mailResponse = await transporter.sendMail(mailOptions);
        
        return mailResponse;
    } catch (error: any) {
        throw new Error(error.message);
    }
}