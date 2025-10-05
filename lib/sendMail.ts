import nodemailer from 'nodemailer'

declare namespace NodeJS {
  interface ProcessEnv {
    NODEMAILER_HOST: string;
    NODEMAILER_PORT: string;
    NODEMAILER_EMAIL: string;
    NODEMAILER_PASS: string;
  }
}

export const sendMail = async (subject: string, reciever: string, body: any) => {
    const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST || "",
  port: Number(process.env.NODEMAILER_PORT) || 587, // must be a number
  secure: false,
  auth: {
    user: process.env.NODEMAILER_EMAIL || "",
    pass: process.env.NODEMAILER_PASS || "",
  },
});

    const options = {
        from: `John Doe <${process.env.NODEMAILER_EMAIL! as string || ""}>`,
        to : reciever,
        subject: subject,
        html : body
    }

    try {
        await transporter.sendMail(options)
        return {success: true}
    } catch (err) {
        return {success: false, error: err}
    }

}