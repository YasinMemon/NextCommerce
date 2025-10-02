import nodemailer from "nodemailer"

export const sendMail = async (subject: string, reciever: string, body: any) => {
    const transporter = nodemailer.createTransport({
        host:  process.env.NODEMAILER_HOST,
        port:  process.env.NODEMAILER_PORT,
        secure: false,
        auth: {
            user:  process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASS
        }
    })

    const options = {
        from: `John Doe <${process.env.NODEMAILER_EMAIL}>`,
        to : reciever,
        subject: subject,
        html : body
    }
}