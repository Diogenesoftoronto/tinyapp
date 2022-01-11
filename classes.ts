import bcrypt from "bcryptjs";
import { Session } from "express-session";
interface url {
  [shortUrl: string]: string
};
type urlArray = [url?];
class User {
  username: string;
  urls: urlArray;
  password: string;
  email: string;
  urlsDB: {url?: url} | any;
  session: Session;


  constructor(username: string){
    this.username = username;
    this.password;
    this.email;
    this.session;
    this.urlsDB = {};
  }
  get getUsername() {
    if (typeof this.username === 'string') {
      return this.username;

    }
  }
  set setPassword (password: string) {
    this.password = password;
  }
  get getPassword() {
    return this.password;
  }
  set setEmail (email: string) {
    this.email = email;
  }
  get getEmail() {
    return this.email;
  }
  set setUrls (url: url) {
    Object.assign(this.urlsDB, url);
  }
  get getUrls() {
    // implemented a hashtable to get and set values, eliminates need for array also faster
    return this.urlsDB;    
  }
  set setSession (session: any) {
    this.session = session;
  }
  get getSession() {
    return this.session;
  }
  set encryptPassword (password: string) {
    this.password = bcrypt.hashSync(password, 10);
  }
  checkPassword (password: any) {
    return bcrypt.compareSync(password, this.password);
  }

}
// this is function chaining and it works without getters and setters but is not recommended because it is hard to read:
// let babelDatabase: object = {};
// const SUDOuser = new User('SUDOuser').setEmail('dudiest@dude.org').setPassword('SUDOpassword').setUrls({ "s8h76q": "https://www.google.com", "asd832": "https://www.youtube.com" });

// const user = new User('user').setEmail('user@google.com');
// const user2 = new User('user2').setEmail('superman@google.com');

// instead assign values directly without dot notation:


// const user = new User('user');
// user.setEmail = 'user@google.com';

// const user2 = new User('user2');
// user2.setEmail = 'superman@google.com';
// user3.setUrlS = { "s8h76q": "https://www.google.com"}
// set session for the user will be a cookie!
interface users {
  [username: string]: User;
}
class Database {
  users: users;
  constructor() {
    this.users = {};
  }
  get usersInDB() {
    
    return this.users;
  }
  userbyUsername(username: any) {
    return this.users[username];
  }
  set setUser (user: User) {
    // if you try to enter a user with missing information, it will throw an error!
    if (user.getUsername === '') {
      throw new Error('username cannot be empty');
    }
    if (user.getPassword === '') {
      throw new Error('password cannot be empty');
    }
    if (user.getEmail === '') {
      throw new Error('email cannot be empty');
    }
    this.users[user.getUsername] = user;
  }
  isUsernameInDB(username: string) {
    // drifyied!
    let result = false;

    try {
     if (this.users[username].username === username) {
     result = true;
      }
    } catch (TypeError) {
      result = false;
    }
    return result;
  };
  isPassInDB(username: string, password: string) {
    let result = false;
    if (this.users[username].password === password) {
      result = true;
    }
    return result;
  }
  isEmailInDB(username: string, email: string) {
    let result = false;
    if (this.users[username].email === email) {
      result = true;
    }
    return result;
  }
  isSessionInDB(username: string, session: Session) {
    let result = false;
    if (this.users[username].session === session) {
      result = true;
    }
    return result;
  }
  isUserInfoInDB(username: string, email: string, password: string) {
    // drifyied!
    let result = false;
    try {
      if (this.users[username].email === email && this.users[username].password === password) {
        
        result = true;
      }
    }
    catch (TypeError) {
      result = false;
    }

    return result;
  }
  isUrlInDB (shortUrl: string): Array<Boolean | string> {
    // loop through users
    for (const username in this.users) {
      // assign the current user to a variable
        const user = this.userbyUsername(username);
        // assign the urls of the current user to a variable
        const urls = user.getUrls;
        // check whether the url is in the users urls
        if (urls.hasOwnProperty(shortUrl)) {
          return [true, urls[shortUrl]];
        }
    }
    return [false];
  }


}

export { User, Database };