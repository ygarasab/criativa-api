const nodemailer = require("nodemailer")
const { emailOptions } = require("../../config")

const mailer = () => ({

    enviaEmail : async (assunto, texto, destinatario) =>{

        let transporter = nodemailer.createTransport(emailOptions);
        let estruturaEmail = {
            from : emailOptions.auth.user,
            to : destinatario,
            subject : assunto,
            html : texto
        }
        

        let promise = new Promise(
            (solve, reject) =>   transporter.sendMail(estruturaEmail, (error, info) => {
                if (error) {
                  reject(error)
                  solve(error)
                } else solve(true)
              })
        )
        try {
            let x = await promise;
        }
        catch (e) {
            throw e
        }

      
    }

})

module.exports = {mailer}