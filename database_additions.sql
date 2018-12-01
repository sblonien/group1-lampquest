--This file contains the sql for the database changes.


--Item, planet, and robot additions:

--item
INSERT INTO item VALUES (10, 'iron', 'iron.jpg'), (11, 'rust', 'rust.jpg'), (12, 'vinegar', 'vinegar.jpg'), (13, 'weird red plant', 'wrp.jpg'), (14, 'egg', 'egg.jpg'), (15, 'flour', 'flour.jpg'), (16, 'sugar', 'sugar.jpg'), (17, 'poison', 'poison.jpg'), (18, 'cake', 'cake.jpg'), (19, 'dark matter', 'dm.jpg'), (20, 'lemon', 'lemon.jpg'), (21, 'lemonade', 'lemonade.jpg');

--planet
INSERT INTO planet VALUES (8, 'Remus', 'remus.jpg'), (9, 'Pegasi', 'pegasi.jpg'), (10, 'Geonosis', 'geonosis.jpg'), (11, 'Q', 'Q.jpg'), (12, 'Kashyyyk', 'kashyyyk.jpg'), (13, 'Proxima Centauri B', 'prox.jpg'), (14, 'Nibiru', 'nibiru.jpg'), (15, 'Torte', 'torte.jpg'), (16, 'Janus VI', 'janus.jpg'), (17, 'Earth', 'earth.jpg');

--planet_item_goal
INSERT INTO planet_item_goal VALUES (8, 3, 30), (9, 19, 120), (10, 2, 50), (11, 14, 2), (12, 3, 10), (12, 10, 50), (13, 2, 20), (13, 8, 20), (14, 2, 50), (14, 10, 10), (15, 18, 18), (16, 3, 100), (17, 21, 15);

--planet_item_init_resource
INSERT INTO planet_item_init_resource VALUES (8, 1, 60), (8, 2, 30), (9, 16, 30), (10, 5, 75), (10, 9, 50), (11, 17, 85), (12, 11, 150), (12, 17, 150), (13, 3, 60), (13, 7, 20), (14, 3, 90), (14, 11, 30), (14, 13, 20), (15, 13, 105), (16, 6, 150), (16, 9, 100), (17, 20, 132);

--robot_type
INSERT INTO robot_type VALUES (9, 'Polisher', 30, 'polisher.jpg', 25), (10, 'Vinegarinator', 20, 'vinegarinator.jpg', 15), (11, 'Chicken', 24, 'chicken.jpg', 300), (12, 'Oven', 60, 'oven.jpg', 10), (13, 'Lemonator', 12, 'lemonator.jpg', 12), (14, 'Sweetener', 15, 'sweetener.jpg', 20), (15, 'Grinder', 10, 'grinder.jpg', 14), (16, 'Antidoter', 30, 'antidoter.jpg', 30), (17, 'Antisweetener', 20, 'antisweetener.jpg', 20), (18, 'Lemon Inverter', 4, 'lemon_inverter.jpg', 24);

--combiner
INSERT INTO combiner VALUES (9, 10, 10, 1), (10, 12, 5, 1), (11, 14, 12, 1), (12, 18, 7 ,1), (13, 21, 12, 1);

--consume_combiner
INSERT INTO consume_combiner VALUES (9, 11, 3), (9, 12, 1), (10, 3, 3), (10, 13, 1), (11, 3, 1), (11, 13, 2), (12, 14, 2), (12, 15, 3), (12, 16, 1), (13, 13, 3), (13, 18, 1), (13, 19, 3), (13, 20, 2);

--diffusor
INSERT INTO diffusor VALUES (14, 13, 8, 200, 1), (15, 13, 20, 300, 1), (16, 17, 4, 700, 1), (17, 16, 2, 30, 1), (18, 20, 1, 142, 1);

--produce_diffusor
INSERT INTO produce_diffusor VALUES (14, 3, 4), (14, 16, 1), (15, 11, 1), (15, 15, 4), (16, 3, 1), (16, 13, 2), (17, 7, 2), (17, 19, 4), (18, 13, 1), (18, 19, 2);

--Other changes:

--Add fields for time_started and time_completed
ALTER TABLE planet_user
ADD time_started TIMESTAMP DEFAULT CURRENT_TIMESTAMP, time_finished TIMESTAMP DEFAULT NULL;

--Create friends table
CREATE TABLE friends (user_id_1 INT, user_id_2 INT);

--Add the isOnline column for the friends list
ALTER TABLE user
ADD is_online INT NOT NULL DEFAULT 0;

--Add current_planet_id to user
ALTER TABLE user
ADD current_planet_id INT DEFAULT 1 NOT NULL;