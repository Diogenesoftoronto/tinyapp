"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const PORT = 8080;
const morgan = require('morgan');
;
;
let urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com",
    "qmHFDk": "https://diogenesoftoronto.wordpress.com/"
};
// call the set up for th ejs from expressjs
app.set("view engine", "ejs");
// call the morgan to log the request this is middleware it executes as a async function and is called before every route
app.use(morgan('dev'));
// make the data readable to humans from the buffer from form POST request for new urls
app.use(body_parser_1.default.urlencoded({ extended: true }));
// create some middleware for cookies
app.use((0, cookie_parser_1.default)());
// creates a login route
app.get("/login", (req, res) => {
    res.render("login");
});
// allows users to login using their password
app.post("/login", (req, res) => {
    const user = req.body.userId;
    const email = req.body.email;
    const pass = req.body.password;
    // const userObject: userInfo = {
    //     userId: user,
    //     email: ,
    // if (user === )
    // add more later here
});
// create a route for the user to register an account
app.get("/register", (req, res) => {
    // take the user info and use that to create an account for the user
    const user = req.body.username;
    const pass = req.body.password;
    res.render("register");
    res.redirect("/login");
});
// allows the user to register an account
app.post("/register", (req, res) => {
    let user = req.body.username;
    let pass = req.body.password;
    // add more later here
    res.redirect("/urls");
});
// this is called every time some one goes to localhost:PORT/
app.get("/", (_req, res) => {
    res.render("frontpage");
});
// this is called whenever the user goes to create a new url
app.get("/urls/new", (_req, res) => {
    res.render("urls_new");
});
// this gets called whenever the user looks for the longurl for their short url the can use this page to be redirected to the site being referenced in the longurl
app.get("/u/:shortURL", (req, res) => {
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL];
    res.redirect(longURL);
});
// this is called everytime a short url is requested from urls
app.get("/urls/:shortURL", (req, res) => {
    const shortUrl = req.params.shortURL;
    const templateVars = {
        shortURL: req.params.shortURL, longURL: req.params.longURL
    };
    res.render("urls_show", templateVars);
});
// this is called when we want to look at all the urls in the database
app.get("/urls", (_req, res) => {
    const templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
});
// when a user enters a new url the server generates a short url and stores it in the database then redirects the user to the urls stored on the server
app.post("/urls", (req, res) => {
    const randomString = generateRandomString();
    urlDatabase[randomString] = req.body.longURL;
    res.redirect(`/urls/${randomString}`);
});
// when a user press the delete button on the urls_index page this is called it then redirects them to the urls_index page after deleting the url
app.post("/urls/:shortURL/delete", (req, res) => {
    const shortUrl = req.params.shortURL;
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
});
//  this is all the urls but in a json format
app.get("/urls.json", (_req, res) => {
    res.json(urlDatabase);
});
// this is called to recieve requests to the server
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});
// creates a random number between min and max
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
// when the user submits an Update request, it should modify the corresponding longURL, and then redirect the client back to "/urls".
app.post("/urls/:shortURL", (req, res) => {
    const shortUrl = req.params.shortURL;
    urlDatabase[shortUrl] = req.body.longURL;
    res.redirect("/urls");
});
// a function that generates a random string of 6 alphanumeric characters
function generateRandomString() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    // definitely a better way to implement this but im lazy, i will just say that this is a way to program using the AHA method instead of DRY
    const randomString = `${characters.charAt(getRandomInt(0, characters.length))}${characters.charAt(getRandomInt(0, characters.length))}${characters.charAt(getRandomInt(0, characters.length))}${characters.charAt(getRandomInt(0, characters.length))}${characters.charAt(getRandomInt(0, characters.length))}${characters.charAt(getRandomInt(0, characters.length))}`;
    return randomString;
}
