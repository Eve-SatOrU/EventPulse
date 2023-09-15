const Sequelize = require('sequelize');
const sequelize = require('../util/database'); 
const Event = require('./event');

const Guestbook = sequelize.define('Guestbook', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  comment: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  emoji: Sequelize.STRING,
});

Guestbook.belongsTo(Event, { foreignKey: 'eventId' });

module.exports = Guestbook;