const express = require("express");
const router = express.Router();
const  User = require("../models/user");


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
        return res.redirect("/profile");
      });
      
    }
  
    const err = new Error("All feilds required!");
    err.status = 400;
    return next(err);
});

module.exports = router;
