const {
  mongoose,
  userSchema,
  todoSchema,
  user,
  todo,
} = require("../model/model.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "aagayemerimautkatamashadekhne";

// routes for signIn the user
//  enpoint for all the non authenticated user ----------------------------------------------------------
async function userSignUp(req, res) {
  const userDetails = req.body;

  const userName = userDetails.userName;
  const password = userDetails.password;
  const gmail = userDetails.gmail;
  if (!userName || !password || !gmail)
    return res.status(401).send({ err: "Please enter complete details" });
  const alreadyExists = await user.findOne({ userName: userName });
  if (alreadyExists) {
    return res
      .status(401)
      .send({ err: "User is already signedUp with the company" });
  }
  const newUser = await user.create({
    userName: userName,
    password: password,
    gmail: gmail,
  });
  if (newUser) {
    console.log("new user has been created");
    return res
      .status(201)
      .send(`${userName} has successfully signedUp for the application`);
  }

  console.log("User signedUp successfully");
  return res.status(200).send({ msg: "User signedUp successfully" });
}

async function userSignIn(req, res) {
  console.log("We have entered the userSignIn");
  const details = req.body;
  const userName = details.userName;
  const password = details.password;
  // checking if the user is valid or not
  const findUser = await user.findOne({
    userName: userName,
    password: password,
  });
  if (findUser) {
    console.log("user has been find");
    const oid = findUser._id;
    const token = jwt.sign(
      {
        token: oid.toString(),
      },
      JWT_SECRET
    );
    if (token) {
      console.log("token has been generated");
      return res.status(200).send({ token: token });
    }
  } else {
    return res.status(401).send({ err: "The credentials does not exists" });
  }
}

async function authenticateUser(req, res, next) {
  console.log("Entered the authentication");

  const token = req.headers.token;
  if (!token) {
    return res.status(404).send({ err: "Please enter the valid token " });
  }
  console.log("token");
  const temp = jwt.verify(token, JWT_SECRET);
  if (temp) {
    const oid = temp.token;
    // convert back to ObjectId

    const originalUser = await user.findOne({ _id: oid });
    if (originalUser) {
      console.log("User is our authenticated user");
      req.oid = oid;
      next();
    } else {
      console.log("User was not found");
      return res.status(401).send({ error: "User is not signedIn" });
    }
  }
}


//  ------------------------------------------------------------
// endpoints for adding the toDo and performing all the task
async function displaytoDo(req, res) {
  console.log("Entered the display section");
  const oid = req.oid;
  const tasks = await todo.find({userId : oid});
  if(tasks){    
    const userTask = [];
    for(let i = 0 ;i < tasks.length ;i++){
        const taskTitle = tasks[i].title;
        const taskDescription = tasks[i].description;
        userTask.push({taskTitle , taskDescription});
    }
    return res.status(200).send({'tasks' : userTask});
  }
  return res.status(401).send({error : 'There are no tasks to display for the user'});
}

async function addToDo(req, res) {
  console.log("Entered the section to add the task");
  const oid = req.oid;
  console.log(oid);
  const { title, description } = req.body;
  const newTask = await todo.create({
    title: title,
    description: description,
    userId: oid,
  });

  if (newTask) {
    return res
      .status(201)
      .send({ msg: `New to do has been created \n ${newTask} ` });
  } else {
    return res.status(401).send({ error: "Was not able to add the task" });
  }
}










// operations related to certain task or activity
// ----------------------------------------------------------------

async function updateToDo(req,res){
    const {title , todoid , newTask} = req.body;
    if(!title || !todoid || !newTask){
        return res.status(404).send({error : 'Please enter the correct to do'});
    }
    const userFound = await todo.findByIdAndUpdate(todoid,{title : title , description : newTask},{new: true});
    if(userFound){
        
        return res.status(201).send({msg : 'Task Updated Successfully'});
    }
    return res.status(401).send({error : 'The changes were not being updated'});
}


async function deleteToDo(req,res){
    const todoid = req.body.id;
    const deleteTask = await todo.findByIdAndDelete(todoid);
    if(deleteTask){
        return res.status(200).send({msg : 'Task Deleted Successfully'});
    }

    return res.status(404).send({error : 'The todo was not deleted , Please try again'});
}







































//  ---------------------------------------------------------------------
module.exports = {
  userSignUp,
  userSignIn,
  authenticateUser,
  displaytoDo,
  addToDo,
  updateToDo,
  deleteToDo
};
