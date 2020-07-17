const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const Routes = require('./src/routes')
const cors = require('cors')
const path = require('path')

const socketio = require('socket.io')
const http = require('http')

const server = http.Server(app)
const io = socketio(server) 

const connectedUsers = {}
const connectedUsersEvent = {}

io.on('connection', socket => {
    console.log('Usuario conectado, id: ', socket.id)
    const {user_id} = socket.handshake.query
    const {id_event} = socket.handshake.query

    if(user_id){
        connectedUsers[user_id] = socket.id
    }

    if(id_event){
        connectedUsersEvent[id_event] = socket.id
    }

    socket.on('disconnect', data => {
        console.log('Usuario desconectou: ', socket.id)
        connectedUsers[user_id] = undefined
        connectedUsersEvent[id_event] = undefined
    });

})

app.use((req, res, next)=>{
    req.io = io
    req.connectedUsers = connectedUsers
    req.connectedUsersEvent = connectedUsersEvent
    return next()
})
app.get('/sockets', (req, res) => {
    return res.json(connectedUsers)
})
app.get('/socketsEvent', (req, res) => {
    return res.json(connectedUsersEvent)
})

// Configurando
    // Template engine
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    // Body parser
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())

// Rotas
app.use(Routes) 
app.use(cors())
app.use(express.json())     

app.use('/files', express.static(path.resolve(__dirname, 'uploads')))

// Portal
server.listen(3516, () =>{
    console.log('Servidor está rodando.')
})