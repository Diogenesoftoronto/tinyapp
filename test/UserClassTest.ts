import {User} from "../classes";
import chai from "chai"
const expect = chai.expect;

describe("#User Class", () =>{
  let user: User;
  beforeEach(() => {
    user = new User('username1');
  })
  describe('#get username', () =>{
    it('should return username', () => {
      expect(user.getUsername).to.equal('username1');
    });
  }
  )
  describe('#set&get password', () =>{
    it('should set password', () => {
      user.setPassword = 'password1';
      expect(user.getPassword).to.equal('password1');
    });
  }
  )
  describe('#set email', () =>{
    it('should set email', () => {
      user.setEmail = 'test@example.com';
      expect(user.getEmail).to.equal('test@email.com');
    });
  }
  )
  describe('#get email', () =>{
    it('should return email', () => {
      expect(user.getEmail).to.equal('');
    });
  }
  )
  describe('#set&get urls', () =>{
    it('should set urls', () => {
      user.setUrls = {'url1': 'https://www.google.com'};
      expect(user.getUrls).to.eql({'url1': 'https://www.google.com'});
    });
  }
  )
  describe('#set&get session', () =>{
    it('should set session', () => {
      user.setSession = 'session1';
      expect(user.getSession).to.equal('session1');
    });
  }
  )
})

