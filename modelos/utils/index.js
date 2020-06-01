const {mailer} = require("./mailer")
const {busca} = require("./busca")
const {insercao} = require("./insercao")
const {manipulacao} = require("./manipulacao")
const {selecao} = require("./selecao")
const {listagem} = require("./listagem")
const {arrays} = require("./arrays")

const estados = {ABRINDO : 1, ABERTO : 2, FECHADO : 3, ARQUIVADO : 4} 

module.exports = {mailer,busca, insercao, manipulacao, listagem, arrays,  selecao, estados}