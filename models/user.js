const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
// mongosse run just befor saving a recorde to mongo
userSchema.pre("save", function(next){
   let user = this;
   bcrypt.hash(user.password, 10, function(err, hash){
      if(err) return next(err);
      user.password = hash;
      next();
   });
});

// export model 
module.exports = mongoose.model("User", userSchema);


