const log = require("./utils/logger").logger("CRTV", "ERRO")
const nome_controladores = ['produto']
const controladores = {}

for(let nome of nome_controladores) controladores[nome] = require(`./${nome}`)

const executaComando = async (comando, metodo) => {
    try {
        return await comando()
    }
    catch(e){
        log[metodo](e.message)
        return e.message
    }
}

const controlador = require("express").Router()


.get("/:controlador/:comando", async (req, res) => {

    let comando = async () => await controladores[req.params.controlador]["get_"+req.params.comando]()
    res.send( await executaComando(comando, 'get') )
})

.get("/:controlador/:comando/:argumento", async (req, res) => {

    let comando = async () => await controladores[req.params.controlador]["get_"+req.params.comando](req.params.argumento)
    res.send( await executaComando(comando, 'get') )
})

.post("/:controlador/:comando", async (req, res) => {

    let comando = async () => await controladores[req.params.controlador]["post_"+req.params.comando](req.body)
    res.send( await executaComando(comando, 'post') )
})

.delete("/:controlador/:comando",  async (req, res) => {

    let comando = async () => await controladores[req.params.controlador]["delete_"+req.params.comando](req.body)
    res.send( await executaComando(comando, 'delete') )
})

.patch("/:controlador/:comando",  async (req, res) => {

    let comando = async () => await controladores[req.params.controlador]["patch_"+req.params.comando](req.body)
    res.send( await executaComando(comando, 'patch') )
})


module.exports = {controlador}