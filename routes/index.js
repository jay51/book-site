const express = require("express");
const router = express.Router();
const  User = require("../models/user");

// GET /login
router.get("/login", function(req, res, next) {
  return res.render("login", {title: "Log In"});
});

// POST /login
router.post("/login", function(req, res, next) {
    if(req.body.email && req.body.password){
      User.authenticate(req.body.email, req.body.password, function (error, user){
        // if any error returned or no user returned
        if(error || !user){
          const err = new Error("Wrong email or password !");
          err.status = 401;
          return next(err);
        }
        req.session.userId = user._id;
        return res.redirect("/profile");
      });
      
    }else{
      const err = new Error("Email and password are required");
      err.status = 401;
      return next(err);
    }
});

// GET /logout
router.get("/logout", function(req, res, next){
  if(req.session){
    // delete session
    req.session.destroy(function(err){
      if(err) return next(err);
      return res.redirect("/");
    });
  } else{ return res.redirect("/");}
});


// GET /profile
router.get("/profile", function(req, res, next) {
  // check for session id, if no session then user is not loged in
  if(!req.session.userId){
    const err = new Error("you're not autherized t view this page");
    err.status = 403;
    return next(err);
  }
  // if loged in find and display user's data
  User.findById(req.session.userId).exec(function(err, user){
      if(err) return next(err);
      
      return res.render("profile", {title: "profile", name: user.name, favorite: user.favoriteBook});
    });
});

// GET /
router.get("/", function(req, res, next) {
  return res.render("index", { title: "Home" });
});

// GET /about
router.get("/about", function(req, res, next) {
  return res.render("about", { title: "About" });
});

// GET /contact
router.get("/contact", function(req, res, next) {
  return res.render("contact", { title: "Contact" });
});

// GET /register
router.get("/register", function(req, res, next) {
   return res.render("register", {title: "sign up"});
});

// POST /register
router.post("/register", function(req, res, next){
  
  if(
    req.body.email &&
    req.body.name &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword
    ){
      // confirme that user typed same password twice.
      if( req.body.password !== req.body.confirmPassword){
        const err = new Error("Password Don't match");
        err.status = 400;
        return next(err);
      }
      
      const userDate = {
        email: req.body.email,
        name: req.body.name,
        favoriteBook: req.body.favoriteBook,
        password: req.body.password
      }
      // create user inside DB
      User.create(userDate, function(err, user){
        // handle error
        if (err) return next(err);
        req.session.userId = user._id;
        return res.redirect("/profile");
      });
      
    }else{
      const err = new Error("All feilds required!");
      err.status = 400;
      return next(err);
    }
  
});

module.exports = router;
