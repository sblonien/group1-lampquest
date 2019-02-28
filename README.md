# Quick Start
* To start MySQL server, use:
`mysql-ctl start`

* To access the database, use:
`mysql -uwebapp -pcsi3335 lampquest`

* To start application server, use:
`nodemon index.js`
You can then preview the running application.

* Create dump of database:
`mysqldump -uroot -pcsi3335 lampquest > lampquest.sql`

* MORE DOCUMENTATION: Documentation.pdf

# Walk-Through
* Leaderboard:
    * A leaderboard on the login page shows the top 5 users, ranked according to their points.
    * The points are calculated by taking into account the time taken to complete each planet, the number of completed planets, and the difficulty of each planet.
* Dark Mode:
    * A button in the top-right allows the user to switch their screen from light (white) to dark (blue) mode.
* Delete Account:
    * Users can delete their account by clicking the "delete account" button.
* New Planets:
    * 10 new planets were added (Remus, Pegasi, Geonosis, Q, Kashyyyk, Proxima Centauri B, Nibiru, Torte, Janus VI, and Earth).
* New Robots:
    * 5 new combiners were added (Polisher, Vinegarinator, Chicken, Oven, and Lemonator).
    * 5 new diffusors were added (Sweetener, Grinder, Antidoter, Antisweetener, and Lemon Inverter).
* New Items:
    * 12 new items were added (iron, rust, vinegar, weird red plants, eggs, flour, sugar, cake, poison, dark matter, lemons, and lemonade).
* Friends:
    * The user is able to add friends.

# Attempted
* Planet Picker:
    * The user is able to pick a desired planet from three columns of possible planets: easy, intermediate, and hard planets.
* Online:
    * The user can see which of their friends are online.

# Required Features
* Planet Picker
* Leaderboard
* 10 New Planets
* 5 New Diffusors
* 5 New Combiners

# Extra Features
* Dark Mode
* 12 New Items
* Is User Online
* Friends 
* Delete Account