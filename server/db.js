const mongoose = require("mongoose");

function Connection() {
     const mongoURI = "mongodb+srv://amitt:BwMOBe31lgZs2sbC@cluster0.t6n5j.mongodb.net/chatapp2?retryWrites=true&w=majority";
    mongoose.connect(mongoURI)
    .then(() => {
        console.log("connected to mongoDB");
    })
    .catch((err) => {
        console.log(err);
    });
}

module.exports = Connection;