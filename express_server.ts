import express from "express";
import bodyParser from "body-parser";
const app = express()
const PORT = 8080
const morgan = require('morgan');


interface urldata {
    [url: string]: string
};
let urlDatabase: urldata = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "qmHFDk": "https://diogenesoftoronto.wordpress.com/"
}

// call the set up for th ejs from expressjs
app.set("view engine", "ejs");
// call the morgan to log the request this is middleware it executes as a async function and is called before every route
app.use(morgan('dev'));
// make the data readable to humans from the buffer from form POST request for new urls
app.use(bodyParser.urlencoded({extended: true}));

// this is called every time some one goes to localhost:PORT/
app.get("/", (_req:  express.Request, res: express.Response) => {
  res.render("frontpage");
});
// this is called whenever the user goes to create a new url
app.get("/urls/new", (_req:  express.Request, res: express.Response) => {
  res.render("urls_new");
});
// this gets called whenever the user looks for the longurl for their short url the can use this page to be redirected to the site being referenced in the longurl
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// this is called everytime a short url is requested from urls
app.get("/urls/:shortURL", (req:  express.Request, res: express.Response) => {
  const shortUrl: string = req.params.shortURL;
  const templateVars = { 
    shortURL: req.params.shortURL, longURL: req.params.longURL };
  res.render("urls_show", templateVars);
});

// this is called when we want to look at all the urls in the database
app.get("/urls", (_req:  express.Request, res: express.Response) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
// when a user enters a new url the server generates a short url and stores it in the database then redirects the user to the urls stored on the server
app.post("/urls", (req: express.Request, res: express.Response) => { 
  const randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`);
});
// when a user press the delete button on the urls_index page this is called it then redirects them to the urls_index page after deleting the url
app.post("/urls/:shortURL/delete", (req: express.Request, res: express.Response) => {
  const shortUrl: string = req.params.shortURL;
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//  this is all the urls but in a json format
app.get("/urls.json", (_req:  express.Request, res: express.Response) => {
  res.json(urlDatabase);
});
// this is called to recieve requests to the server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
// creates a random number between min and max
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// a function that generates a random string of 6 alphanumeric characters
function generateRandomString() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  // definitely a better way to implement this but im lazy, i will just say that this is a way to program using the AHA method instead of DRY
  const randomString = `${characters.charAt(getRandomInt(0, characters.length))}${characters.charAt(getRandomInt(0, characters.length))}${characters.charAt(getRandomInt(0, characters.length))}${characters.charAt(getRandomInt(0, characters.length))}${characters.charAt(getRandomInt(0, characters.length))}${characters.charAt(getRandomInt(0, characters.length))}`;
  return randomString;
}
