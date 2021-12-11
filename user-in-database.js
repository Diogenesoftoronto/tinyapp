"use strict";
;
;
const userInDatabase = (userID, database) => {
    let result = false;
    Object.keys(database).forEach(key => {
        if (key === userID) {
            console.log(database);
            result = true;
        }
    });
    return result;
};
const userInfoInDatabase = (user, database) => {
    let flag;
    let message;
    let result;
    (function (result) {
        result[result["flag"] = 0] = "flag";
        result[result["message"] = 1] = "message";
    })(result || (result = {}));
    if (!userInDatabase(user.userID, database)) {
        message = "user is not in database";
        flag = false;
        return result;
    }
    else {
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
};
module.exports = userInDatabase;
module.exports = userInfoInDatabase;
