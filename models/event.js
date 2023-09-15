const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');

const Event = sequelize.define('Event', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
 });
 
//  accosiation of user also 
Event.belongsTo(User, { foreignKey: 'userId' });
 module.exports = Event;
 

//  add image later
