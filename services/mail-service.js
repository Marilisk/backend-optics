import nodemailer from 'nodemailer';


class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: 'optisinfomail@gmail.com',
                pass: 'baqxdpwxegkwtuok',
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: 'optisinfomail@gmail.com',
            to,
            subject: `Оптика. Активация аккаунта на spboptis.ru `,
            text: '',
            html: `<div>
                        <h1>Для активации аккаунта, пожалуйста, перейдите по ссылке:</h1>
                        <a href="${link}">${link}</a>
                    </div>`
        })
    }

    async sendForgotPasswordMail(to, link) {
        await this.transporter.sendMail({
            from: 'optisinfomail@gmail.com',
            to,
            subject: `Оптика. Восстановление пароля на spboptis.ru `,
            text: '',
            html: `<div>
                        <h1>Для сброса пароля, пожалуйста, перейдите по ссылке:</h1>
                        <a href="${link}">${link}</a>
                    </div>`
        })
    }
}


export default new MailService();

