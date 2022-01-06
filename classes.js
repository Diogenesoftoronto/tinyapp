"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = exports.User = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class User {
    constructor(username) {
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
    set setUrls(url) {
        this.urls.push(url);
    }
    get getUrls() {
        this.urls.forEach((url) => {
            const key = Object.keys(url)[0];
            this.urlsDB[key] = url[key];
        });
        return this.urlsDB;
    }
    set setSession(session) {
        this.session = session;
    }
    get getSession() {
        return this.session;
    }
    set encryptPassword(password) {
        this.password = bcryptjs_1.default.hashSync(password, 10);
    }
    checkPassword(password) {
        return bcryptjs_1.default.compareSync(password, this.password);
    }
    deleteUrls(shorturl) {
        // first delete the url in the urlDB then delete the index element of the urls array
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
// user3.setUrlS = { "s8h76q": "https://www.google.com"}
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
    isUsernameInDB(username) {
        // drifyied!
        let result = false;
        try {
            if (this.Database.users[username].username === username) {
                result = true;
            }
        }
        catch (TypeError) {
            result = false;
        }
        return result;
    }
    ;
    isPassInDB(username, password) {
        let result = false;
        if (this.Database.users[username].password === password) {
            result = true;
        }
        return result;
    }
    isEmailInDB(username, email) {
        let result = false;
        if (this.Database.users[username].email === email) {
            result = true;
        }
        return result;
    }
    isSessionInDB(username, session) {
        let result = false;
        if (this.Database.users[username].session === session) {
            result = true;
        }
        return result;
    }
    isUserInfoInDB(username, email, password) {
        // drifyied!
        console.log("database user", this.Database.users[username]);
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
exports.Database = Database;
