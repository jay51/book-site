
function loggedOut(req, res, next){
    if(req.session && req.session.userId) return res.redirect("/profile");
    
    return next();
}

//   check for session id, if no session then user is not loged in
function requiresLogin(req, res, next){
    if(!req.session.userId){
    const err = new Error("you're not autherized to view this page");
    err.status = 401;
    return next(err);
  }
  return next();
}


module.exports = {
    loggedOut,
    requiresLogin
};