import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import {PORT, babelDatabase} from "./constants";
import {generateRandomString } from "./generate-random-string";
import {User} from "./classes";

const app = express()
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
app.use(morgan('dev'));

app.use(bodyParser.json());
// make the data readable to humans from the buffer from form POST request for new urls
app.use(bodyParser.urlencoded({extended: true}));

// create some middleware for cookies
app.use(cookieParser());

// we want the header partial to always have access to the userInfo
const middleware = (view: string, args?: object) => {
  
  return function (req: express.Request, res: express.Response) {

    let currentUser: any = req.cookies.userID; // current user is a string

    if (babelDatabase.isUsernameInDB(currentUser) === false || currentUser === undefined) { //makes sure that the current user has a userID even if it is undefined
      currentUser = 'tempUser';
      const user = new User(currentUser);
      res.render(view, {user, ...args} );
    } else {
      const user = babelDatabase.userbyUsername(req.cookies.userID);
      res.render(view, {user, ...args} )
    }
  }
}
// this is called every time some one goes to localhost:PORT/
app.get("/", middleware('frontpage' ))

// creates a login route
app.get("/login", middleware('login'))

// allows users to login using their password
app.post("/login/partial", (req: express.Request, res: express.Response) => {

    const userID = req.body.userID
    
    if (babelDatabase.isUsernameInDB(userID) === false ||babelDatabase.isUsernameInDB(userID) === undefined) {
      
      res.redirect("/register");
      
    } else {
      
    res.cookie("userID", userID);

    res.redirect("/login");

    }
});

// allows users to login using their password and email

