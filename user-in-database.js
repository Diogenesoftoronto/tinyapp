"use strict";
const userInDatabase = (userId, database) => {
    let result = false;
    Object.keys(database).forEach(key => {
        if (key === userId) {
            console.log(database);
            result = true;
        }
    });
    return result;
};

module.exports = userInDatabase;

