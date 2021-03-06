let pool = require('../scripts/db_connection.js').connection_pool; // For database connection

let Robot = require('../model/robot.js');

class PlanetUser {
    constructor(user_id, planet_id) {
        this.user_id = user_id;
        this.planet_id = planet_id;
    }
    
    // Adds new planet to the user with given difficulty.
    // addNewPlanet(difficulty, callback) {
    addNewPlanet(planet_id, callback) {
        let self = this;
        
        console.log("Someone called addNewPlanet with " + planet_id);

        // let sql = "INSERT INTO planet_user (planet_id, user_id, energy, completed) \
        //                 SELECT planet_id, ?, initial_energy, 0 \
        //                 FROM planet \
        //                 WHERE difficulty_level = ? \
        //                 LIMIT 1";
        let sql = "INSERT INTO planet_user (planet_id, user_id, energy, completed) \
                SELECT planet_id, ?, initial_energy, 0 \
                FROM planet \
                WHERE planet_id = ? \
                LIMIT 1";
        
        pool.getConnection(function(con_err, con) {
            if(con_err) {
                console.log("Error - " + Date() + "\nUnable to connect to database.");
                callback(con_err);
                return;
            }
            
            con.query(sql, [self.user_id, planet_id], function (err, result) {
                if (err) {
                    console.log('Error encountered on ' + Date());
                    console.log(err);
                    callback(err);
                    return;
                } 
                
                // If there are no new planets available, return false
                if(result.affectedRows === 0) {
                    callback(null, false);
                    con.release();
                }
                else {
                    //Add initial resources for the new planet to the user
                    let sql_1 = "INSERT INTO planet_user_item (planet_user_id, item_id, owned_qty) \
                                    SELECT planet_user_id, item_id, available_qty \
                                    FROM planet_item_init_resource NATURAL JOIN planet_user \
                                    WHERE planet_user_id = ?";
                    
                    // insertId of result is the auto_increment number (i.e. user_id) inserted by the first query.
                    con.query(sql_1, [result.insertId], function (err_1) {
                        if(err_1) {
                            console.log('Error encountered on ' + Date());
                            console.log(err_1);
                            callback(err_1);
                            con.release();
                            return;
                        }
                        
                        callback(null, true);
                        con.release();
                        
                    });
                }
            });
        });
    }
    
    // Return the callback function with planet user parameters 
    getParameters(callback) {
        let self = this;
        
        // If both planet id and user id are available, extract data for the particular planet and user
        if(self.user_id && self.planet_id) {
            let sql = "SELECT planet_user_id, planet_name, planet_image, difficulty_level, planet_id \
                        FROM planet_user NATURAL JOIN planet \
                        WHERE user_id = ? AND planet_id = ?";
            pool.getConnection(function(con_err, con) {
                if(con_err) {
                    console.log("Error - " + Date() + "\nUnable to connect to database.");
                    callback(con_err);
                    return;
                }
                
                con.query(sql, [self.user_id, self.planet_id], function (err, result) {
                    if (err) {
                        console.log('Error encountered on ' + Date());
                        console.log(err);
                        callback(err);
                        con.release();
                        return;
                    }
                   
                    callback(null, result[0]);
                    con.release();
                });
            });
        }
        // If only user id is available, the extract data for the active planet (i.e. completed = 0)
        else if(self.user_id) {
            let sql = "SELECT planet_user_id, planet_name, planet_image, difficulty_level \
                        FROM planet_user NATURAL JOIN planet \
                        WHERE user_id = ? AND completed = 0 \
                        LIMIT 1";   
            pool.getConnection(function(con_err, con) {
                if(con_err) {
                    console.log("Error - " + Date() + "\nUnable to connect to database.");
                    callback(con_err);
                    return;
                }
            
                con.query(sql, [self.user_id], function (err, result) {
                    if (err) {
                        console.log('Error encountered on ' + Date());
                        console.log(err);
                        callback(err);
                        con.release();
                        return;
                    }
                    
                    if(result.length === 0) {
                        // No active planet found. 
                        // Check if there is new planet is available 
                        let check_new = "SELECT planet_id, MIN(difficulty_level) AS difficulty \
                                        FROM planet \
                                        WHERE planet_id NOT IN ( \
                                                SELECT planet_id \
                                                FROM planet_user \
                                                WHERE user_id = ? AND completed = 1\
                                        )";
                        con.query(check_new, [self.user_id], function(err_new, result_new) {
                            if (err_new) {
                                console.log('Error encountered on ' + Date());
                                console.log(err_new);
                                callback(err_new);
                                con.release();
                                return;
                            }
                            
                            if(result_new.length === 0) {
                                // No new planet found
                                callback(null, null);
                            }
                            else {
                                console.log("Calling addNewPlanet in getParameters");
                                self.addNewPlanet(result_new[0].planet_id, function(err_add, result_add) {
                                    if (err_add) {
                                        console.log('Error encountered on ' + Date());
                                        console.log(err_add);
                                        callback(err_add);
                                        con.release();
                                        return;
                                    }
                                    
                                    if(result_add) {
                                        // If new planet is successfully added, call getParameters again. 
                                        self.getParameters(callback);
                                        con.release();
                                    }
                                    else {
                                        // If new planet not added
                                        callback(null, null);
                                        con.release();
                                    }
                                    
                                });
                            }
                            
                            
                        });             
                        
                    }
                    else {
                        callback(null, result[0]);
                        con.release();
                    }
                    
                });

            });
        } 
    }
    
