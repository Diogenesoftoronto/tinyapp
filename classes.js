"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = exports.User = void 0;
class User {
    constructor(username) {
        this.username = username;
        this.urls = {};
        this.password;
        this.email;
        this.session;
    }
    get getUsername() {
        return this.username;
    }
    set setPassword(password) {
        this.password = password;
    }
    get getPassword() {
        return this.password;
    }
    set setEmail(email) {
        this.email = email;
    }
    get getEmail() {
        return this.email;
    }
    set setUrls(urls) {
        this.urls = urls;
    }
    get getUrls() {
        return this.urls;
    }
    set setSession(session) {
        this.session = session;
    }
    get getSession() {
        return this.session;
    }
}
exports.User = User;
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
    constructor() {
        this.Database = {};
        this.Database.users = {};
    }
    get usersInDB() {
        return this.Database.users;
    }
    userbyUsername(username) {
        return this.Database.users[username];
    }
    set setUser(user) {
        this.Database.users[user.getUsername] = user;
    }
    isUsernameInDB(username) {
        let result = false;
        if (this.Database[username] === username) {
            result = true;
        }
        return result;
    }
    ;
    isPassInDB(username, password) {
        let result = false;
        if (this.Database[username].password === password) {
            result = true;
        }
        return result;
    }
    isEmailInDB(username, email) {
        let result = false;
        if (this.Database[username].email === email) {
            result = true;
        }
        return result;
    }
    isSessionInDB(username, session) {
        let result = false;
        if (this.Database[username].session === session) {
            result = true;
        }
        return result;
    }
    isUserInfoInDB(username, email, password) {
        let result = false;
        if (this.Database[username].email === email && this.Database[username].password === password) {
            result = true;
        }
        return result;
    }
}
exports.Database = Database;
