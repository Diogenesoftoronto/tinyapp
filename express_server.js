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
// const validateCookie = (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     const { cookie } = req;
//     if ('session_id' in cookie) {
//     if (cookie) {
//         if (babelDatabase[cookie]) {
//             next();
//         } else {
//             res.sendStatus(401);
//         }
//     } else {
//         res.sendStatus(401);
//     }
// }
// call the set up for th ejs from expressjs
app.set("view engine", "ejs");
// call the morgan to log the request this is middleware it executes as a async function and is called before every route
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.json());
// make the data readable to humans from the buffer from form POST request for new urls
app.use(body_parser_1.default.urlencoded({ extended: true }));
// create some middleware for cookies
app.use((0, cookie_parser_1.default)());
// we want the header partial to always have access to the userInfo
const middleware = (view, args) => {
    return function (req, res) {
        let currentUser = req.cookies.username; // current user is a string
        if (constants_1.babelDatabase.isUsernameInDB(currentUser) === false || currentUser === undefined) { //makes sure that the current user has a username even if it is undefined
            currentUser = 'tempUser';
            const user = new classes_1.User(currentUser);
            res.render(view, Object.assign({ user }, args));
        }
        else {
            const user = constants_1.babelDatabase.userbyUsername(req.cookies.username);
            res.render(view, Object.assign({ user }, args));
        }
    };
};
// this is called every time some one goes to localhost:PORT/
app.get("/", middleware('frontpage'));
// creates a login route
app.get("/login", middleware('login'));
// allows users to login using their password
app.post("/login/partial", (req, res) => {
    const username = req.body.username;
    res.cookie('username', username);
    if (constants_1.babelDatabase.isUsernameInDB(username) === false || constants_1.babelDatabase.isUsernameInDB(username) === undefined) {
        res.redirect("/register");
    }
    else {
        res.cookie("username", username);
        res.redirect("/login");
    }
});
// allows users to login using their password and email
app.post("/login", (req, res) => {
    const user = new classes_1.User(req.cookies.username);
    user.setEmail = req.body.email;
    user.setPassword = req.body.password;
    if (constants_1.babelDatabase.isUsernameInDB(user.getUsername)) {
        constants_1.babelDatabase.setUser = user;
        res.cookie('email', user.getEmail);
        res.cookie('username', user.getUsername);
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
    if (user.getUsername && constants_1.babelDatabase.isUsernameInDB(user.getUsername)) {
        res.redirect("/login");
    }
    else {
        constants_1.babelDatabase.setUser = user;
        res.cookie('email', user.getEmail);
        res.cookie('username', user.getUsername);
        res.cookie('password', user.getPassword);
        res.redirect('/');
    }
    // add more later here
});
// allows the user to logout
app.get("/logout", (req, res) => {
    // remove the cookie
    res.clearCookie("username");
    res.clearCookie("password");
    res.clearCookie("email");
    res.redirect("/");
});
// this is called whenever the user goes to create a new url
app.get("/urls/new", (req, res) => {
    if (constants_1.babelDatabase.isUsernameInDB(req.cookies.username) === false || constants_1.babelDatabase.isUserInfoInDB(req.cookies.username, req.cookies.password, req.cookies.email) === false) {
        res.status(403).send("You must be logged in to send information to this page");
    }
    else {
        res.render("urls_new", { user: constants_1.babelDatabase.userbyUsername(req.cookies.username) });
    }
});
// this is called whenever the user submits a new url  it returns them to the database with the new url add to the list
app.post("/urls/new", (req, res) => {
    if (constants_1.babelDatabase.isUserInfoInDB(req.cookies.username, req.cookies.email, req.cookies.password) === false) {
        res.status(403).send("You must be logged in to send information to this page");
    }
    else {
        const user = constants_1.babelDatabase.userbyUsername(req.cookies.username);
        const urlPair = { [(0, generate_random_string_1.generateRandomString)()]: req.body.longURL };
        user.setUrls = urlPair;
        res.redirect('/urls');
    }
});
// this gets called whenever the user looks for the longurl for their short url the can use this page to be redirected to the site being referenced in the longurl
app.get("/u/:shortURL", (req, res) => {
    if (constants_1.babelDatabase.isUserInfoInDB(req.cookies.username, req.cookies.email, req.cookies.password) === false) {
        res.status(403).send("You must be logged in to view this page");
    }
    else {
        const shortURL = req.params.shortURL;
        const user = constants_1.babelDatabase.userbyUsername(req.cookies.username);
        const longURL = user.getUrls[shortURL];
        res.redirect(longURL);
    }
});
// this is called everytime a short url is requested from urls
app.get("/urls/:shortURL", (req, res) => {
    if (constants_1.babelDatabase.isUserInfoInDB(req.cookies.username, req.cookies.email, req.cookies.password) === false) {
        res.status(403).send("You must be logged in to view this page");
    }
    else {
        const user = constants_1.babelDatabase.userbyUsername(req.cookies.username);
        const urls = user.getUrls;
        const shortURL = req.params.shortURL;
        const longURL = urls[shortURL];
        res.render('urls_show', { user, shortURL: shortURL,
            longURL: longURL });
    }
});
// when the user submits an Update request, it should modify the corresponding longURL.
app.post("/urls/:shortURL", (req, res) => {
    if (constants_1.babelDatabase.isUserInfoInDB(req.cookies.username, req.cookies.email, req.cookies.password) === false) {
        res.status(403).send("You must be logged in to send information to this page");
    }
    else {
        // look for the current user
        const user = constants_1.babelDatabase.userbyUsername(req.cookies.username);
        // store the shortURL
        const shortUrl = req.params.shortURL;
        // store the longURL
        const longUrl = req.body.longURL;
        // store the urls in the user object
        user.setUrls = {
            [shortUrl]: longUrl
        };
        res.redirect("/urls");
    }
});
// this is called when we want to look at all the urls in the database
app.get("/urls", (req, res) => {
    if (constants_1.babelDatabase.isUserInfoInDB(req.cookies.username, req.cookies.email, req.cookies.password) === false) {
        res.status(403).send("You must be logged in to view this page");
    }
    else {
        const user = constants_1.babelDatabase.userbyUsername(req.cookies.username);
        res.render('/urls', { user });
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
    const user = constants_1.babelDatabase.userbyUsername(req.cookies.username);
    const shortURL = req.params.shortURL;
    delete user.getUrls[shortURL];
    res.redirect("/urls");
});
//  this is all the urls but in a json format
app.get("/urls.json", (req, res) => {
    if (!req.cookies.username && !req.cookies.password && !req.cookies.email) {
        res.status(403).send("You must be logged in to view this page");
    }
    else {
        res.json();
    }
});
//  this is all the accounts but in a json format for debugging
app.get("/babelDatabase.json", (req, res) => {
    if (!req.cookies.username && !req.cookies.password && !req.cookies.email) {
        res.status(403).send("You must be logged in to view this page");
    }
    else {
        res.json(constants_1.babelDatabase);
    }
});
// this is called to receive requests to the server
app.listen(constants_1.PORT, () => {
    console.log(`Tinyapp listening on port ${constants_1.PORT}!`);
});
