# tinyapp
## A tiny app
A url shortener written in TypeScript. Using the express framework.It has already been compiled to JavaScript so there's no need to compile it. You can review the JS code, however understand that the JS is not intended to be readable. Only the TypeScript code is intended to be readable.
## Final Product

!["When you first come to the page you will have an option to login or register. There is a youtube video that you can watch that will explain what a URL shortener is as well."](#images/Frontpage.png)

!["You can only login in if you have already registered before! If you try to Login it will redirect you to the register page if you have not registered before! And if you have registered it will send you to the Login page. If you put in an empty password, username, or email, it will send you an error. You must fill all fields."](#images/Registration.png)

!["If you have registered you can now create a new URL and it will be shortened to a unique code. You can then go to the URL and it will redirect you to the original URL."](#./images/CreateUrl.png)

!["You can also delete and edit Urls that you have created, all those options appear in the 'My URLs' page, which is accessable through the header."](#/..images/MyUrls.pngg)

!["To logout simply press the logout button in the header. It will appear once you have logged in. Remember that you cannot see any URLs and cannot create URLs if you are not logged in!"](#images/LoggedIn.png)

!["When you edit a url you can also click the link the of the short url and it will redirect you to the URL you originally chose. Remember to use a site with the full http:// or https:// in order to be able to redirect to the correct URL."](#images/Edit.png)
## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.