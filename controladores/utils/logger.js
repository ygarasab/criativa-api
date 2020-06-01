const {logtime} = require("./logtime")

const logger = (nomeEscola, nomeControlador) => {

    const loga = (metodo, mensagem) =>     
        console.log(`[ ${logtime()} ] [ ${nomeEscola} ] [ API ] [ ${nomeControlador} ] [ ${metodo} ] ${mensagem}`)

    

        

    return {

        get : mensagem => loga('GET', mensagem),
        post : mensagem => loga('PST', mensagem),
        delete : mensagem => loga('DEL', mensagem),
        patch : mensagem => loga('PTH', mensagem),
        sucesso : mensagem => {

            loga('SCS', mensagem)
            return "ok"

        }

    }

}

module.exports = {logger}