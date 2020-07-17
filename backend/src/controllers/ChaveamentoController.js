//INDEX SHOW STORE UPDATE DESTROY 
const {sequelize, Sequelize} = require('../../db/database')

const matches = require('../models/matches')
const Matches = matches(sequelize, Sequelize)
const team = require('../models/team')
const Team = team(sequelize, Sequelize)

module.exports = {
    async index(req, res) {
        var {id} = req.params
        var chave = req.query.max / 2
        var partida = 1
        var array = new Array()
        // INSERT INTO MATCHES VALUES(default, 1, 2, 3, 1, true, 2, 3);
        // INSERT INTO MATCHES VALUES(default, 2, 4, 1, 1, true, 1, 4);
        // var matchLength = await Matches.findAll({where: {id_evento: id}})
        // matchLength.map(item => {
        //     array.push(item.dataValues.pri_part)
        //     array.push(item.dataValues.seg_part)
        // })
        var aux = 1
        var time1 = null
        for(var i = 1; i <= req.query.max; i++) {
            let aleatorio = random(req, res, array)
            array.push(aleatorio)
            console.log('entrouuu  ',aleatorio)
            var teams = await Team.findOne({where: [{id_event: id}, {id_chaveamento: aleatorio}]})
            console.log(teams)
            if(aux == 1){
                time1 = teams
                aux = 2
            }else if(aux == 2){
                var matches = await Matches.create({partida, pri_part: time1.dataValues.id_time, seg_part: teams.dataValues.id_time, id_evento: id, state: true})
                partida++
                aux=1
            }
            
        }

        var socketEvent = req.connectedUsersEvent[id]
        console.log(socketEvent)
        if(socketEvent){
            req.io.emit('chaveamento', {auth: true})
        }

        return res.json({success: 'eu acho que foi'})
        // var match = await Matches.create({partida, pri_part:1, seg_part:4, id_evento:3, state:false})
        //return res.json(matchLength)
        // return res.json({result: random(req, res, [1, 4])})
    },
    async store(req, res) {
    },
    async show(req, res) {
    },
    async update(req, res) {

    },
    async destroy(req, res) {

    }
}
function random(req, res, array) {
    var {max} = req.query
    var min = Math.ceil(1);
    max = Math.floor(max);
    var result

    do {
        result = Math.floor(Math.random() * (max - min + 1)) + min;
            
        var filtered = array.includes(result);
        if(!filtered){
            break
        }

    } while(true)

    return result
}