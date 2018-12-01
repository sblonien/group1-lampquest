let pool = require('../scripts/db_connection.js').connection_pool; // For database connection

let moment = require('moment');
let PlanetUser = require('../model/planet_user.js');

class Planet {
    // Constructor to set planet_id
    constructor(planet_id) {
        this.planet_id = planet_id;
    }

    //TODO I think this duplicates planet_user
    // Get planet parameters with the type parameters
    getParameters(callback) {
        let self = this;
        
        let sql = "SELECT planet_id, planet_name, planet_image, difficulty_level \
                    FROM planet \
                    WHERE planet_id = ?";
        pool.getConnection(function(con_err, con) {
            if(con_err) {
                console.log("Error - " + Date() + "\nUnable to connect to database.");
                callback(con_err);
                return;
            }
            
            con.query(sql, [self.planet_id], function (err, result) {
                if (err) {
                    console.log('Error encountered on ' + Date());
                    console.log(err);
                    callback(err);
                    con.release();
                    return;
                }
                
                callback(null, result);
            });
        });
    }
    
    // Fetch all planet_ids of planets 
    fetchAllPlanetIds(user_id, callback) {
        let sql = "SELECT planet_id \
                    FROM planet";
        pool.getConnection(function(con_err, con) {
            if(con_err) {
                console.log("Error - " + Date() + "\nUnable to connect to database.");
                callback(con_err);
                return;
            }
            
            con.query(sql, [user_id], function (err, result) {
                if (err) {
                    console.log('Error encountered on ' + Date());
                    console.log(err);
                    callback(err);
                    con.release();
                    return;
                }
                
                let ids = [];
                result.forEach(function(item) {
                    ids.push(item.planet_id);
                    if(ids.length == result.length) callback(null, ids);
                });
            });

        });            
    }
    
    // Fetch all planet_ids of planets the user has started. 
    fetchAllUserPlanetIds(user_id, callback) {
        let sql = "SELECT planet_id \
                    FROM planet NATURAL JOIN planet_user \
                    WHERE user_id = ? AND completed = 0";
        pool.getConnection(function(con_err, con) {
            if(con_err) {
                console.log("Error - " + Date() + "\nUnable to connect to database.");
                callback(con_err);
                return;
            }
            
            con.query(sql, [user_id], function (err, result) {
                if (err) {
                    console.log('Error encountered on ' + Date());
                    console.log(err);
                    callback(err);
                    con.release();
                    return;
                }
                
                let ids = [];
                result.forEach(function(item) {
                    ids.push(item.planet_id);
                    if(ids.length == result.length) callback(null, ids);
                });
            });
        });            
    }
    
    // Fetch all planet_ids of easy planets 
    fetchAllEasyPlanetIds(user_id, callback) {
        let sql = "SELECT planet_id \
                    FROM planet \
                    WHERE difficulty_level >= 1 AND difficulty_level <= 2";
        pool.getConnection(function(con_err, con) {
            if(con_err) {
                console.log("Error - " + Date() + "\nUnable to connect to database.");
                callback(con_err);
                return;
            }
            
            con.query(sql, [user_id], function (err, result) {
                if (err) {
                    console.log('Error encountered on ' + Date());
                    console.log(err);
                    callback(err);
                    con.release();
                    return;
                }
                
                let ids = [];
                result.forEach(function(item) {
                    ids.push(item.planet_id);
                    if(ids.length == result.length) callback(null, ids);
                });
            });

        });            
    }
    
     // Fetch all planet_ids of intermediate planets 
    fetchAllIntermediatePlanetIds(user_id, callback) {
        let sql = "SELECT planet_id \
                    FROM planet \
                    WHERE difficulty_level >= 3 AND difficulty_level <= 5";
        pool.getConnection(function(con_err, con) {
            if(con_err) {
                console.log("Error - " + Date() + "\nUnable to connect to database.");
                callback(con_err);
                return;
            }
            
            con.query(sql, [user_id], function (err, result) {
                if (err) {
                    console.log('Error encountered on ' + Date());
                    console.log(err);
                    callback(err);
                    con.release();
                    return;
                }
                
                let ids = [];
                result.forEach(function(item) {
                    ids.push(item.planet_id);
                    if(ids.length == result.length) callback(null, ids);
                });
            });

        });            
    }
    
     // Fetch all planet_ids of hard planets 
    fetchAllHardPlanetIds(user_id, callback) {
        let sql = "SELECT planet_id \
                    FROM planet \
                    WHERE difficulty_level >= 6 AND difficulty_level <= 7";
        pool.getConnection(function(con_err, con) {
            if(con_err) {
                console.log("Error - " + Date() + "\nUnable to connect to database.");
                callback(con_err);
                return;
            }
            
            con.query(sql, [user_id], function (err, result) {
                if (err) {
                    console.log('Error encountered on ' + Date());
                    console.log(err);
                    callback(err);
                    con.release();
                    return;
                }
                
                let ids = [];
                result.forEach(function(item) {
                    ids.push(item.planet_id);
                    if(ids.length == result.length) callback(null, ids);
                });
            });

        });            
    }
    
    // Go to planet selected by user
    goToPlanet(user, user_response, planet_id, user_id, callback){ 
        let planet_user = new PlanetUser(user_id, user.current_planet_id);
        
        planet_user.isStarted(planet_id, function(err, result){
            if(err) {
                console.log('Error encountered on ' + Date());
                console.log(err);
                callback(err);
                return;
            }
            
            if(result === true) {
                user.setCurrentPlanet(planet_id, function(err) {
                    if(err) {
                        console.log('Error encountered on ' + Date());
                        console.log(err);
                        callback(err);
                        return;
                    }
                    
                    callback(null, true);
                });
            } 
            
            else {
                planet_user.addNewPlanet(planet_id, function(err, result1) {
                    if(err) {
                        console.log('Error encountered on ' + Date());
                        console.log(err);
                        callback(err);
                        return;
                    }
                    
                    user.setCurrentPlanet(planet_id, function(err) {
                        if(err) {
                            console.log('Error encountered on ' + Date());
                            console.log(err);
                            callback(err);
                            return;
                        }
                        
                        callback(null, true);
                    });
                });
            }
        });
    }
}

module.exports = Planet;