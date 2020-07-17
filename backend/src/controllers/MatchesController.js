//INDEX SHOW STORE UPDATE DESTROY 
const {sequelize, Sequelize} = require('../../db/database')

const match = require('../models/matches')
const Match = match(sequelize, Sequelize)
const api = require('axios')

module.exports = {
    async index(req, res){
        
    },
    async store(req, res) {
        var {partida, pri_part, seg_part, id_evento, state, resultado, perdedor} = req.body
        
        if(!(partida && pri_part && seg_part && id_evento)){
            return res.json({status: 'Parametros fora do escopo'})
        }
        if(state == undefined) {
            return res.json({status: 'Parametros fora do escopo'})
        }
    
        Matches = await Match.create({partida, pri_part, seg_part, id_evento, state, resultado, perdedor}).catch((e) => {
            return res.json(e)
        })

        let {data} = await api.post(`http://localhost:3516/event/matches/${Matches.id_evento}`)
        req.io.emit(''+id_evento, data)

        Matches = await Match.findOne({
            include: ['primeiro', 'segundo'],
            where:{id_matches: Matches.id_matches}
        })
        return res.json(Matches)
    },
    async update(req, res) {
        var {id, perdedor, resultado, state} = req.body
            
        Matches = await Match.update({perdedor, resultado, state}, {where: {id_matches: id}}).catch((e) => {
            return res.json(e)
        })

        if(Matches && state == false){
            let {data} = await api.get('http://localhost:3516/listarAll')
            req.io.emit('eventRecent', data)

            let response = await api.get('http://localhost:3516/bestWinners')
            req.io.emit('winners', response.data)
        }
        
        Matches = await Match.findOne({
            include: ['primeiro', 'segundo'],
            where: {id_matches: id}}).catch((e) => {
            return res.json(e)
        })
        
        let {data} = await api.post(`http://localhost:3516/event/matches/${Matches.id_evento}`)
        req.io.emit(''+Matches.id_evento, data)

        return res.json(Matches)
    }
}