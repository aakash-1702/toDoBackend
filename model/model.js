const mongoose = require('mongoose');
mongoose.
        connect('mongodb://127.0.0.1:27017/toDo').then(() => {console.log('MongoDB is connected ')}).catch(err => console.log('There was the error while creating this mongoDB' , err));



const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    gmail : {
        type : String,
        required : true,
        unique : true
    }    
});

const todoSchema = new mongoose.Schema({
    
    title : {
        type :String,
        required : true
    },
    description : {
        type : String,        
    },
    userId : {
        type : String,
        required : true
    }
    
});


const user = mongoose.model('User',userSchema,'users');
const todo = mongoose.model('toDo',todoSchema,'toDo');

module.exports = {mongoose , userSchema , todoSchema , user , todo};
