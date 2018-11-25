let express = require("express");
let router  = express.Router();

let User = require('../model/user.js');
let Planet = require('../model/planet.js');

router.get('/planet/fetchAll', function(req,res) {
    let user = new User(req.session.uname, req.session.pword);
    
    user.getParameters(function(err_user, user_response) {
        if (err_user) {
            res.status(500);
            res.send(err_user);
        }
        else {
            let result = {};
            let count = 0;
            let user_planets = new Planet();
            user_planets.fetchAllPlanetIds(user_response.user_id, function(err, ids) {
                if(err) {
                    res.status(500);
                    res.send(err);
                }
                else {
                    ids.forEach(function(planet_id) {
                        let planet = new Planet(planet_id);
                        planet.getParameters(function(err_param, parameters) {
                            if(err_param) throw err_param;
                            
                            if (parameters.planet_id in result) {
                                result[parameters.planet_id].planet.push({"planet_id": parameters.planet_id, "planet_name": parameters.planet_name});
                            }
                            else {
                                result[parameters.planet_id] = parameters.type;
                                result[parameters.planet_id].planet = [{"planet_id": parameters.planet_id, "planet_name": parameters.robot_name}];
                            }
                            count++;
                            if(count == ids.length) res.send(result);
                        }); 
                    });
                }
            });

        }
    });
});


module.exports = router;