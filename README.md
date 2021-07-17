# GreaterHealth

To run the project on your computer:
1. git clone https://github.com/{GITHUB USERNAME}/GreaterHealth.git to clone the repo
  to your local machine.
2. in the terminal of the project directory, run `npm i` to install project dependencies.
3. create a .env file in the project directory. In this file, you will have your 
  project secrets, such as API keys. See the "usage" section of https://www.npmjs.com/package/dotenv for more information. For this project, set PORT to any port of your liking, and 
  you can get the firebase configuration keys from GreaterHealth > Project Settings > SDK setup and configuration > Config

To add a new page:
1. The page must have a .ejs extension. Furthermore, it must be put in the views/pages directory. 
2. In the head tag, use: `<%- include('../partials/headTag', {title: "Title of the Page"}); %>`. In the title key-value pair, put the title of the page in quotes as the value of the pair. If you would like to have an additional css file specifically for the new page, use the following format: `<link rel="stylesheet" href="/css/{CSS File}">`.
3. In the body tag, use the header tag (`<header></header>`) to enclose the header partial: `<%- include('../partials/header'); %>`. As of now, this contains the navbar.
4. Likewise, before you put the enclosing body tag, use the footer tag (`<footer></footer>`) to enclose the footer partial: `<%- include('../partials/footer'); %>`. As of now, this contains the footer.
5. Be sure to add a get route in index.js, as well as a navbar link item for your new page.

To reference a file in the public folder: Use /css, /images, or /js (see middleware in index.js).

To get more information on EJS, visit the official EJS website: https://ejs.co/