    // Returns the callback function with available energy in the active planet.
    getAvailableEnergy(callback) {
        let self = this;
        
        if(self.user_id) {
            let sql = "SELECT energy \
                        FROM planet_user NATURAL JOIN planet \
                        WHERE user_id = ? AND completed = 0";     
            pool.getConnection(function(con_err, con) {
                if(con_err) {
                    console.log("Error - " + Date() + "\nUnable to connect to database.");
                    callback(con_err);
                    return;
                }
                con.query(sql, [self.user_id], function (err, result) {
                    if (err) {
                        console.log('Error encountered on ' + Date());
                        console.log(err);
                        callback(err);
                        con.release();
                        return;
                    }
                    if(result.length === 0) 
                        callback(null, null);
                    else 
                        callback(null, result[0].energy);
                    
                    con.release();
                });
            });
        } 
    }
    
    // Returns the required goals for the current planet
    getGoals(callback) {
        let self = this;
        
        if(self.user_id) {
            let sql = "SELECT item_name, item_image, required_qty \
                        FROM planet_item_goal NATURAL JOIN planet_user NATURAL JOIN item \
                        WHERE user_id = ? AND planet_id = (SELECT current_planet_id FROM user WHERE user_id = ?)";
            pool.getConnection(function(con_err, con) {
                if(con_err) {
                    console.log("Error - " + Date() + "\nUnable to connect to database.");
                    callback(con_err);
                    return;
                }
                
                con.query(sql, [self.user_id, self.user_id], function (err, result) {
                    if (err) {
                        console.log('Error encountered on ' + Date());
                        console.log(err);
                        callback(err);
                        con.release();
                        return;
                    }
                    
                    callback(null, result);
                    con.release();
                });

            });
        }
    }
    
    // Returns the owned item with their quantities in the active planet 
    getOwnedItems(callback) {
        let self = this;
        
        if(self.user_id) {
            //TODO only select items on current planet
            // planet_user_item may contain multiple entires for same item, so the owned quantity is aggregated 
            let sql = "SELECT item_id, MAX(item_name) item_name, MAX(item_image) item_image, SUM(owned_qty) owned_qty \
                        FROM planet_user_item NATURAL JOIN planet_user NATURAL JOIN item \
                        WHERE user_id = ? AND planet_id = (SELECT current_planet_id FROM user WHERE user_id = ?)\
                        GROUP BY item_id \
                        HAVING SUM(owned_qty) > 0";
            pool.getConnection(function(con_err, con) {
                if(con_err) {
                    console.log("Error - " + Date() + "\nUnable to connect to database.");
                    callback(con_err);
                    return;
                }
                
                con.query(sql, [self.user_id, self.user_id], function (err, result) {
                    if (err) {
                        console.log('Error encountered on ' + Date());
                        console.log(err);
                        callback(err);
                        con.release();
                        return;
                    }
                    
                    callback(null, result);
                    con.release();
                });

            });
        }
    }
    
    // Returns the list of enabled robot ids in the planet 
    getEnabledRobots(callback) {
        let self = this;
        
        if(self.user_id) {
            let sql = "SELECT DISTINCT robot_id \
                        FROM robot NATURAL JOIN planet_user NATURAL LEFT JOIN ( \
                            SELECT * \
                            FROM item_robot \
                            WHERE build_end_time IS NULL\
                             ORDER BY build_start_time \
                        ) AS ir \
                        WHERE user_id = ? AND planet_id = (SELECT current_planet_id FROM user WHERE user_id = ?) \
                            AND enabled = 1 ";
            pool.getConnection(function(con_err, con) {
                if(con_err) {
                    console.log("Error - " + Date() + "\nUnable to connect to database.");
                    callback(con_err);
                    return;
                }
                
                con.query(sql, [self.user_id, self.user_id], function (err, result) {
                    if (err) {
                        console.log('Error encountered on ' + Date());
                        console.log(err);
                        callback(err);
                        con.release();
                        return;
                    }
                    
                    callback(null, result);
                    con.release();
                });
            });
        }
    }
    
    
    //Check whether the user has started the specified planet
    isStarted(planet_id, callback) {
        let self = this;
        
        if(self.user_id) {
            let sql = "SELECT * FROM planet_user WHERE user_id = ? AND planet_id = ?";
            pool.getConnection(function(con_err, con) {
                if(con_err) {
                    console.log("Error - " + Date() + "\nUnable to connect to database.");
                    callback(con_err);
                    return;
                }
                
                con.query(sql, [self.user_id, planet_id], function (err, result) {
                    if (err) {
                        console.log('Error encountered on ' + Date());
                        console.log(err);
                        callback(err);
                        con.release();
                        return;
                    }
                    callback(null, result.length > 0);
                    con.release();
                });
            });
        }
    }
    
