"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 8080;
const morgan = require('morgan');
const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};
// call the set up for th ejs from expressjs
app.set("view engine", "ejs");
// call the morgan to log the request this is middleware it executes as a async function and is called before every route
app.use(morgan('dev'));
// this is called every time some one goes to localhost:8080/
app.get("/", (_req, res) => {
    res.render("frontpage");
});
app.get("/urls/new", (_req, res) => {
    res.render("urls_new");
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
//  this is all the urls but in a json format
app.get("/urls.json", (_req, res) => {
    res.json(urlDatabase);
});
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});