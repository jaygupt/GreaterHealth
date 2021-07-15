# GreaterHealth

To run the project on your computer:
1. git clone https://github.com/{GITHUB USERNAME}/GreaterHealth.git to clone the repo
  to your local machine.
2. in the terminal of the project directory, run `npm i` to install project dependencies.
3. create a .env file in the project directory. In this file, you will have your 
  project secrets, such as API keys. See the "usage" section of https://www.npmjs.com/package/dotenv for more information. For this project, set PORT to any port of your liking, and 
  you can get the firebase configuration keys from GreaterHealth > Project Settings > SDK setup and configuration > Config

When adding a new html page:
1. In the head tag, first add jQuery using the script tag: `<script src="/jQuery/jquery.js"></script>`
2. Next, load in the standard head tag content using: 
`<script>
  $(() => {
    $("head").load("headTag.html")
  });
</script>`
3. Any custom css files must be referenced in headTag.html: This is an error that I am trying to fix.
4. In your body tag, put your content between `<div id="header"></div>` and `<div id="footer"></div>`. The navbar and footer will be loaded in through these elements, respectively.