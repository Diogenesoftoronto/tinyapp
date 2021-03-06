import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import {PORT, babelDatabase} from "./constants";
import {generateRandomString } from "./generate-random-string";
import {User} from "./classes";
import cookieSession from "cookie-session";
const app = express()

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours

}))

app.set("view engine", "ejs");

// call the morgan to log the request this is middleware it executes as a async function and is called before every route
app.use(morgan('dev'));

app.use(bodyParser.json());
// make the data readable to humans from the buffer from form POST request for new urls
app.use(bodyParser.urlencoded({extended: true}));

// // create some middleware for cookies
// app.use(cookieParser());

// we want the header partial to always have access to the userInfo
const middleware = (view: string, args?: object) => {
  
  return function (req: express.Request, res: express.Response) {

    let currentUser: any = req.session.username; // current user is a string

    if (babelDatabase.isUsernameInDB(currentUser) === false || currentUser === undefined) { //makes sure that the current user has a username even if it is undefined
      currentUser = 'tempUser';
      const user = new User(currentUser);
      res.render(view, {user, ...args} );
    } else {
      const user = babelDatabase.userbyUsername(req.session.username);
      res.render(view, {user, ...args} )
    }
  }
}
// this is called every time some one goes to localhost:PORT/
app.get("/", middleware('frontpage'))

// creates a login route
app.get("/login", middleware('login'))

// allows users to login using their password
app.post("/login/partial", (req: express.Request, res: express.Response) => {
    // const username = req.body.username;
    //  req.session[username] = req.body.username; 

    if (babelDatabase.isUsernameInDB(req.body.username) === false) {
      
      res.redirect("/register");
      
    } else {
      req.session.username = req.body.username;
      res.redirect("/login");

    }
});

// allows users to login using their password and email

app.post("/login", (req: express.Request, res: express.Response) => {

  const usernames = req.session.username;
  const {email, password} = req.body
  if (email && password) {
    
    const user = babelDatabase.userbyUsername(req.session.username);
    // console.log( "this is the session", req.session)
    const username = req.session.username;
    const hashedPassword = user.checkPassword(password) 
    if (babelDatabase.isEmailInDB(username, email) && user.checkPassword(password)) {
      console.log("email password",email, password, username, "in if statement")

      req.session.username = user.getUsername;
      req.session.email = user.getEmail;
      req.session.password = user.getPassword;
      return res.redirect("/");
    }

  } else {

    res.redirect("/register");
  }
});

// create a route for the user to register an account

app.get("/register", middleware('register'))

// allows the user to register an account
app.post("/register", (req: express.Request, res: express.Response) => {
  const user = new User(req.body.username);

  user.setEmail = req.body.email;

  user.encryptPassword = req.body.password;

    if(babelDatabase.isUsernameInDB(user.getUsername)) {
      return res.redirect("/login");
    } else {

      babelDatabase.setUser = user;
      req.session.username = user.getUsername;
      req.session.email = user.getEmail;
      req.session.password = user.getPassword;
      res.redirect('/');
    }

    // add more later here
});

// allows the user to logout
app.get("/logout", (req: express.Request, res: express.Response) => {

    // remove the cookie
    req.session.username = null;
    req.session.email = null;
    req.session.password = null;
    res.redirect("/");

});

// this is called whenever the user goes to create a new url
app.get("/urls/new", (req: express.Request, res: express.Response) => {
  if(babelDatabase.isUserInfoInDB(req.session.username, req.session.email, req.session.password) === false) {
    res.status(403).send("You must be logged in to send information to this page");
  } else {
  res.render("urls_new", {user: babelDatabase.userbyUsername(req.session.username)});
  }

  });
// this is called whenever the user submits a new url  it returns them to the database with the new url added to the list
app.post("/urls/new", (req: express.Request, res: express.Response) => {
  if(babelDatabase.isUserInfoInDB(req.session.username, req.session.email, req.session.password) === false ) {
    res.status(403).send("You must be logged in to send information to this page");
  } else {

    const user = babelDatabase.userbyUsername(req.session.username);
    
    const urlPair = {[generateRandomString()]: req.body.longURL}
    user.setUrls = urlPair;
    
    res.redirect('/urls');
  }

});