    // Updates the production of the enabled robots in the planet 
    // Performs both periodic updated and catch-up updates in the planet
    updateProduction(first_call, callback) {  
        // first_call variable is used so that in multiple calls of this method during the recursion, only one final callback is issued.
        let self = this;
        
        self.catchup_required = false; //Flag to check if catchup is required
        
        // Produce a single robot
        let produce = function(robot_id, callback) {
            let robot = new Robot(robot_id);
            robot.startProduction(callback);
        };
        
        // Produce from multiple robots sequentially
        let produce_multiple = function(robot_ids, process) {
            let i = 0;
            
            function next() {
                if(i < robot_ids.length) {
                    process(robot_ids[i++].robot_id, function(err_produce, result_produce, repeat){
                        if(err_produce) {
                            callback(err_produce);
                            return;
                        }
                           
                        // repeat flag is set if the robot can again produce items.
                        if(repeat) self.catchup_required = true;
                        next();
                    });
                } 
                else {
                    // Recursively catch up if any one of the robot can produce more.
                    if(self.catchup_required) {
                        self.updateProduction(false, callback);
                    }
                    
                    if(first_call) callback(null, true);
                }
            }
            
            next();
        };
        
        self.getEnabledRobots(function(err, result) {
            if(err) throw err;
            
            produce_multiple(result, produce);
            
        });
    }
    
    // Check if the goals of the planet is reached.
    checkIfCompleted(callback) {
        let self = this;

        let sql = "SELECT COALESCE(owned_qty,0) owned_qty, required_qty \
                    FROM ( \
                        SELECT user_id, item_id, SUM(owned_qty) owned_qty \
                        FROM planet_user_item NATURAL JOIN planet_user \
                        WHERE planet_id = (SELECT current_planet_id FROM user WHERE user_id = ?) \
                        GROUP BY user_id, item_id \
                        HAVING SUM(owned_qty) > 0 \
                    ) AS owned \
                    NATURAL RIGHT JOIN ( \
                        SELECT user_id, item_id, required_qty \
                        FROM planet_user NATURAL JOIN planet_item_goal \
                        WHERE planet_id = (SELECT current_planet_id FROM user WHERE user_id = ?) \
                    ) AS goal \
                    WHERE user_id = ? \
                        AND COALESCE(owned_qty,0) < required_qty"; // Completed planet_user will return empty result 
        
        pool.getConnection(function(con_err, con) {
            if(con_err) {
                console.log("Error - " + Date() + "\nUnable to connect to database.");
                callback(con_err);
                return;
            }
                
            con.query(sql, [self.user_id, self.user_id, self.user_id], function (err, result) {
                if (err) {
                    console.log('Error encountered on ' + Date());
                    console.log(err);
                    callback(err);
                    con.release();
                    return;
                }
                
                if(result.length > 0) { //Planet is not completed yet.
                    callback(null, false);
                    con.release();
                }
                else {
                    // Fetch current difficulty level to add new planet
                    self.getParameters(function(err_params, result_params) {
                        if(err_params) {
                            callback(err_params);
                            return;
                        }
                        
                        
                        if(!result_params) { 
                            // There is no current planet. All planets are completed. 
                            // All planets are completed. No planet remaining.
                            callback(null, false, true);
                            con.release();
                            return;
                        }

                        let planet_id = result_params.planet_id;
                        
                        // If completed, update current planet `completed` field.
                        let update = "UPDATE planet_user \
                                        SET completed = 1, time_finished = NOW() \
                                        WHERE user_id = ? AND planet_id = (SELECT current_planet_id FROM user WHERE user_id = ?)";
                                        
                        con.query(update, [self.user_id, self.user_id], function(err_update) {
                            if (err_update) {
                                console.log('Error encountered on ' + Date());
                                console.log(err_update);
                                callback(err_update);
                                con.release();
                                return;
                            }
                            
                            // Add new planet of higher difficulty 
                            console.log("Calling addNewPlanet in checkIfCompleted");
                            self.addNewPlanet(planet_id + 1, function(err_new, result_new) {
                                if (err_new) {
                                    console.log('Error encountered on ' + Date());
                                    console.log(err_new);
                                    callback(err_new);
                                    con.release();
                                    return;
                                }
                                //Check if new planet inserted successfully
                                if(result_new) {
                                    
                                    // Add experience point to user
                                    let exp_pts = "UPDATE user SET experience = experience + ? WHERE user_id = ?";
                                    con.query(exp_pts, [planet_id, self.user_id], function(err_exp) {
                                        if (err_exp) {
                                            console.log('Error encountered on ' + Date());
                                            console.log(err_exp);
                                            callback(err_exp);
                                            con.release();
                                            return;
                                        }
                                        
                                        callback(null, true);
                                        con.release();
                                    });
                                }
                                else {
                                    //No new planet were inserted 
                                    // Set all completed flag in callback function
                                    
                                
                                    callback(null, false, true);
                                    con.release();
                                }
                                
                                
                            });
                        });
    
                        
                    });
                    
                }
                    
            });
    
        });
        
    }
    
