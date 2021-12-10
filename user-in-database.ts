interface userInfo {
  userID: string;
  email: string,
  password: string
};

interface userDatabase {[key: string]: userInfo}; 


const userInDatabase = (userID: string, database: object) => {
  let result = false;
  Object.keys(database).forEach(key => {
    if (key === userID){
      console.log(database)
      result = true;
    }});
  return result;
}
const userInfoInDatabase = (user: userInfo, database: userDatabase) => {
  let flag: boolean;
  let message: "Email is not correct" |"Password is not correct" | "user is not in database"| 200;
  enum result {
    flag,
    message
  }
  if (!userInDatabase (user.userID, database)) {
    message = "user is not in database";
    flag = false;
    return result;
  } else {
      if (user.email !== database.user.email) {
        flag = false;
        message = "Email is not correct";
        return result;
      }
      if (user.password !== database.user.password) {
        flag = false;
        message = "Password is not correct";
        return result;
      }
    }
    flag = true;
    message = 200;

  return result;
}
module.exports = userInDatabase;
module.exports = userInfoInDatabase;