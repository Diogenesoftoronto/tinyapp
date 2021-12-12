"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = void 0;
// creates a random number between min and max
function getRandomInt(min, max) {
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
exports.generateRandomString = generateRandomString;
