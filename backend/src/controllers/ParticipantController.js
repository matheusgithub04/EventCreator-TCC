//INDEX SHOW STORE UPDATE DESTROY 
const {sequelize, Sequelize} = require('../../db/database')

const participant = require('../models/participants')
const Participant = participant(sequelize, Sequelize)

const user = require('../models/users')
const User = user(sequelize, Sequelize)

const team = require('../models/team')
const Team = team(sequelize, Sequelize)

const api = require('axios')

module.exports = {
    async index(req, res) {
        var {query, type} = req.body
        var userArray = new Array()
        Users = await User.findAll()
        Participants = await Participant.findAll()
        if(type == 'CPF'){
            query = query.replace('.', '').replace('.', '').replace('-', '')
        }
        
        Users.map(userr => {
            if(type == 'CPF') {
                if(userr.cpf.includes(query)){
                    userArray.push(userr)
                }
    
                Participants.map(partcs => {
                    if(userr.cpf.includes(query)){
                        if(userr.id_users == partcs.id_part){
                            userArray.pop(0)
                        }
                    }
                })
            }else if(type == 'name') {
                if(userr.nome.toUpperCase().includes(query.toUpperCase())){
                    userArray.push(userr)
                }
    
                Participants.map(partcs => {
                    if(userr.nome.toUpperCase().includes(query.toUpperCase())){
                        if(userr.id_users == partcs.id_part){
                            userArray.pop(0)
                        }
                    }
                })
            }
        })
        
        return res.json(userArray)
    },
    async show(req, res) {
        const {id} = req.params

        Participants = await Participant.findOne({where: {id_part: id}})

        if(Participants === null){
            return res.json({erro: 'Nenhum time encontrado.'})
        }

        Teams = await Team.findOne({where: {id_time: Participants.id_team}})
        var t = Teams
        Participants = await Participant.findAll({where: {id_team: Teams.id_time}, include: ['user']})

        var jsonConjuct = Object.assign({Teams: t}, {Participants})
        return res.json(jsonConjuct)
    },
    async store(req, res) {
        var {participantes, id_team} = req.body

        if(!(participantes && id_team)){
            return res.json({status: 'Parametros fora do escopo'})
        }    

        if(participantes.length == 1) {
            Participants = await Participant.findAll({where: {id_team}})
            if(Participants.length == 16){
                return res.json({erro: 'Limite maximo de participantes'})
            }
            Participants = await Participant.create({id_part: participantes[0], id_team}).catch((e) => {
                return res.json(e)
            })
        }else{
            for(var i = 0; i < participantes.length; i++){
                Participants = await Participant.findAll({where: {id_team}})
                if(Participants.length == 16){
                    return res.json({erro: 'Limite maximo de participantes'})
                }
                Participants = await Participant.create({id_part: participantes[i], id_team}).catch((e) => {
                    return res.json(e)
                })
            }
        }

        Participants = await Participant.findAll({where: {id_team}, include: ['user']})
        var jsonConjuct = Object.assign({Participants}, {type: 'store'})
        req.io.emit(id_team, jsonConjuct)
        return res.json(Participants)
    },
    async destroy(req, res) {
        const {id_part, id_team} = req.body
        if(!id_part && !id_team) {
            return res.json({erro: 'Parametros fora do escopo.'})
        }
        Participants = await Participant.destroy({where: {id_part}})

        Participants = await Participant.findAll({where: {id_team}, include: ['user']})

        var jsonConjuct = Object.assign({type: 'destroy'}, {Participants})
        req.io.emit(id_team, jsonConjuct)
        return res.json(Participants)
    },
    async passLeader(req, res) {
        const {id_part, id_team} = req.body
        if(!id_part && !id_team) {
            return res.json({erro: 'Parametros fora do escopo.'})
        }
        Teams = await Team.update({id_part},{where: [{id_time: id_team}]})

        Teams = await Team.findOne({where: {id_time: id_team}})

        Participants = await Participant.findAll({where: {id_team: Teams.id_time}, include: ['user']})

        var jsonConjuct = Object.assign({Teams}, {Participants}, {type: 'passLeader'})
        req.io.emit(id_team, jsonConjuct)
        return res.json(jsonConjuct)
    }
}