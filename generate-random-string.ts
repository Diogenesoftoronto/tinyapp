
// a function that generates a random string of 6 alphanumeric characters
function generateRandomString() {
  // the suggestion to add a for loop here is confusing. This is a single line of code using functions already built into js. I will ignore this suggestion for now.
  return Math.random().toString(20).substr(2, 6);
}
export {generateRandomString};