// this gets called whenever the user looks for the longurl for their short url the can use this page to be redirected to the site being referenced in the longurl
app.get("/u/:shortURL", (req: express.Request, res: express.Response) => {
    const shortURL = req.params.shortURL;
    const arrResult = babelDatabase.isUrlInDB(shortURL)
    let longURL;
    if (arrResult[0]) {
      longURL = arrResult[1];
    }
    if (typeof longURL === 'string') {
      res.redirect(longURL);
    }
    else {
      res.status(400).send("This url is not in our Database, sorry bud :(")
    }
});

// this is called everytime a short url is requested from urls
app.get("/urls/:shortURL", (req: express.Request, res: express.Response) => {
  if(babelDatabase.isUserInfoInDB(req.session.username, req.session.email, req.session.password) === false ) {
    res.status(403).send("You must be logged in to view this page");
  } else {

    const user: User = babelDatabase.userbyUsername(req.session.username)
    const urls = user.getUrls
    const shortURL = req.params.shortURL;
    const longURL = urls[shortURL]; 
    
    res.render('urls_show', {user, shortURL: shortURL,
      longURL: longURL } )
    }
});

// when the user submits an Update request, it should modify the corresponding longURL.
app.post("/urls/:shortURL", (req: express.Request, res: express.Response) => {
  if(babelDatabase.isUserInfoInDB(req.session.username, req.session.email, req.session.password) === false ) {
    res.status(403).send("You must be logged in to send information to this page");
  } else {
    // look for the current user
    const user: User = babelDatabase.userbyUsername(req.session.username)
    // store the shortURL
    const shortUrl: string = req.params.shortURL;
    // store the longURL
    const longUrl = req.body.longURL;
    // store the url in the user object
    user.urlsDB[shortUrl] = longUrl;
    
    res.redirect("/urls");
  }
});

// this is called when we want to look at all the urls in the database
app.get("/urls", (req: express.Request, res: express.Response) => {
  
  console.log( "random string is ", generateRandomString())
  if(babelDatabase.isUserInfoInDB(req.session.username, req.session.email, req.session.password) === false ) {
    res.status(403).send("You must be logged in to view this page");
  } else {
    
    const user = babelDatabase.userbyUsername(req.session.username);
    const urls = user.getUrls;
    res.render('urls_index', {user, urls} );
  }

});

// when a user enters a new url the server generates a short url and stores it in the database then redirects the user to the urls stored on the server
app.post("/urls", (req: express.Request, res: express.Response) => {

  const randomString = generateRandomString();

  // urlDatabase[randomString] = req.params.longURL;
  res.redirect(`/urls/${randomString}`);

});

// when a user press the delete button on the urls_index page this is called it then redirects them to the urls_index page after deleting the url, users who are not logged in can no longer delete other urls
app.post("/urls/:shortURL/delete", (req: express.Request, res: express.Response) => {
  if (babelDatabase.isUserInfoInDB(req.session.username, req.session.email, req.session.password) === false ) {
    res.status(403).send("Hey bud, you can't delete this user's urls without logging in");
  } else {
  const user: User = babelDatabase.userbyUsername(req.session.username)
  const shortURL = req.params.shortURL;
  delete user.getUrls[shortURL]
  res.redirect("/urls");
  }
});

//  this is all the urls but in a json format
app.get("/urls.json", (req:  express.Request, res: express.Response) => {
  if (babelDatabase.isUserInfoInDB(req.session.username, req.session.email, req.session.password) === false ) {
    res.status(403).send("You must be logged in to view this page");
  } else {
    res.json();
  }

});
//  this is all the accounts but in a json format for debugging
app.get("/babelDatabase.json", (req:  express.Request, res: express.Response) => {
  if (!req.session.username && !req.session.password && !req.session.email) {
    res.status(403).send("You must be logged in to view this page");
  } else {
    res.json(babelDatabase);
  }

});

// this is called to receive requests to the server
app.listen(PORT, () => {

  console.log(`Tinyapp listening on port ${PORT}!`);

});


