// what is the endgoal , the endgoal is to make a temp array , which will have the toDo's of the user and will get access to those toDo's on the basis of authentication and other things
const express = require("express");
const app = express();
const router = require("./routes/routes.js");
app.use(express.json());
const PORT = 8000;

app.use('/users',router);

// every endpoint will be hit at /users/*****
app.listen(PORT, () => {
  console.log(`Server is running at port : ${PORT}`);
});

