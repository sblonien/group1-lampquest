let express = require("express");
let router  = express.Router();

let User = require('../model/user.js');
let RobotType = require('../model/robot_type.js');
let Robot = require('../model/robot.js');

router.get('/robot_type/fetch_all',function(req,res){
    let user = new User(req.session.uname, req.session.pword);
    
    user.getParameters(function(err_user, user_response) {
        if (err_user) {
            res.status(500);
            res.send(err_user);
        }
        else {
            let results = [];
            let all_robot_types = new RobotType();
            all_robot_types.fetchAllRobotTypeIds(function(err, ids) {
                if(err) {
                    res.status(500);
                    res.send(err);
                }
                ids.forEach(function(robot_type_id) {
                    let robot_type = new RobotType(robot_type_id);
                    robot_type.getParameters(function(err_param, parameters) {
                        results.push(parameters);
                        if(results.length == ids.length) res.send(results);
                    }); 
                });
            });
        }
    });
});


router.get('/robot_type/addRobot', function(req, res) {
    let user = new User(req.session.uname, req.session.pword);
    
    user.getParameters(function(err_user, user_response) {
        if (err_user) {
            res.status(500);
            res.send(err_user);
        }
        else {
            let robot = new Robot();
            robot.addNewRobot(req.query.robot_type_id, user_response.user_id, function(err, result) {
                if(err) {
                    res.status(500);
                    res.send(err);
                    return;
                }
                
                if(result) {
                    res.redirect('/home');
                }
                else {
                    res.redirect('/home#!/factory');
                }
            });

        }
        
    });
});


router.get('/robot_type/robot/fetchAll', function(req,res) {
    let user = new User(req.session.uname, req.session.pword);
    
    user.getParameters(function(err_user, user_response) {
        if (err_user) {
            res.status(500);
            res.send(err_user);
        }
        else {
            let result = {};
            let count = 0;
            let user_robots = new Robot();
            user_robots.fetchAllRobotIds(user_response.user_id, function(err, ids) {
                if(err) {
                    res.status(500);
                    res.send(err);
                }
                else {
                    ids.forEach(function(robot_id) {
                        let robot = new Robot(robot_id);
                        robot.getParameters(function(err_param, parameters) {
                            if(err_param) throw err_param;
                            
                            if (parameters.robot_type_id in result) {
                                result[parameters.robot_type_id].robot.push({"robot_id": parameters.robot_id, "robot_name": parameters.robot_name, "enabled": parameters.enabled});
                            }
                            else {
                                result[parameters.robot_type_id] = parameters.type;
                                result[parameters.robot_type_id].robot = [{"robot_id": parameters.robot_id, "robot_name": parameters.robot_name, "enabled": parameters.enabled}];
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

router.get('/robot_type/robot/toggleEnabled', function(req,res){   
    let robot = new Robot(req.query.robot_id);
    robot.toggleEnabled(undefined, function(err, result) { // undefined means just change the enabled flag 0 -> 1 or 1 -> 0
        if(err) {
            res.status(500);
            res.send(err);
        }
        else {
            res.send(result);
        }
        
    });
});

module.exports = router;