
import { createTestAccount, createTransport, getTestMessageUrl } from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();
const USERNAME = process.env.GMAIL_USERNAME;
const PASS = process.env.GMAIL_PASS;


const mailer = {
    async mail() {
        try {
            let transporter = createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: USERNAME, 
                    pass: PASS 
                },
                tls: {
                    ciphers: 'SSLv3'
                }
            });
            let info = await transporter.sendMail({
                from: '"iReporter" <abuchikingsley76@gmail.com>',
                to: "abuchikings@hotmail.com", 
                subject: "Hello ✔", 
                text: "Hello world?", 
                html: "<b>Hello world?</b>" 
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        } catch (error) {
            console.log(error)
        }

    }

}
export default mailer;
