const express = require("express");
const router = express.Router();
const { userSignUp , userSignIn , displaytoDo  , authenticateUser , addToDo , updateToDo , deleteToDo} = require("./routeHandler.js");

// signIn and signUp for the new User
router.post('/signUp',userSignUp);
router.post('/signIn',userSignIn);


// all the authenticated user's task and operations
router.post('/me/addtodo', authenticateUser, addToDo);
router.get('/me/todo', authenticateUser , displaytoDo);

router.put('/me/update',authenticateUser , updateToDo);

router.delete('/me/delete',authenticateUser , deleteToDo);




module.exports = router;