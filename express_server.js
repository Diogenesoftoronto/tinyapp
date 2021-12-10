"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const generateRandomString = require("./generate-random-string.js");
const userInDatabase = require("./user-in-database.js");
const app = (0, express_1.default)();
const PORT = 4040;
const morgan = require('morgan');
;
;
let babelDatabase = {};
// babelDatabase['SUDOuser'] = {
//   email: "dudiest@dude.org",
//   password: "supersecret"
// };
babelDatabase.SUDOuser = {
    userID: 'SUDOuser',
    email: "dudiest@dude.org",
    password: "supersecret"
};
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
//  define a mirror function that mirrors the callback function of every handlers way of rendering for every request we could ahve different ways of handling that request. we should use this function instead of using things like we have on line 65 for example
// we want the header partial to always have access to the userInfo
// app.use(
//   let userID = 
//   res.locals(babelDatabase[userID])
// )
// ({defaultUser} = {variable, ...ArgumentsGotFromParameter})
// {default} = variable
// variable.default
// extra
const middleware = (view, args) => {
    return function (req, res) {
        var _a;
        let currentUser = req.cookies["userID"];
        if (!((_a = babelDatabase === null || babelDatabase === void 0 ? void 0 : babelDatabase[currentUser]) === null || _a === void 0 ? void 0 : _a.userID))
            currentUser = {
                userID: 'SudoUser'
            };
        // babelDatabase[currentUser]userID
        res.render(view, Object.assign({ currentUser }, args));
    };
};
// // this is called every time some one goes to localhost:PORT/
app.get("/", middleware('frontpage'));
//   res.render("frontpage");
// });
// creates a login route
app.get("/login", (req, res) => {
    res.render("login");
});
// allows users to login using their password
app.post("/login/", (req, res) => {
    const userID = req.body.user;
    res.cookie("user", userID);
    if (!userInDatabase(userID, babelDatabase)) {
        res.redirect("/register");
    }
    res.redirect("/login");
});
// create a route for the user to register an account
app.get("/register", (req, res) => {
    res.cookie("user", {});
    res.render("register", babelDatabase.SUDOuser);
});
// allows the user to register an account
app.post("/register", (req, res) => {
    const userID = req.body.username;
    const email = req.body.email;
    const pass = req.body.password;
    babelDatabase[userID] = {
        userID: userID,
        email: email,
        password: pass
    };
    res.cookie('account', babelDatabase[userID]);
    // // add more later here
    res.redirect("/");
});
// allows the user to logout
app.get("/logout", (req, res) => {
    // remove the cookie
    res.clearCookie("user");
    res.clearCookie("account");
    res.redirect("/");
});
// this is called whenever the user goes to create a new url
app.get("/urls/new", (_req, res) => {
    res.render("urls_new");
});
// this is called whenever the user submits a new url  it returns them to the database with the new url add to the list
app.post("/urls/new", (_req, res) => {
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = _req.body.longURL;
    res.redirect('/urls');
});
// this gets called whenever the user looks for the longurl for their short url the can use this page to be redirected to the site being referenced in the longurl
app.get("/u/:shortURL", (req, res) => {
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL];
    res.redirect(longURL);
});
// this is called everytime a short url is requested from urls
app.get("/urls/:shortURL", (req, res) => {
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL];
    const urlKeyValue = {
        shortURL: shortURL,
        longURL: longURL
    };
    res.render("urls_show", urlKeyValue);
});
// when the user submits an Update request, it should modify the corresponding longURL.
app.post("/urls/:shortURL", (req, res) => {
    const shortUrl = req.params.shortURL;
    urlDatabase[shortUrl] = req.body.longURL;
    res.redirect("/urls");
});
// this is called when we want to look at all the urls in the database
app.get("/urls", (_req, res) => {
    const allUrls = { urls: urlDatabase };
    res.render("urls_index", allUrls);
});
// when a user enters a new url the server generates a short url and stores it in the database then redirects the user to the urls stored on the server
app.post("/urls", (req, res) => {
    const randomString = generateRandomString();
    // urlDatabase[randomString] = req.params.longURL;
    res.redirect(`/urls/${randomString}`);
});
// when a user press the delete button on the urls_index page this is called it then redirects them to the urls_index page after deleting the url
app.post("/urls/:shortURL/delete", (req, res) => {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
});
//  this is all the urls but in a json format
app.get("/urls.json", (_req, res) => {
    res.json(urlDatabase);
});
// this is called to recieve requests to the server
app.listen(PORT, () => {
    console.log(`Tinyapp listening on port ${PORT}!`);
});
