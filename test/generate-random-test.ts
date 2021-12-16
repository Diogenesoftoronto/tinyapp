import chai from 'chai';
const expect = chai.expect;
import { generateRandomString } from '../generate-random-string';

// tests for generateRandomString
describe('#generateRandomString', () => {
  it('should return a string', () => {
    const randomString = generateRandomString();
    expect(typeof randomString).to.equal('string');
  });
  it('should return a string of length 6', () => {
    const randomString = generateRandomString();
    expect(randomString.length).to.equal(6);
  });
  it('should return a string with only alphanumeric characters', () => {
    const randomString = generateRandomString();
    const regex = /^[a-zA-Z0-9]+$/;
    expect(regex.test(randomString)).to.equal(true);
  });
  it ('return a different random string every time', () => {
    const randomString1 = generateRandomString();
    const randomString2 = generateRandomString();
    expect(randomString1).to.not.equal(randomString2);
  });
});