const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        // trim will remove any unwanted white-space
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    favoriteBook: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

// export model 
module.exports = mongoose.model("User", userSchema);


