
import {User, Database} from './classes' 
const SUDOuser = new User('SUDOuser');
SUDOuser.setEmail = 'dudiest@dude.org'
SUDOuser.setPassword = 'SUDOpassword'
SUDOuser.setUrls = { "s8h76q": "https://www.google.com", "asd832": "https://www.youtube.com" };
const PORT = 4040
const babelDatabase: Database = new Database();
export {babelDatabase, PORT } from './constants';