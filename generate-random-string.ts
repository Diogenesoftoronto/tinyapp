
// a function that generates a random string of 6 alphanumeric characters
function generateRandomString() {
  return Math.random().toString(20).substr(2, 6);
}
export {generateRandomString};