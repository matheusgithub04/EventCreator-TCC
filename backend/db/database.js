const mysql = require('mysql2')
const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('eventcreator', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
})
//Conexao com banco
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'eventcreator'
});

connection.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
});
 module.exports = {
   connection,
   Sequelize,
   sequelize
 }