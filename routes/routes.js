const express =require("express");
const router = express.Router();
const usercontroller = require('../controllers/controller');

router.get("/" ,usercontroller.getindex);
router.get("/register" ,usercontroller.getRegister);
router.post("/register" ,usercontroller.postRegister);
router.get("/login" ,usercontroller.getLogin);
router.post("/login" ,usercontroller.postLogin);
router.get('/profile/:id',usercontroller.getprofile);
router.get("/logout" ,usercontroller.getLogout);
router.get("/contact",usercontroller.getContact);
// event routers
// get all event
router.get("/events" ,usercontroller.getevents);
// get event by id
router.get("/event/:eventId" ,usercontroller.getEventByid);
// create guestbook
router.post("/event/:eventId/guestbook" ,usercontroller.createGuestbookEntry);
// create event
router.get('/create', usercontroller.getCreateEvent);
router.post('/create', usercontroller.postCreateEvent);

// update event
router.get('/event/:eventId/update', usercontroller.getUpdateEvent);
router.post('/event/:eventId/update', usercontroller.postUpdateEvent);
router.post('/event/:eventId/delete', usercontroller.deleteEvent);

module.exports=router;