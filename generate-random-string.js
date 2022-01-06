"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = void 0;
// a function that generates a random string of 6 alphanumeric characters
function generateRandomString() {
    return Math.random().toString(20).substr(2, 6);
}
exports.generateRandomString = generateRandomString;
