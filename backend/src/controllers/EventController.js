//INDEX SHOW STORE UPDATE DESTROY 
const {sequelize, Sequelize} = require('../../db/database')

const event = require('../models/evento')
const Event = event(sequelize, Sequelize)
const match = require('../models/matches')
const Matches = match(sequelize, Sequelize)
const team = require('../models/team')
const Team = team(sequelize, Sequelize)
const api = require('axios')

module.exports = {
    async index(req, res) {
        const {id} = req.params
        Events = await Event.findAll({
            include: ['users'], 
            order: [['id_event','DESC']],
            where: {id_org: id}
        }).catch((e) => {
            return res.json(e)
        })

        return res.json(Events)
    },
    async store(req, res) {
        var {rua, numero, complemento, bairro, cidade, estado, modalidade, datainicio, datafinal, horaevento, qtdParticipantes, id_org} = req.body
        var localidade = null
        console.log(rua, numero, complemento, bairro, cidade, estado, modalidade, datainicio, datafinal, horaevento, qtdParticipantes, id_org)
        if(complemento && bairro) {
            localidade = rua+', '+numero+', ' +bairro+ ',' +complemento+', '+cidade+', '+estado
        }else if(bairro){
            localidade = rua+', '+numero+', ' +bairro+ ', '+cidade+', '+estado
        }else{
            localidade = rua+', '+numero+', '+cidade+', '+estado
        }
        var modalidade = modalidade.toUpperCase()
        // state sempre vai estar true quando criar evento
        var state = true 
    
        if(!(rua && numero && localidade && cidade && estado && modalidade && datainicio && datainicio && horaevento && id_org && qtdParticipantes)){
            return res.json({status: 'Parametros fora do escopo'})
        }
        const {data} = await api.get(`https://nominatim.openstreetmap.org/search?format=json&city=${cidade}&street=${rua}`).catch(async e => {         
            Events = await Event.create({localidade, modalidade, datainicio, datafinal, horaevento, state, id_org, lat: null, lon: null, qtdParticipantes})
            var EventsTrue = Events
            var socketOrg = req.connectedUsers[id_org]
            
            if(socketOrg){
                let {data} = await api.get('http://localhost:3516/event/'+id_org)
                req.io.to(socketOrg).emit('newEvent', data)
            }

            if(EventsTrue){
                let {data} = await api.get('http://localhost:3516/listarAll')
                req.io.emit('eventRecent', data)
            }
            return res.json(EventsTrue)
        })

        if(data.length != 0){
            const {lon, lat} = data[0]
        }else {
            var lon, lat = null
        }
        
        Events = await Event.create({localidade, modalidade, datainicio, datafinal, horaevento, state, id_org, lat, lon, qtdParticipantes})
        var EventsTrue = Events
        var socketOrg = req.connectedUsers[id_org]
        console.log(socketOrg)
        
        if(socketOrg){
            let {data} = await api.get('http://localhost:3516/event/'+id_org)
            req.io.to(socketOrg).emit('newEvent', data)
        }

        if(EventsTrue){
            let {data} = await api.get('http://localhost:3516/listarAll')
            req.io.emit('eventRecent', data)
        }
        res.json(EventsTrue)
    },
    async show(req, res) {
        Events = await Event.findAll({
            include: ['users'], 
            limit : 10,
            order: [['id_event','DESC']],
            where: {state: 1}
        }).catch((e) => {
            return res.json(e)
        })
        return res.json(Events)
    },
    async showAll(req, res) {
        Events = await Event.findAll({
            include: ['users'], 
            order: [['id_event','DESC']],
            where: {state: 1}
        }).catch((e) => {
            return res.json(e)
        })
        return res.json(Events)
    },
    async update(req, res) {

    },
    async destroy(req, res) {
        const {id} = req.params
        const {id_org} = req.body

        Events = await Event.destroy({where:{id_event: id}})
        if(Events){
            let {data} = await api.get('http://localhost:3516/listarAll')
            req.io.emit('eventRecent', data)
            
            if(id_org){
                var socketOrg = req.connectedUsers[id_org]
                
                if(socketOrg){
                    let {data} = await api.get('http://localhost:3516/event/'+id_org)
                    req.io.to(socketOrg).emit('delEvent', data)
                }
            }
        }
        Events = await Event.findOne({where: {id_event: id}})
        console.log(Events)
        return res.json(Events)
    },
    async recent(req, res){
        
        var dataa = new Date()
        var dataHoje
        if(dataa.getMonth() < 10){
            dataHoje = dataa.getFullYear() +'-0'+(dataa.getMonth()+1)+'-'+dataa.getDate()
        }else{
            dataHoje = dataa.getFullYear() +'-'+(dataa.getMonth()+1)+'-'+dataa.getDate()
        }

        Events = await Event.findAll({
            order: [['id_event','DESC']],
            where: [{state: 1}, {id_org: req.params.id}, {datainicio: dataHoje}]
        }).catch((e) => {
            return res.json(e)
        })


        return res.json(Events)
    },
    async evento(req, res) {
        Events = await Event.findOne({
            include: ['users'],
            where: [{id_event: req.params.id}]
        }).catch((e) => {
            return res.json(e)
        })
        
        if(Events === null){
            return res.json({erro: 'Evento deletado ou não existe.'})
        }

        var {data} = await api.get(`http://localhost:3516/team/${Events.id_event}`)
        //api.get(`http://localhost:3516/chaveamento/${id_event}?max=${Events.qtdParticipantes}` )
        
        Matchess = await Matches.findAll({
            include: ['primeiro', 'segundo'],
            where: [{id_evento: req.params.id}]
        }).catch((e) => {
            return res.json(e)
        })
        if(Matchess.length == 0 && data.length != 0){
            if(Matchess.length == 0 && data[data.length-1].id_chaveamento == Events.qtdParticipantes){
                var verificacao = true
                do {
                    console.log('eee')
    
                let {data} = await api.get(`http://localhost:3516/chaveamento/${Events.id_event}?max=${Events.qtdParticipantes}` )
                console.log(data)
                if(data.success == 'eu acho que foi'){
                    verificacao = false
                }
                }while(verificacao)
            }
        }else{
            Teams = await Team.findOne({where: {id_time: Events.win_end}})

            const json = Object.assign({Events}, {Matches: Matchess}, {Vencedor: Teams})
            return res.json(json)
        }
        
        Matchess = await Matches.findAll({
            include: ['primeiro', 'segundo'],
            where: [{id_evento: req.params.id}]
        }).catch((e) => {
            return res.json(e)
        })

        Teams = await Team.findOne({where: {id_time: Events.win_end}})

        const json = Object.assign({Events}, {Matches: Matchess}, {Vencedor: Teams})
        return res.json(json)

    }
}