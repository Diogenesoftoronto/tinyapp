"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const expect = chai_1.default.expect;
const generate_random_string_1 = require("../generate-random-string");
// tests for generateRandomString
describe('#generateRandomString', () => {
    it('should return a string', () => {
        const randomString = (0, generate_random_string_1.generateRandomString)();
        expect(typeof randomString).to.equal('string');
    });
    it('should return a string of length 6', () => {
        const randomString = (0, generate_random_string_1.generateRandomString)();
        expect(randomString.length).to.equal(6);
    });
    it('should return a string with only alphanumeric characters', () => {
        const randomString = (0, generate_random_string_1.generateRandomString)();
        const regex = /^[a-zA-Z0-9]+$/;
        expect(regex.test(randomString)).to.equal(true);
    });
    it('return a different random string every time', () => {
        const randomString1 = (0, generate_random_string_1.generateRandomString)();
        const randomString2 = (0, generate_random_string_1.generateRandomString)();
        expect(randomString1).to.not.equal(randomString2);
    });
});
