# Quick Start
* To start MySQL server, use:
`mysql-ctl start`

* To access the database, use:
`mysql -uwebapp -pcsi3335 lampquest`

* To start application server, use:
`nodemon index.js`
You can then preview the running application.

Create dump of database:
`mysqldump -uroot -pcsi3335 lampquest > lampquest.sql`

# Walk-Through
* Leaderboard:
    * A leaderboard on the login page shows the top 5 users, ranked according to their points.
    * The points are calculated by taking into account the time taken to complete each planet, the number of completed planets, and the difficulty of each planet.
* Planet Picker:
    * ALMOST THERE!
* Dark Mode:
    * A button in the top right allows the user to switch their screen from light (white) to dark (blue) mode.
* Delete Account Option:
    * Users can delete their account by clicking the "delete account" button.
* New Planets:
    * 10 new planets were added (Remus, Pegasi, Geonosis, Q, Kashyyyk, Proxima Centauri B, Nibiru, Torte, Janus VI, and Earth).
* New Robots:
    * 5 new combiners were added (Polisher, Vinegarinator, Chicken, Oven, and Lemonator).
    * 5 new diffusors were added (Sweetener, Grinder, Antidoter, Antisweetener, and Lemon Inverter).
* New Items:
    * 12 new items were added (iron, rust, vinegar, weird red plant, egg, flour, sugar, cake, poison, dark matter, lemon, and lemonade).

# Tasks
Name | Tasks | Date
--- | --- | ---
Ashley | <ul><li>New planets, robots, and items complete! </li><li> Now helping with Night Mode! </li></ul>   | 11/30
Marcus | <ul><li>???</li></ul> | 11/11
Arantxa | <ul><li>Make the planet picker HTML (reference the factory HTML and how it lists robots, and change it to just list planets)</li></ul>  | 11/11
Sean | <ul><li>Make the front end HTML for the leaderboard and connect it with the JavaScript</li></ul>  | 11/11
Neil | <ul><li>Make leaderboard criteria and logic about how the leaderboard will work</li><li>Write accompanying queries for modifying tables with new attributes, and getting the list of users for the leaderboard based on the criteria</li></ul>   | 11/11

# Objectives
* Planet Picker
* Night Mode
* Delete Account (DONE!)
* Leaderboard (DONE!)
* 10 New Planets (DONE!)
* 5 New Diffusors (DONE!)
* 5 New Combiners (DONE!)