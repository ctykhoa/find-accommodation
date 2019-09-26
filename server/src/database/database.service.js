const mongoose = require("mongoose");
const DB_URI = process.env.DB_URI

const options = {
    useNewUrlParser: true,
    useCreateIndex: true
};

function connect() {
    mongoose.set('useFindAndModify', false);
    return mongoose.connect(DB_URI, options, err => {
        console.log(err || "Database connected");
    });
}

module.exports = {
    connect
};