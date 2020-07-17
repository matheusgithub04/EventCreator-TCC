const express = require('express')
const routes = express.Router()
//const connection = require('../db/database')

// ROTAS Inuteis kkkk -----------
routes.get('/home', (req, res) => {
    res.send('<h1>BEM-VINDO</h1>')
})

routes.get('/cad', (req, res) =>{
    res.render('cadLoginUser')
})

routes.get('/cadEventLayout', async (req, res) =>{
    res.render('cadEvento')
})
// --------------------------

const UserController = require('./controllers/UserController')
const EventController = require('./controllers/EventController')
const TeamController = require('./controllers/TeamController')
const ParticipantController = require('./controllers/ParticipantController')
const MatchesController = require('./controllers/MatchesController')
const ChaveamentoController = require('./controllers/ChaveamentoController')

const multer = require('multer')
const uploadConfig = require('../config/upload.js')
const uploadMiddleware = multer(uploadConfig)
// 
routes.post('/images', uploadMiddleware.single('file'), UserController.image)

//Usuarios
routes.post('/cadall', UserController.store) 
routes.post('/auth', UserController.auth) 

//Eventosv
routes.post('/cadEvent', EventController.store)
routes.get('/listEvent', EventController.show)
routes.get('/listarAll', EventController.showAll)
routes.get('/event/:id', EventController.index)
routes.post('/event/:id', EventController.recent)
routes.post('/event/matches/:id', EventController.evento)
routes.post('/event/delete/:id', EventController.destroy)//NOVO

//Participantes
routes.post('/cadParticipant', ParticipantController.store)
routes.post('/delete/participante', ParticipantController.destroy)
routes.post('/listParticipants', ParticipantController.index)
routes.get('/searchTeam/:id', ParticipantController.show)
routes.post('/pass/leader', ParticipantController.passLeader)

//Partidas
routes.post('/cadMatches', MatchesController.store)
routes.post('/updtMatches', MatchesController.update)

//Chaveamento
routes.get('/chaveamento/:id', ChaveamentoController.index)
routes.get('/bestWinners/', TeamController.best)

//Update name team
routes.get('/team/:id/:name', TeamController.updateName)//NOVO


routes.post('/cadTeam', TeamController.store)
routes.post('/team/futebol/:id/:id_event', TeamController.update)
routes.post('/verification/team', TeamController.verification)
routes.get('/team/:id_event/', TeamController.show)//NOVO
routes.post('/team/delete/:id/:id_event', TeamController.destroy)//NOVO

routes.post('/images/time', uploadMiddleware.single('file'), TeamController.image)

module.exports = routes 