app.post("/login", (req: express.Request, res: express.Response) => {

  const user = new User(req.cookies.userID);
  
  user.setEmail = req.params.email;

  user.setPassword = req.params.password;

  if  (babelDatabase.isUsernameInDB(user.getUsername) === true || babelDatabase.isUsernameInDB(user.getUsername) !== undefined) {
    babelDatabase.setUser = user;
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

app.get("/register", middleware('register'))

// allows the user to register an account
app.post("/register", (req: express.Request, res: express.Response) => {
  const user = new User(req.body.username);

  user.setEmail = req.body.email;

  user.setPassword = req.body.password;

    if(babelDatabase.isUsernameInDB(user.getUsername) === true || babelDatabase.isUsernameInDB(user.getUsername) != undefined) {
      res.redirect("/login");
    } else {
      babelDatabase.setUser = user;
      res.cookie('email', user.getEmail)
      res.cookie('userID', user.getUsername)
      res.cookie('password', user.getPassword)
      res.redirect("/");
    }

    // add more later here
});

// allows the user to logout
app.get("/logout", (req: express.Request, res: express.Response) => {

    // remove the cookie
    res.clearCookie("userID");

    res.clearCookie("password");

    res.clearCookie("email");

    res.redirect("/");

});

// this is called whenever the user goes to create a new url
app.get("/urls/new", (req: express.Request, res: express.Response) => {
  if( req.cookies.userID === undefined || babelDatabase.isUsernameInDB(req.cookies.userID) === false || babelDatabase.isUserInfoInDB(req.cookies.userID, req.cookies.password, req.cookies.email) === false ) {
    res.status(403).send("You must be logged in to send information to this page");
  } else {
  res.render("urls_new", {user: babelDatabase.userbyUsername(req.cookies.userID)});
  }

  });
// this is called whenever the user submits a new url  it returns them to the database with the new url add to the list
app.post("/urls/new", (req: express.Request, res: express.Response) => {
  if( req.cookies.userID === undefined || babelDatabase.isUsernameInDB(req.cookies.userID) === false || babelDatabase.isUserInfoInDB(req.cookies.userID, req.cookies.password, req.cookies.email) === false ) {
    res.status(403).send("You must be logged in to send information to this page");
  } else {

    const user = babelDatabase.userbyUsername(req.cookies.userID);
    
    const urlPair = {[generateRandomString()]: req.body.longURL}
    user.setUrls = urlPair;
    
    res.redirect('/urls');
  }

});

// this gets called whenever the user looks for the longurl for their short url the can use this page to be redirected to the site being referenced in the longurl
app.get("/u/:shortURL", (req: express.Request, res: express.Response) => {
  if(req.cookies.userID === undefined || babelDatabase.isUsernameInDB(req.cookies.userID) === false || babelDatabase.isUserInfoInDB(req.cookies.userID, req.cookies.password, req.cookies.email) === false) {
    res.status(403).send("You must be logged in to view this page");
  } else {

    const shortURL = req.params.shortURL;
    const user =  babelDatabase.userbyUsername(req.cookies.userID);
    const longURL = user.getUrls[shortURL];
    
    res.redirect(longURL);
  }
});

// this is called everytime a short url is requested from urls
app.get("/urls/:shortURL", (req: express.Request, res: express.Response) => {
  if(req.cookies.userID === undefined || babelDatabase.isUsernameInDB(req.cookies.userID) === false || babelDatabase.isUserInfoInDB(req.cookies.userID, req.cookies.password, req.cookies.email) === false ) {
    res.status(403).send("You must be logged in to view this page");
  } else {

    const user: User = babelDatabase.userbyUsername(req.cookies.userID)
    const urls = user.getUrls
    const shortURL = req.params.shortURL;
    const longURL = urls[shortURL]; 
    
    res.render('urls_show', {user, shortURL: shortURL,
      longURL: longURL } )
    }
});

// when the user submits an Update request, it should modify the corresponding longURL.
app.post("/urls/:shortURL", (req: express.Request, res: express.Response) => {
  if(req.cookies.userID === undefined || babelDatabase.isUsernameInDB(req.cookies.userID) === false || babelDatabase.isUserInfoInDB(req.cookies.userID, req.cookies.password, req.cookies.email) === false) {
    res.status(403).send("You must be logged in to send information to this page");
  } else {

    // look for the current user
    const user: User = babelDatabase.userbyUsername(req.cookies.userID)
    // store the shortURL
    const shortUrl: string = req.params.shortURL;
    // store the longURL
    const longURL = req.body.longURL;
    // store the urls in the user object
    user.setURLs = {
      shortURL: longURL
    }; 
    res.redirect("/urls");
  }
});

// this is called when we want to look at all the urls in the database
app.get("/urls", (req: express.Request, res: express.Response) => {
  if(req.cookies.userID === undefined || babelDatabase.isUsernameInDB(req.cookies.userID) === false || babelDatabase.isUserInfoInDB(req.cookies.userID, req.cookies.password, req.cookies.email) === false) {
    res.status(403).send("You must be logged in to view this page");
  } else {
    
    const user = babelDatabase.userbyUsername(req.cookies.userID);
    res.render('/urls', {user} )
  }

});

// when a user enters a new url the server generates a short url and stores it in the database then redirects the user to the urls stored on the server
app.post("/urls", (req: express.Request, res: express.Response) => {

  const randomString = generateRandomString();

  // urlDatabase[randomString] = req.params.longURL;
  res.redirect(`/urls/${randomString}`);

});

// when a user press the delete button on the urls_index page this is called it then redirects them to the urls_index page after deleting the url
app.post("/urls/:shortURL/delete", (req: express.Request, res: express.Response) => {
  const user: User = babelDatabase.userbyUsername(req.cookies.userID)
  const shortURL = req.params.shortURL;
  delete user.getUrls[shortURL];
  res.redirect("/urls");
});

//  this is all the urls but in a json format
app.get("/urls.json", (req:  express.Request, res: express.Response) => {
  if (!req.cookies.userID && !req.cookies.password && !req.cookies.email) {
    res.status(403).send("You must be logged in to view this page");
  } else {
    res.json();
  }

});
//  this is all the accounts but in a json format for debugging
app.get("/babelDatabase.json", (req:  express.Request, res: express.Response) => {
  if (!req.cookies.userID && !req.cookies.password && !req.cookies.email) {
    res.status(403).send("You must be logged in to view this page");
  } else {
    res.json(babelDatabase);
  }

});

// this is called to receive requests to the server
app.listen(PORT, () => {

  console.log(`Tinyapp listening on port ${PORT}!`);

});


