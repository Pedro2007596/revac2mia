const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const { type } = require("express/lib/response");
const req = require("express/lib/request");
const res = require("express/lib/response");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/test',
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000
});

const PessoSchema = new mongoose.Schema({
    nome: {type : String},
    email: {type : String, require : true},
    endereco: {type : String},
    numero: {type : Number},
    cep: {type : String, require : true},
    nacsimento:{type : Date, require : true}
});

const Pessoa = mongoose.model("Pessoa",PessoSchema);

app.post("/cadastropessoa", async(req, res)=>{
    const nome = req.body.nome;
   const email = req.body.email;
   const endereco = req.body.endereco;
   const numero = req.body.numero;
   const cep = req.body.cep;
   const nascimento = req.body.nacsimento


   if(nome == null|| email == null || endereco == null || numero == null || cep == null || nascimento == null){
    return res.status(400).json({error : "Preencha todos os campos"});
   };

   const emailExiste = await Pessoa.findOne({email:email})

   const pessoa = new Pessoa ({
    nome: nome,
    email: email,
    endereco: endereco,
    numero: numero,
    cep: cep, 
    nascimento: nascimento
   })

   try{
    const newPessoa = await pessoa.save();
    res.json({error : null, msg : "cadastro ok", pessoaId : newPessoa._id});
   }catch(error){
        res.status(400).json({error});
   }
   });

   app.get("/", async(req, res)=>{
    res.sendFile(__dirname +"/index.html");
})


//configurando a porta
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`);
})

app.get("/cadastropessoa", async(req, res)=>{
    res.sendFile(__dirname +"/cadastropessoa.html");
})

app.get("/", async(req, res)=>{
    res.sendFile(__dirname + "/index.html");
})