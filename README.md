# GreaterHealth

Website Link: https://greaterhealthapp.herokuapp.com/

To Run the Project On Your Computer for the First Time:
1. git clone https://github.com/{GITHUB_USERNAME}/GreaterHealth.git to clone the repo to your local machine.
2. In the terminal of the project directory, run `npm i` to install project dependencies.
3. Create a .env file in the project directory. In this file, you will have your project secrets, such as API keys (see the "usage" section of https://www.npmjs.com/package/dotenv for more information). For this project, set databaseURL to the Realtime Database URL (can be found on Firebase Console), and set marketplaceAPIKey to the appropriate value. Furthermore, get the Firebase configuration keys from GreaterHealth > Project Settings > SDK setup and configuration > Config. Set the corresponding environment variables found in the `serviceAccount` JSON object present in index.js.

General Workflow:
1. This app uses Heroku for deployment. If you are new to Heroku, it is beneficial to go through their tutorial on Heroku with Node.js: https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up. Ensure that you have Heroku CLI installed on your system, and have logged in using `heroku login`. If you are a collaborator on the GreaterHealth project, you should see 'greaterhealthapp' on your Heroku Dashboard. 
2. If you enter `heroku config` in the terminal, you should see the environment (config) variables for this project. If not, use `heroku config:set {VAR_NAME}={VAR_VALUE}` for each environment variable in order to add them.
3. When you make a change to the project, you will do `git add {files}` followed by `git commit -m {Commit Message}` and `git push`. You can see the changes locally using `heroku local`. Ideally, you will be on a separate branch from master; once you are done pushing the changes, you will switch to master using `git checkout master`, and merge the changes from the other branch using `git merge {Branch Name}`. You will want to push these changes to the remote origin/master branch.
4. To push to Heroku, enter `git push heroku master` and `heroku open` if you want Heroku to open the deployed website automatically. If you want Heroku to open a specific route on the website, use `heroku open {Route Name}`.

To Add a New Page:
1. The page must have a .ejs extension. Furthermore, it must be put in the views/pages directory. 
2. In the head tag, use: `<%- include('../partials/headTag', {title: "Title of the Page"}); %>`. In the title key-value pair, put the title of the page in quotes as the value of the pair. If you would like to have an additional css file specifically for the new page, use the following format: `<link rel="stylesheet" href="/css/{CSS File}">`.
3. In the body tag, include the header partial: `<%- include('../partials/header'); %>`. As of now, this contains the navbar.
4. Likewise, before you put the enclosing body tag, include the footer partial: `<%- include('../partials/footer'); %>`. As of now, this contains the footer.
5. Be sure to add a "get" route in index.js, as well as a navbar link item for your new page.

Miscellaneous:
* To reference a file in the public folder: Use /css, /images, or /js (see middleware in index.js).
* To find more information on EJS, visit the official EJS website: https://ejs.co/.