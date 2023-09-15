const User = require('../models/user');
const Event = require('../models/event');
const Guestbook = require('../models/guestbook');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { Op } = require('sequelize');
//index
exports.getindex = async(req, res, next) => {
  const user = req.session.user;
  res.render('index', { user});
}
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt();
    user.userPassword = await bcrypt.hash(user.userPassword, salt);
  });
//login and register
exports.getRegister = (req, res, next) => {
    res.render('register', {
      path: '/register',
      pageTitle: 'register'
    });
  };
  function validateStrongPassword(password) {
    // Password must be at least 8 characters long
    if (password.length < 8) {
      return false;
    }
  
    // Password must contain a combination of letters, numbers, and special characters
    const letterRegex = /[a-zA-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*]/;
  
    if (!letterRegex.test(password) || !numberRegex.test(password) || !specialCharRegex.test(password)) {
      return false;
    }
  
    return true;
  }
  exports.postRegister = async (req, res, next) => {
      const { userName, userPassword, email } = req.body;
    
      // Perform input validation
      if (!validateStrongPassword(userPassword)) {
        return res.render('register', { error: 'Password must be at least 8 characters long and contain a combination of letters, numbers, and special characters.' });
      }
    
      // Check if username or email is already taken
      const existingUser = await User.findOne({
        where: { 
          [Op.or]: [
            { userName },
            { email }
          ]
        }
      });
      if (existingUser) {
        return res.render('register', { error: 'Username or email is already taken.' });
      }
      try {
        const user = await User.create({
          userName,
          userPassword,
          email
        });
        res.redirect('/login');
      } catch (error) {
        res.render('register', { error: 'Error creating user.' });
      }
    };
      
  exports.getLogin = (req, res, next) => {
    res.render('login', {
      path: '/login',
      pageTitle: 'login'
    });
  };
  exports.postLogin= (async (req, res) => {
    const { userName, userPassword } = req.body;
    const user = await User.findOne({ where: { userName } });
    if (!user) {
      return res.status(500).send('Something broke!');
    }
    const isPasswordValid = await bcrypt.compare(userPassword, user.userPassword);
    if (!isPasswordValid) {
      return res.status(500).send('your password wrong try again!');
    }
    else{
      req.session.user = user;
      req.session.userId = user.id; 
      res.redirect('/');
        }
  });
  //profile
  exports.getprofile = async (req, res) => {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!req.session.user) {
      return res.redirect('/login');
    }
    res.render('profile', { user }); 
  };
    //logout
    exports.getLogout=async(req, res) => {
    console.log("User in session:", req.session.user);
      req.session.destroy();
      res.redirect('/');
  };  
  
  //contact
  exports.getContact = async(req, res, next) => {
    const user = req.session.user;
    res.render('contact', {
      path: '/contact',
      pageTitle: 'contact',user
    });
  }


//   event party
// get all event
exports.getevents = async(req,res) =>{
try{
    const user = req.session.user;
    const events = await Event.findAll();
    res.render('event-list' ,{events ,user});

}catch(error){
    console.error(error);
    res.status(500).json({ error: 'Could not retrieve events' });
}
}
// get eventby id
exports.getEventByid = async (req, res) => {
    try {
      const user = req.session.user;
      const eventId = req.params.eventId;
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      const guestbook = await Guestbook.findAll({ where: { eventId } });
      res.render('event-details', { event, guestbook,user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not retrieve event details' });
    }
  };
// create guestbook
exports.createGuestbookEntry = async (req, res) => {
    try {
      const { comment, emoji } = req.body;
      
      if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'You must be logged in to post a comment.' });
      }
  
      const username = req.session.user.userName;
      const eventId = req.params.eventId;
      const event = await Event.findByPk(eventId);
  
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      const newEntry = await Guestbook.create({ name: username, comment, emoji, eventId });
      res.redirect(`/event/${eventId}`); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating guestbook entry.' });
    }
  };
  // create event
exports.getCreateEvent = async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).json({ error: 'User not authenticated.' });
        }
    res.render('create-event', { user: user });
  };
//    event create
exports.postCreateEvent = async (req, res) => {
    try {
      const { name, date, location,description } = req.body;
      const user = req.session.user; 
  
      if (!user) {
        return res.status(401).json({ error: 'User not authenticated.' });
      }
        const newEvent = await Event.create({
        name,
        location,
        description,
        date,
        userId: user.id, // Associate the event with the authenticated user
      });
      res.redirect('/events');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating event.' });
    }
  };
    
// update event
exports.getUpdateEvent = async (req, res) => {
    const eventId = req.params.eventId;
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ error: 'User not authenticated.' });
      }
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      if (event.userId !== user.id) {
        return res.status(403).json({ error: 'Permission denied. You do not own this event.' });
      }
      res.render('update-event', { event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not retrieve event details' });
    }
  };
  
  exports.postUpdateEvent = async (req, res) => {
    const eventId = req.params.eventId;
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ error: 'User not authenticated.' });
      }
      const { name, date, location, description } = req.body;
      const [updatedEvent] = await Event.update(
        { name, date, location, description },
        { where: { id: eventId, userId: user.id } }
      );
      if (updatedEvent === 0) {
        return res.status(404).json({ error: 'Event not found or permission denied.' });
      }
      res.redirect(`/event/${eventId}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating event.' });
    }
  };
  exports.deleteEvent = async (req, res) => {
    const eventId = req.params.eventId;
    try {
      const user = req.session.user;
      if (!user) {
        return res.status(401).json({ error: 'User not authenticated.' });
      }
      const event = await Event.findByPk(eventId);
      if (!event || event.userId !== user.id) {
        return res.status(404).json({ error: 'Event not found or permission denied.' });
      }
      await event.destroy();
      res.redirect('/events');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting event.' });
    }
  };
    