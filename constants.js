"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.babelDatabase = exports.PORT = void 0;
const classes_1 = require("./classes");
const SUDOuser = new classes_1.User('SUDOuser');
SUDOuser.setEmail = 'dudiest@dude.org';
SUDOuser.setPassword = 'SUDOpassword';
SUDOuser.setUrls = { "s8h76q": "https://www.google.com", "asd832": "https://www.youtube.com" };
const PORT = 4040;
exports.PORT = PORT;
const babelDatabase = new classes_1.Database();
exports.babelDatabase = babelDatabase;
