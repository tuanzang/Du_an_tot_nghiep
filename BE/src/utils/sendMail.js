import nodemailer from "nodemailer"

const sendMail = async ({ mailTo, title, content, attachmentFile }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASSWORD,
            },
        });

        let config = {
            from: `"FBEE" <${process.env.MAIL_USER}>`, // sender address
            to: mailTo, // list of receivers
            subject: title, // Subject line
            html: content, // html body
        };

        if (attachmentFile) {
            config = {
                ...config,
                attachments: [
                    {
                        filename: 'file.pdf',
                        path: attachmentFile,
                        contentType: 'application/pdf'
                    }
                ]
            }
        }

        const info = await transporter.sendMail(config);

        return info;
    } catch (error) {
        console.log(error)
    }
}

export default sendMail;