    resetPlanet(callback) {
        let self = this;
        
        // Delete all log records for the planet 
        let del_log = "DELETE FROM item_robot \
                        WHERE robot_id IN ( \
                            SELECT robot_id FROM robot NATURAL JOIN planet_user WHERE user_id = ? AND planet_id = (SELECT current_planet_id FROM user WHERE user_id = ?) \
                        )";

        let del_robots = "DELETE FROM robot \
                            WHERE planet_user_id = ( \
                                SELECT planet_user_id \
                                FROM planet_user \
                                WHERE user_id = ? AND planet_id = (SELECT current_planet_id FROM user WHERE user_id = ?) \
                            )";
        
        let del_owned_items = "DELETE FROM planet_user_item \
                               WHERE planet_user_id = ( \
                                SELECT planet_user_id \
                                FROM planet_user \
                                WHERE user_id = ? AND planet_id = (SELECT current_planet_id FROM user WHERE user_id = ?) \
                              )";
                              
        let insert_init_items = "INSERT INTO planet_user_item (planet_user_id, item_id, owned_qty) \
                                SELECT planet_user_id, item_id, available_qty \
                                FROM planet_item_init_resource NATURAL JOIN planet_user \
                                WHERE user_id = ? AND planet_id = (SELECT current_planet_id FROM user WHERE user_id = ?)";
        
        let update_energy = "UPDATE planet_user pu \
                                INNER JOIN  planet p ON  p.planet_id = pu.planet_id \
                             SET pu.energy = p.initial_energy \
                             WHERE pu.user_id = ? AND pu.planet_id = (SELECT current_planet_id FROM user WHERE user_id = ?)";
        
        pool.getConnection(function(con_err, con) {
            if(con_err) {
                console.log("Error - " + Date() + "\nUnable to connect to database.");
                callback(con_err);
                return;
            }
            
            con.query(del_log, [self.user_id, self.user_id], function (err_del_log) {
                if (err_del_log) {
                    console.log('Error encountered on ' + Date());
                    console.log(err_del_log);
                    callback(err_del_log);
                    con.release();
                    return;
                }
                
                con.query(del_robots, [self.user_id, self.user_id], function (err_del_robots) {
                    if (err_del_robots) {
                        console.log('Error encountered on ' + Date());
                        console.log(err_del_robots);
                        callback(err_del_robots);
                        con.release();
                        return;
                    }
                    
                    con.query(del_owned_items, [self.user_id, self.user_id], function (err_del_owned_items) {
                        if (err_del_owned_items) {
                            console.log('Error encountered on ' + Date());
                            console.log(err_del_owned_items);
                            callback(err_del_owned_items);
                            con.release();
                            return;
                        }
                        
                        con.query(insert_init_items, [self.user_id, self.user_id], function (err_insert_items) {
                            if (err_insert_items) {
                                console.log('Error encountered on ' + Date());
                                console.log(err_insert_items);
                                callback(err_insert_items);
                                con.release();
                                return;
                            }
                            
                            con.query(update_energy, [self.user_id, self.user_id], function (err_update_energy) {
                                if (err_update_energy) {
                                    console.log('Error encountered on ' + Date());
                                    console.log(err_update_energy);
                                    callback(err_update_energy);
                                    con.release();
                                    return;
                                }
                                
                                callback(null, true);
                                con.release();
                            });
                            
                        });
                    });
                    
                });
                
            });
        });
            
    }

}

module.exports = PlanetUser;