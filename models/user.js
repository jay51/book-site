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

// authenticate input against database documents
// the static object let you add methods to the schemaModle
userSchema.statics.authenticate = function(email, password, callback){
    // User is definde in the other file (this)
    this.findOne({email: email})
        .exec( function(err, user){
            if (err) return callback(err);
            if(!user) {
                const err = new Error("User not found !");
                err.status = 401;
                return callback(err)
            }
            // user.password: password returned form DB. 
            bcrypt.compare(password, user.password, function(err, result){
                err ? callback(err) : console.log("password was processed by bcrypt");
                if( result === true ) return callback ( null, user);
                return callback();
            });
            
        });
}


// middelware run just befor saving a recorde to mongo
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


