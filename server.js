const express = require("express");
const session = require("express-session");
const app = express();
const nocache = require('nocache');
const ejs = require("ejs");
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//session middleware
app.use(session({
    secret: "secret-key", // change to something secure
    resave: false,
    saveUninitialized: true
}));

//middleware
function isAuth(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        return res.redirect("/");
    }
}

app.use(nocache());

//username
const username = "Sinan";
//password
const password = "1234";

// Login page
app.get("/", (req, res) => {
    if (req.session.user) {
        // Already logged in → stay on home page
        return res.redirect("/home");
    }
    res.render("login", { msg: req.session.msg || "" });
    req.session.msg = null;
});

app.post('/home',(req,res) => {
    
    if(req.body.username === username && req.body.password === password){
        req.session.user = username;
        return res.redirect('/home');
    }else{
        req.session.msg = "Invalid Credentials";
        return res.redirect('/');
    }

});

// Home page (protected)
app.get("/home", isAuth, (req, res) => {
    res.render("home", { nm: req.session.user });
});

app.post('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if(err)console.log(err);
        res.zas('/');
    });
})
app.listen(3003,()=> console.log("server running on port 3003") );