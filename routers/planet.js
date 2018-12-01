let express = require("express");
let router  = express.Router();

let User = require('../model/user.js');
let Planet = require('../model/planet.js');
let PlanetUser = require('../model/planet_user.js');

router.get('/planet/fetch_all', function(req,res) {
    let user = new User(req.session.uname, req.session.pword);
    
    user.getParameters(function(err_user, user_response) {
        if (err_user) {
            res.status(500);
            res.send(err_user);
        }
        else {
            let result = new Array();
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
                            //console.error('Parameters: ' + JSON.stringify(parameters));
                            result.push(parameters);
                            if(result.length == ids.length) {
                                //console.error('Server response: ' + result.toString());
                                res.send(result);
                            }
                        }); 
                    });
                }
            });
        }
    });
});

router.get('/planet/fetch_easy_planets', function(req,res) {
    let user = new User(req.session.uname, req.session.pword);
    
    user.getParameters(function(err_user, user_response) {
        if (err_user) {
            res.status(500);
            res.send(err_user);
        }
        else {
            let result = new Array();
            let count = 0;
            let user_planets = new Planet();
            user_planets.fetchAllEasyPlanetIds(user_response.user_id, function(err, ids) {
                if(err) {
                    res.status(500);
                    res.send(err);
                }
                else {
                    ids.forEach(function(planet_id) {
                        let planet = new Planet(planet_id);
                        planet.getParameters(function(err_param, parameters) {
                            if(err_param) throw err_param;
                            //console.error('Parameters: ' + JSON.stringify(parameters));
                            result.push(parameters);
                            if(result.length == ids.length) {
                                //console.error('Server response: ' + result.toString());
                                res.send(result);
                            }
                        }); 
                    });
                }
            });
        }
    });
});

router.get('/planet/fetch_intermediate_planets', function(req,res) {
    let user = new User(req.session.uname, req.session.pword);
    
    user.getParameters(function(err_user, user_response) {
        if (err_user) {
            res.status(500);
            res.send(err_user);
        }
        else {
            let result = new Array();
            let count = 0;
            let user_planets = new Planet();
            user_planets.fetchAllIntermediatePlanetIds(user_response.user_id, function(err, ids) {
                if(err) {
                    res.status(500);
                    res.send(err);
                }
                else {
                    ids.forEach(function(planet_id) {
                        let planet = new Planet(planet_id);
                        planet.getParameters(function(err_param, parameters) {
                            if(err_param) throw err_param;
                            //console.error('Parameters: ' + JSON.stringify(parameters));
                            result.push(parameters);
                            if(result.length == ids.length) {
                                //console.error('Server response: ' + result.toString());
                                res.send(result);
                            }
                        }); 
                    });
                }
            });
        }
    });
});

router.get('/planet/fetch_hard_planets', function(req,res) {
    let user = new User(req.session.uname, req.session.pword);
    
    user.getParameters(function(err_user, user_response) {
        if (err_user) {
            res.status(500);
            res.send(err_user);
        }
        else {
            let result = new Array();
            let count = 0;
            let user_planets = new Planet();
            user_planets.fetchAllHardPlanetIds(user_response.user_id, function(err, ids) {
                if(err) {
                    res.status(500);
                    res.send(err);
                }
                else {
                    ids.forEach(function(planet_id) {
                        let planet = new Planet(planet_id);
                        planet.getParameters(function(err_param, parameters) {
                            if(err_param) throw err_param;
                            //console.error('Parameters: ' + JSON.stringify(parameters));
                            result.push(parameters);
                            if(result.length == ids.length) {
                                //console.error('Server response: ' + result.toString());
                                res.send(result);
                            }
                        }); 
                    });
                }
            });
        }
    });
});

router.get('/planet/goToPlanet', function(req, res) {
    let user = new User(req.session.uname, req.session.pword);
    
    console.error(JSON.stringify(req.query));
    user.getParameters(function(err_user, user_response) {
        if (err_user) {
            res.status(500);
            res.send(err_user);
        }
        else {
            let planet = new Planet();
            planet.goToPlanet(user, user_response, req.query.planet_id, user_response.user_id, function(err, result)
            {
                if(err) {
                    res.status(500);
                    res.send(err);
                    return;
                }
                
                if(result) {
                    res.redirect('/home');
                }
                else {
                    res.redirect('/home#!/planets');
                }
            });
        }
    });
});

module.exports = router;