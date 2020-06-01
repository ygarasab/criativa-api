const express = require('express');
const cors = require('cors');
const http = require('http');
const {controlador} = require("./controladores")
const {logtime} = require("./controladores/utils/logtime")


const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 5000;

app

.use(express.urlencoded())

.use(express.json())

.use(cors())

.use("/", controlador)

server.listen(port, _ => console.log(`[ ${logtime()} ] [ CRTV ] [ API ] [ WAKE ] Ouvindo a porta ${port}`))