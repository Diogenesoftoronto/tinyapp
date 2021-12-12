"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const constants_1 = require("./constants");
const generate_random_string_1 = require("./generate-random-string");
const classes_1 = require("./classes");
const app = (0, express_1.default)();
// call the set up for th ejs from expressjs
app.set("view engine", "ejs");
// call the morgan to log the request this is middleware it executes as a async function and is called before every route
app.use((0, morgan_1.default)('dev'));
// make the data readable to humans from the buffer from form POST request for new urls
app.use(body_parser_1.default.urlencoded({ extended: true }));
// create some middleware for cookies
app.use((0, cookie_parser_1.default)());
// we want the header partial to always have access to the userInfo
const middleware = (view, args) => {
    return function (req, res) {
        let currentUser = req.body.userID; // current user is a string
        if (!constants_1.babelDatabase.isUsernameInDB(currentUser)) { //makes sure that the current user has a userID even if it is undefined
            currentUser = 'undefined';
            const tempUser = new classes_1.User(currentUser);
            res.render(view, Object.assign({ tempUser }, args));
        }
        else {
            res.render(view, Object.assign({ currentUser }, args));
        }
    };
};
// this is called every time some one goes to localhost:PORT/
app.get("/", middleware('frontpage'));
// creates a login route
app.get("/login", middleware('login'));
// allows users to login using their password
app.post("/login/partial", (req, res) => {
    const userID = req.body.userID;
    if (constants_1.babelDatabase.isUsernameInDB(userID) === false) {
        res.redirect("/register");
    }
    res.cookie("userID", userID);
    res.redirect("/login");
});
// allows users to login using their password and email
app.post("/login", (req, res) => {
    const user = new classes_1.User(req.cookies.userID);
    user.setEmail = req.body.email;
    user.setPassword = req.body.password;
    if (constants_1.babelDatabase.userInfoInDb(user.getUsername, user.getEmail, user.getPassword) === true) {
        constants_1.babelDatabase.setUser(user);
        res.cookie('email', user.getEmail);
        res.cookie('userID', user.getUsername);
        res.cookie('password', user.getPassword);
        // add more later here
        res.redirect("/");
    }
    else {
        // perhaps add a prefill here
        res.redirect("/register");
    }
});
// create a route for the user to register an account
app.get("/register", middleware('register'));
// allows the user to register an account
app.post("/register", (req, res) => {
    const user = new classes_1.User(req.body.username);
    user.setEmail = req.body.email;
    user.setPassword = req.body.password;
    if (constants_1.babelDatabase.userInfoInDb(user.getUsername, user.getEmail, user.getPassword) === true) {
        res.redirect("/login");
    }
    else {
        constants_1.babelDatabase.setUser(user);
        res.cookie('email', user.getEmail);
        res.cookie('userID', user.getUsername);
        res.cookie('password', user.getPassword);
        res.redirect("/");
    }
    // add more later here
});
// allows the user to logout
app.get("/logout", (req, res) => {
    // remove the cookie
    res.clearCookie("userID");
    res.clearCookie("password");
    res.clearCookie("email");
    res.redirect("/");
});
// this is called whenever the user goes to create a new url
app.get("/urls/new", middleware('urls_new'));
// this is called whenever the user submits a new url  it returns them to the database with the new url add to the list
app.post("/urls/new", (req, res) => {
    const shortURL = (0, generate_random_string_1.generateRandomString)();
    urlDatabase.shortURL = req.body.longURL;
    res.redirect('/urls');
});
// this gets called whenever the user looks for the longurl for their short url the can use this page to be redirected to the site being referenced in the longurl
app.get("/u/:shortURL", (req, res) => {
    // const shortURL = req.params.shortURL;
    const longURL = urlDatabase.shortURL;
    res.redirect(longURL);
});
// this is called everytime a short url is requested from urls
app.get("/urls/:shortURL", (req, res) => {
    if (constants_1.babelDatabase.isUsernameInDB(req.cookies.userID) === false || constants_1.babelDatabase.isPasswordInDB(req.cookies.password) === false || constants_1.babelDatabase.isEmailInDB(req.cookies.email) === false) {
        res.status(403).send("You must be logged in to view this page");
    }
    const user = constants_1.babelDatabase.userbyUsername(req.cookies.userID);
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL];
    let currentUser = req.body.userID; // current user is a string
    if (!constants_1.babelDatabase.isUsernameInDB(currentUser)) { //makes sure that the current user has a userID even if it is undefined
        currentUser = 'undefined';
        const tempUser = new classes_1.User(currentUser);
        res.render('urls_show', { tempUser, shortURL: shortURL,
            longURL: longURL });
    }
    else {
        res.render('urls_show', { currentUser, shortURL: shortURL,
            longURL: longURL });
    }
});
// when the user submits an Update request, it should modify the corresponding longURL.
app.post("/urls/:shortURL", (req, res) => {
    // look for the current user
    const user = constants_1.babelDatabase.userbyUsername(req.cookies.userID);
    // store the shortURL
    const shortUrl = req.params.shortURL;
    // store the longURL
    const longURL = req.body.longURL;
    // store the urls in the user object
    user.setURLs = {
        shortURL: longURL
    };
    res.redirect("/urls");
});
// this is called when we want to look at all the urls in the database
app.get("/urls", (req, res) => {
    if (!req.cookies.userID && !req.cookies.password && !req.cookies.email) {
        res.status(403).send("You must be logged in to view this page");
    }
    let currentUser = req.body.userID; // current user is a string
    if (!constants_1.babelDatabase.isUsernameInDB(currentUser)) { //makes sure that the current user has a userID even if it is undefined
        currentUser = undefined;
        const tempUser = new classes_1.User(currentUser);
        res.render('/urls', { tempUser });
    }
    else {
        res.render('/urls', { currentUser });
    }
});
// when a user enters a new url the server generates a short url and stores it in the database then redirects the user to the urls stored on the server
app.post("/urls", (req, res) => {
    const randomString = (0, generate_random_string_1.generateRandomString)();
    // urlDatabase[randomString] = req.params.longURL;
    res.redirect(`/urls/${randomString}`);
});
// when a user press the delete button on the urls_index page this is called it then redirects them to the urls_index page after deleting the url
app.post("/urls/:shortURL/delete", (req, res) => {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
});
//  this is all the urls but in a json format
app.get("/urls.json", (req, res) => {
    if (!req.cookies.userID && !req.cookies.password && !req.cookies.email) {
        res.status(403).send("You must be logged in to view this page");
    }
    res.json();
});
//  this is all the accounts but in a json format fr debugging
app.get("/babelDatabase.json", (req, res) => {
    if (!req.cookies.userID && !req.cookies.password && !req.cookies.email) {
        res.status(403).send("You must be logged in to view this page");
    }
    res.json(constants_1.babelDatabase);
});
// this is called to receive requests to the server
app.listen(constants_1.PORT, () => {
    console.log(`Tinyapp listening on port ${constants_1.PORT}!`);
});
