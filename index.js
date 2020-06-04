const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser')
const { Client } = require('pg');
const getter = require('./modelos/getter');
const poster = require('./modelos/poster');
const {databaseOptions} = require('./config');

const urlParser = bodyParser.urlencoded({extended:false})



class API {

    constructor(){
  
        this.app = express();
        this.server = http.createServer(this.app);

        this.db = new Client(databaseOptions)


        this.db.connect();


        this.get = getter.loadGetter(this.db)
        
        this.post = poster.loadPoster(this.db)
        

        this.port = process.env.PORT || 5000;

        this.app
        
        .use(express.urlencoded())

        .use(express.json())

        .use(cors())

        .get("/:comando/", async (req, res) => {

            

            try{
                res.send( await this.get["executa_"+req.params.comando]() )
            }
            catch(_){

                res.send("Comando inválido")
                
            }
        })

        .get("/:comando/:parametro", async (req, res) => {

            

            try{
                res.send( await this.get["executa_"+req.params.comando](req.params.parametro) )
            }
            catch(_){

                res.send("Comando inválido")
                
            }
        })

        .get("/:comando/:parametro1/:parametro2", async (req, res) => {

            try{
                res.send( await this.get["executa_"+req.params.comando](req.params.parametro1, req.params.parametro2) )
            }
            catch(_){

                res.send("Comando inválido")
                
            }
        })

        .get("/:comando/:tabela/:coluna/:valor", async (req,res) => {
        
            try{
                res.send( await this.get["executa_"+req.params.comando](req.params.tabela, req.params.coluna, req.params.valor))
            }
            catch(_){

                res.send("Comando inválido")
                
            }
        })
  
        .post("/:comando", async (req, res) => {

            try{
                res.send( await this.post["executa_"+req.params.comando](req.body))
            }
            catch(e){
                console.log(e)
                res.send("Comando inválido")
                
            }
        })

        .post("/:comando/:parametro", async (req, res) => {
            

            try{
                res.send( await this.post["executa_"+req.params.comando](req.body, req.params.parametro) )
            }
            catch(_){

                res.send("Comando inválido")
                
            }
        })

    

        this.server.listen(this.port, _ => console.log(`[ CRT ]  Listening on port ${this.port}`))

    }

    

}

api = new API();
