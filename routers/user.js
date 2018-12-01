let express = require("express");
let router  = express.Router();


let User = require('../model/user.js');

router.post('/user/login',function(req,res){
    if(req.body.inputUsername && req.body.inputPassword) {
        req.session.uname = req.body.inputUsername;
        req.session.pword = req.body.inputPassword;
        
        if(req.body.inputRemember) {
            res.cookie('uname', req.session.uname);
            res.cookie('pword', req.session.pword);
        }
    }
    
    if(!req.session.uname || !req.session.pword) {
        res.redirect('/');
    }
    else {
        let user = new User(req.session.uname, req.session.pword);
        user.isValid(function(err, result) {
            if(err) {
                res.status(500);
                res.send(err);
            }
            else if(result) {
                user.setOnline(1, function(err, result2) {
                    if(err) {
                        res.status(500);
                        res.send(err);
                    } else if(result2) {
                        res.redirect('/home');
                    } else {
                        res.redirect('/');
                    }
                });
            }    
            else {
                res.redirect('/');
            }
        });
    }
    
});


router.post('/user/valid', function(req, res) {
    
    if(!req.session.uname || !req.session.pword) {
        res.send('new');
    }
    else {
        let user = new User(req.session.uname, req.session.pword);
         user.isValid(function(err, result) {
            if(err) {
                res.status(500);
                res.send(err);
            }
            else if(result) {
                res.redirect('/home');
            }    
            else {
                res.send('invalid');
            }
        });
    }
});

router.get('/user/delete_account', function(req, res) {
    let username = req.session.uname;
    let password = req.session.pword;
    
    let user = new User(req.session.uname, req.session.pword);
    user.deleteUser(function(err, result) {
        if(err) {
            res.status(500);
            res.send(err);
        }
        else if(result) {
            res.redirect('/user/signout');
        }    
        else {
            res.send('invalid');
        }
    });
});


//Check if username is available
router.get('/user/uname/available', function(req, res) {
    let username = req.query['username'];
    let user = new User(username, '');
    
    user.isUsernameAvailable(function(err, available) {
        if(err) {
            res.status(500);
            res.send(err);
        }
        else
            res.send(available);
    });
});

router.get('/user/is_self', function(req,res) {
    let username = req.query['friend'];
    
    res.send(username == req.session.uname);
});

router.get('/user/is_friend', function(req,res) {
    let username = req.session.uname;
    let password = req.session.pword;
    let user = new User(username, password);
    let friend_name = req.query['friend'];
    
    user.isFriend(friend_name, function(err, result) {
        if(err) {
            res.status(500);
            res.send(err);
        }
        else
        {
            res.send(result);
        }
        
    });
});

//Add new user
router.post('/user/addnew', function(req,res) {
    let username = req.body.inputUsername;
    let password = req.body.inputPassword;
    
    req.session.uname = username;
    req.session.pword = password;
    
    //Validate if data is correct
    if(username.length < 3 || username.length > 255 || password.length < 3 || password.length > 255) {
        res.redirect('/');
    }
    
    let user = new User(username, password);
    user.isUsernameAvailable(function(err, available) {
        if(err) {
            res.status(500);
            res.send(err);
        }
        else if(!available) {
            res.redirect('/');
        }
        else {
            user.addUser(function(err, success) {
                if(err) throw err;
                
                if(success) {   
                    res.redirect('/home');
                }
                else {
                    res.redirect('/');
                }
            });
        }
    });
});

//Sign out
router.get('/user/signout', function(req,res) {
    let user = new User(req.session.uname, req.session.pword);
    if(user) user.setOnline(0, function(err, result) {
        if(err) {
            res.status(500);
            res.send(err);
        } else if(result) {
            req.session.destroy();
            res.clearCookie("uname");
            res.clearCookie("pword");
            res.redirect('/');
        }
    });
});

router.get('/user/parameters', function(req, res) {
    let user = new User(req.session.uname, req.session.pword);
    user.getParameters(function(err, response) {
        if(err) {
            res.status(500);
            res.send(err);
        }
        else if(response) {
            res.send(response);
        }
        else { //If not valid user
            res.send({name:"Invalid User Session", message:"Username or Password in the session is invalid"});
        }
    });
});

router.post('/user/add_friend', function(req, res) {
      let username = req.body.username;
      console.error('Body: ' + JSON.stringify(req.body));
      console.error('Params: ' + JSON.stringify(req.body.params));
      console.error('Username: ' + JSON.stringify(req.body.username));
    
      let user = new User(req.session.uname, req.session.pword);
      user.addFriend(username, function(err, response) {
       if(err) {
            res.status(500);
            res.send(err);
       } else if(response) {
            res.send(response);
       } else {
           res.send({name:"Invalid User Session", message:"Username or Password in the session is invalid"});
       }
   });
});

router.get('/user/friends', function(req, res) {
   let user = new User(req.session.uname, req.session.pword);
      user.getFriends(function(err, response) {
       if(err) {
            res.status(500);
            res.send(err);
       } else if(response) {
            res.send(response);
       } else {
           res.send({name:"Invalid User Session", message:"Username or Password in the session is invalid"});
       }
   });
});

router.get('/user/leaderboard_friend', function(req, res) {
   let user = new User(req.session.uname, req.session.pword);
   user.getFriendsLeaderboard(function(err, response) {
       if(err) {
            res.status(500);
            res.send(err);
       } else if(response) {
            res.send(response);
       } else {
           res.send({name:"Invalid User Session", message:"Username or Password in the session is invalid"});
       }
   });
});

module.exports = router;