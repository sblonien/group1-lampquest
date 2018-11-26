# Quick Start
* To start MySQL server, use:
`mysql-ctl start`

* To access the database, use:
`mysql -uroot lampquest`

* To start application server, use:
`node index.js`
You can then preview the running application. You can also start your application using `nodemon index.js`. Using nodemon will automatically reflect the changes made in the files while server is running. nodemon package is not available by default. You need to install it using `npm install -g nodemon`.

Create dump of database:
`mysqldump -uroot -pcsi3335 lampquest > lampquest.sql`

# Tasks
Name | Tasks | Date
--- | --- | ---
Ashley | <ul><li>Design 5 Robot Diffusors</li><li>Design 5 Robot Combiners <ul><li> Each with name, what they produce/consume, how often, what is required, energy cost, and initial cost</li></ul></li></ul>   | 11/11
Marcus | <ul><li>Design 10 Planets with Ashley using the old and newly created robots</li></ul> | 11/11
Arantxa | <ul><li>Make the planet picker HTML (reference the factory HTML and how it lists robots, and change it to just list planets)</li></ul>  | 11/11
Sean | <ul><li>Make the front end HTML for the leaderboard and connect it with the JavaScript</li></ul>  | 11/11
Neil | <ul><li>Make leaderboard criteria and logic about how the leaderboard will work</li><li>Write accompanying queries for modifying tables with new attributes, and getting the list of users for the leaderboard based on the criteria</li></ul>   | 11/11

# Objectives
* Planet Picker
* Leaderboard
* 10 New Planets
* 5 New Diffusors
* 5 New Combiners
