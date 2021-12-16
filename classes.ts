import bcrypt from "bcryptjs";

class User {
  [x: string]: any;
  constructor(username: any){
    this.username = username;
    this.urls = [];
    this.password;
    this.email;
    this.session;
    this.urlsDB = {};
  }
  get getUsername() {
    return this.username;
  }
  set setPassword (password: any) {
    this.password = password;
  }
  get getPassword() {
    return this.password;
  }
  set setEmail (email: any) {
    this.email = email;
  }
  get getEmail() {
    return this.email;
  }
  set setUrls (url: object) {
    this.urls.push(url);
  }
  get getUrls() {
    this.urls.forEach((url: any) => {
      const key = Object.keys(url)[0];
      this.urlsDB[key] = url[key];
    });

    return this.urlsDB;
  }
  set setSession (session: any) {
    this.session = session;
  }
  get getSession() {
    return this.session;
  }
  set encryptPassword (password: any) {
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

// set session for the user will be a cookie!
class Database {
  [x: string]: any;
  constructor() {
    this.Database = {};
    this.Database.users = {};
  }
  get usersInDB() {
    
    return this.Database.users;
  }
  userbyUsername(username: any) {
    return this.Database.users[username];
  }
  set setUser (user: User) {
    // if you try to enter an empty user into the database, it will throw an error!
    if (user.getUsername === '') {
      throw new Error('username cannot be empty');
    }
    if (user.getPassword === '') {
      throw new Error('password cannot be empty');
    }
    if (user.getEmail === '') {
      throw new Error('email cannot be empty');
    }
    this.Database.users[user.getUsername] = user;
  }
  isUsernameInDB(username: any) {
    // drifyied!
    let result = false;

    try {
     if (this.Database.users[username].username === username) {
     result = true;
      }
    } catch (TypeError) {
      result = false;
    }
    return result;
  };
  isPassInDB(username: any, password: any) {
    let result = false;
    if (this.Database.users[username].password === password) {
      result = true;
    }
    return result;
  }
  isEmailInDB(username: any, email: any) {
    let result = false;
    if (this.Database.users[username].email === email) {
      result = true;
    }
    return result;
  }
  isSessionInDB(username: any, session: any) {
    let result = false;
    if (this.Database.users[username].session === session) {
      result = true;
    }
    return result;
  }
  isUserInfoInDB(username: any, email: any, password: any) {
    // drifyied!
    let result = false;
    try {
      if (this.Database.users[username].email === email && this.Database.users[username].password === password) {
        result = true;
      }
    }
    catch (TypeError) {
      result = false;
    }

    return result;
  }


}

export { User, Database };