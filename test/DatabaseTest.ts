import chai from 'chai';
const expect = chai.expect;
import {Database, User} from '../classes';

describe('#Database Class', () => {
  let database: Database;
  let user: User;
  beforeEach(() => {
    database = new Database();
    user = new User('username1');
    user.setPassword = 'password1';
    user.setEmail = 'example@example.com'
    user.setUrls = {'url1': 'https://www.google.com'};
    user.setSession = 'session1';
  });
  describe('#set&get users', () => {
    it('should set users', () => {
      database.setUsers = user;
      expect(database.usersInDB).to.eql(user);
    });
  });
  describe('#get users', () => {
    it('should return users', () => {
      expect(database.usersInDB).to.eql({});
    });
  });
  describe('#userbyUsername', () => {
    it('should return user', () => {
      database.setUsers = user;
      expect(database.userbyUsername('username1')).to.eql(user);
    });
  });
  describe('#isUsernameInDB', () => {
    it('should return true', () => {
      database.setUsers = user;
      expect(database.isUsernameInDB('username1')).to.equal(true);
    });
  });
  describe('#isPassInDB', () => {
    it('should return true', () => {
      database.setUsers = user;
      expect(database.isPassInDB('username1', 'password1')).to.equal(true);
    });
  });
  describe('#isEmailInDB', () => {
    it('should return true', () => {
      database.setUsers = user;
      expect(database.isEmailInDB('username1', 'example@example.com')).to.equal(true);
    });
  });
  describe('#isSessionInDB', () => {
    it('should return true', () => {
      database.setUsers = user;
      expect(database.isSessionInDB('username1', 'session1')).to.equal(true);
    });
  });
});
    
