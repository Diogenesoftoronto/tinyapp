const express = require('express');
const app = express()
const PORT = 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

app.get("/", (req: any, res: any) => {
  res.send("Hello!");
});
app.get("/urls.json", (req: any, res: any) => {
  res.json(urlDatabase);
});
app.get("/hello", (req: any, res: any) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});