import nodemailer from "nodemailer"

const sendMail = async ({ mailTo, title, content }) => {
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

        const info = await transporter.sendMail({
            from: `"FBEE" <${process.env.MAIL_USER}>`, // sender address
            to: mailTo, // list of receivers
            subject: title, // Subject line
            html: content, // html body
        });

        return info;
    } catch (error) {
        console.log(error)
    }
}

export default sendMail;