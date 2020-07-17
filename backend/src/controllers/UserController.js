//INDEX SHOW STORE UPDATE DESTROY 
const {sequelize, Sequelize} = require('../../db/database')

const user = require('../models/users')
const User = user(sequelize, Sequelize)

const login = require('../models/login')
const Login = login(sequelize, Sequelize)

module.exports = {
    async index(req, res){
        
    },
    async store(req, res) {
        var {cpf, senha, nome, telefone, logradouro, numero, bairro, complemento, cidade, estado} = req.body
    
        // Tratamento de erro
        if(telefone.length != 11){
            return res.json({status: 'Telefone Invalido'})
        }
        if(cpf.length != 11){
            return res.json({status: 'CPF Invalido'})
        }
        if(estado.length != 2){
            return res.json({status: 'Estado Invalido'})
        }
        if(!(cpf && senha && nome && telefone && logradouro && numero && bairro && cidade)){
            return res.json({status: 'Parametros fora do escopo'})
        }
        var Users = null;
        Users = await User.findOne({where: {cpf}})
    
        if(Users) {
            return res.json(Users)
        }
        var uri = 'terno.jpeg'
        console.log("cpf "+req.body.cpf)
        Logins = await Login.create({cpf, senha})
        Users = await User.create({cpf, nome, telefone, logradouro, numero, bairro, complemento, cidade, estado, uri})
    
        return res.json(Users)
    },
    async auth(req, res) {
        var {cpf, senha} = req.body

        Logins = await Login.findOne({where: {cpf, senha}})
        Users = await User.findOne({where: {cpf}})

        if(!Logins){
            return res.json({auth: false})
        }
        const json = Object.assign({Users}, {Logins}, {auth: true})
        return res.json(json)
    },
    async image(req, res) {
        const {filename} = req.file
        var {cpf} = req.body
        
        // http://187.111.211.204:3516/files/${this.thumbnail}
        await User.update({ uri: filename }, {
            where: {cpf}
          });
          
        Users = await User.findOne({where: {cpf}})
        return res.json(Users)
    }
}