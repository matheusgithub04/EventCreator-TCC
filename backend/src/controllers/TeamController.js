//INDEX SHOW STORE UPDATE DESTROY 
const {sequelize, Sequelize} = require('../../db/database')

const team = require('../models/team')
const Team = team(sequelize, Sequelize)
const event = require('../models/evento')
const Event = event(sequelize, Sequelize)
const participant = require('../models/participants')
const Participant = participant(sequelize, Sequelize)
const user = require('../models/users')
const User = user(sequelize, Sequelize)
const api = require('axios')
const { image } = require('./UserController')
const { map } = require('mysql2/lib/constants/charset_encodings')

module.exports = {
    async show(req, res){
        const {id_event} = req.params

        Teams = await Team.findAll({where:{id_event}})
        
        return res.json(Teams)
        
    },
    async store(req, res) {
        var {nome_time, id_part, id_event, modalidade, ver, id_time} = req.body
        var modalidade = modalidade.toUpperCase()
        const status = true
    
        if(!(nome_time && id_part && modalidade && ver)){
            return res.json({status: 'Parametros fora do escopo'})
        }

        if(ver == 3 && modalidade == 'FUTEBOL') {
            Teams = await Team.findAll({where: [{id_part}, {status: true}, {modalidade: 'FUTEBOL'}]})
            if(Teams.length > 0){
                return res.json({erro: 'Voce só pode ter um time por usuario'})
            }    
            Participants = await Participant.findOne({where: {id_part}})

            if(Participants === null){
                Teams = await Team.create({nome_time, id_part, id_event, status, id_chaveamento: 0, modalidade, uri: 'peixeOTP.png'})
                Participants = await Participant.create({id_part, id_team: Teams.id_time})
                return res.json(Teams)
            }

            Teams = await Team.findOne({where: {id_time: Participants.id_team}})
            if(Teams.status != true || Teams !== null){
                return res.json({erro: 'Voce nao pode criar um time, pois ja está participando de um.'})
            }

            
        }

        Teams = await Team.findOne({
            where: {id_event},
            order: [['id_chaveamento', 'DESC']]
        })
        var id_chaveamento
        if(Teams !== null) {
            id_chaveamento = Teams.id_chaveamento + 1
        } else {
            id_chaveamento = 1
        }

        Events = await Event.findOne({where: {id_event}})
        if(Events.qtdParticipantes < id_chaveamento) {
            return res.json({erro: 'Evento fechado.'})
        }

        if(modalidade.toUpperCase() == 'LUTA'){
            Users = await User.findOne({where: {id_users: id_part}})
            Teams = await Team.create({nome_time: Users.nome, id_part, id_event, status, id_chaveamento, modalidade, uri: Users.uri})
        }else if(modalidade.toUpperCase() == 'FUTEBOL' && ver == 3){
            Teams = await Team.create({nome_time, id_part, id_event, status, id_chaveamento, modalidade, uri: 'terno.png'})
        }else if(modalidade.toUpperCase() == 'FUTEBOL' && ver == 2){
            Teams = await Team.update({id_chaveamento, modalidade, id_event, nome_time}, {where: {id_time}})
        }
        
        if(Events.qtdParticipantes == id_chaveamento){
            
            api.get(`http://localhost:3516/chaveamento/${id_event}?max=${Events.qtdParticipantes}` )
            
        }

        return res.json(Teams)
    },
    async destroy(req, res) {
        const {id, id_event} = req.params

        Teams = await Team.destroy({where: [{id_part: id}, {id_event}]})

        return res.json(Teams)
    },
    async verification(req, res){
        const {id, id_event, modalidade} = req.body
        let response = await api.get('http://localhost:3516/searchTeam/'+id)

        if(response.data.erro) {
            return res.json(response.data)
        }

        if(response.data.Teams.id_part != id){
            return res.json({erro: 'Voce não pode registrar seu time, pois voce não é o líder.'})
        }
        
        Teams = await Team.findAll({where: [{id_part: id}, {status: true}, {modalidade: 'FUTEBOL'}]})

        if(Teams.length == 0) {
            return res.json({error: 'É necessario criar um time para participar deste evento. Deseja criar um time?'})
        }

        var nTime = Teams[Teams.length-1].id_time

        if(Teams.length > 1) {
            Teams = await Team.destroy({where: [{id_time: nTime}]})
        }else if(Teams.length == 1){
            Participants = await Participant.findAll({where: [{id_team: nTime},]})
            if(Participants.length < 11){
                return res.json({erro: 'Seu time não possui participantes o suficiente.'})
            }
            if(Participants.length > 16) {
                return res.json({erro: 'Seu time tem mais participantes do que o permitido.'})
            }
            //console.log(Teams[0].nome_time+'       /    '+ id + '        /    ' + id_event +'    /    ' + modalidade)
            var {data} = await api.post(`http://localhost:3516/cadTeam`, {
                nome_time: Teams[0].nome_time, 
                id_part: id, 
                id_event: id_event,
                id_time: Teams[0].id_time,
                modalidade: "futebol",
                ver: 2
            })
            
            var {data} = await api.get(`http://localhost:3516/team/${id_event}`)
            return res.json(data)
            
            // Teams = await Team.update({id_event}, {id_time: nTime})
        }

        return res.json(Teams)
    },
    async update(req, res) {
        const {id, id_event} = req.params

        Teams = await Team.findOne({where: [{id_part: id}, {status: true}, {modalidade: 'FUTEBOL'}]})
        Teams = await Team.update({id_chaveamento: 0, modalidade: "FUTEBOL", id_event: null, nome_time: Teams.nome_time}, {where: {id_time: Teams.id_time}})
        console.log(id, id_event)
        var {data} = await api.get(`http://localhost:3516/team/${id_event}`)

        return res.json(data)
    },
    async image(req, res) {
        const {filename} = req.file
        var {id_time} = req.body
        
        // http://187.111.211.204:3516/files/${this.thumbnail}
        await Team.update({ uri: filename }, {
            where: {id_time}
          });
          
        Teams = await Team.findOne({where: {id_time}})
        return res.json(Teams)
    }, 
    async best(req, res) {

        Teams = await Team.findAll({
            where: [{modalidade: "FUTEBOL"}],
            limit: 10, 
            order: [['wins', 'DESC']]
        })
        Users = await User.findAll({
            limit: 10, 
            order: [['wins', 'DESC']]
        })
        var arrayNew = new Array()
        // arrayNew.concat(Teams.dataValues)
        Teams.map(data => {
            arrayNew.push(data)
        })
        Users.map(data => {
            arrayNew.push(data)
        })
        // Teams.map(te => {
        //     // if(te.wins != 0){
        //         arrayNew.push(te)
        //         Users.map(us => {
        //             if(te.wins < us.wins){
        //                 arrayNew.pop(0)
        //             }else{
        //                 arrayNew.pop(0)
        //                 arrayNew.push(te)
        //             }
        //         })
        //     // }
        // })
        var newArray = arrayNew.sort(function(a,b) {
            return b.wins - a.wins
        })
        var ArrayFinal = []
        for(var i = 0; i < newArray.length && i < 10; i++){
            ArrayFinal.push(newArray[i])
            
            if(i == 9) {
                return res.json(ArrayFinal)
            }
        }
        return res.json(newArray)
    },
    async updateName(req, res) {
        const {id, name} = req.params

        Teams = await Team.update({nome_time: name}, {where: {id_time: id}})

        Teams = await Team.findOne({where: {id_time: id}})
        return res.json(Teams)
    }
}
// include: ['users'], 
// limit : 10,
// order: [['id_event','DESC']],
// where: {state: 1}