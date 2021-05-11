const { Router } = require("express");
const userController = require("../Controllers/userController");
const taskController = require("../Controllers/taskController");
const messageController = require("../Controllers/messageController");
const router = new Router();
const Auth = require("../Middlewares/auth");

//Generella endpoints
router.post("/authenticate", userController.login); //Added
router.get("/me", Auth.user, userController.me); //Added me, with working auth(send token in header at req)
router.patch("/me", Auth.user, userController.updateUserProfile);
router.get("/users", Auth.user, userController.getUserByName); //http://localhost:5000/users?name=kaj Dabrowski
router.get("/users/:id", Auth.user, userController.getOneUser);
//Admin endpoints
router.post("/users", userController.register);
router.patch("/users/:id", Auth.admin, userController.updateUser);
router.delete("/users/:id", Auth.admin, userController.deleteUser);

//Worker endpoints
router.post("/tasks", Auth.worker, taskController.createTask);
router.get("/tasks", Auth.worker, taskController.getTaskById); //(http://localhost:5000/tasks?reciverId=5() Hämtar ett ärende
router.post("/tasks/:id/messages", Auth.user, messageController.createMessage);

//client endpoints

router.get("/gettasks", Auth.client, taskController.getClientTasks); //Hämtar kundens ärenden

module.exports = router;
