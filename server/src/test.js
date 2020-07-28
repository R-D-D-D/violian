//var pg = require('pg');
var conString = "postgres://runding:wangrun123ding@rhythm-academy.cz7i91nic2ll.ap-southeast-1.rds.amazonaws.com:5432/rhythmacademy";
const { Sequelize } = require('sequelize');

// Option 1: Passing a connection URI
const sequelize = new Sequelize(conString) 

sequelize.authenticate().then(() => console.log('success'))