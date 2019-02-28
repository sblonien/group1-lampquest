let mainApp = angular.module("mainApp", ['ngRoute']);
mainApp.config(['$routeProvider', function($routeProvider) {
   $routeProvider.
   when('/', {
      templateUrl: 'view/main-game.html'
   }).
   when('/factory', {
      templateUrl: 'view/factory.html'
   }).
   when('/planets', {
      templateUrl: 'view/planet-picker.html'
   }).
   otherwise({
      redirectTo: '/'
   });
}]);

// To set active tab in navigation bar
function HeaderController($scope, $location) 
{ 
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
}

// window.onbeforeunload = function (e) {
//     // Cancel the event as stated by the standard.
//     e.preventDefault();
//     window.location.href = '/user/signout';
//     // Chrome requires returnValue to be set.
//     e.returnValue = '';
//     return 'Please logout before closing the page';
// };

mainApp.controller('userParameters',function($scope, $http) {
   $http.get('/user/parameters').then(function(res) {
        $scope.username = res.data.username;
        $scope.experience = res.data.experience;
        $scope.user_id = res.data.user_id;
   });
});

mainApp.controller('planetParameters',function($scope, $http, $interval) {
     $http.get('/planet_user/parameters').then(function(res) {
            $scope.planet_name = res.data.planet_name;
            $scope.planet_image = res.data.planet_image;
            $scope.difficulty_level = res.data.difficulty_level;
     });
     
    let updateEnergy = function() {
        $http.get('/planet_user/getEnergy').then(function(res) {
            $scope.energy = res.data.energy;
        });
    };
    
    updateEnergy(); // To update at start
    $interval(updateEnergy, 1000); // To update after every 1 sec
    
   $http.get('/planet_user/goals').then(function(res) {
        $scope.goals = res.data;
   });
   
});

mainApp.controller('leaderboard', function($scope, $http) {
   $http.get('/planet_user/leaderboard').then(function(res){
       $scope.leaderboard = res;
   }); 
});

mainApp.controller('robotTypes', function($scope, $http) {
    $http.get('/robot_type/fetch_all').then(function(res) {
        
        $scope.combiners = [];
        $scope.diffusors = [];
        
        for(let i=0; i<res.data.length; i++) {
            if(res.data[i].type == "combiner") $scope.combiners.push(res.data[i]);
            if(res.data[i].type == "diffusor") $scope.diffusors.push(res.data[i]);
        }
        
    });
});

mainApp.controller('planetPicker', function($scope, $http) {
    $http.get('/planet/fetch_all').then(function(res) {
        
        $scope.planetData = {};
        $scope.planetData.planets = res.data;
        console.log('Planets: ' + JSON.stringify( $scope.planetData.planets));
    });
});

mainApp.controller('easyPlanetsPicker', function($scope, $http) {
    $http.get('/planet/fetch_easy_planets').then(function(res) {
        
        $scope.planetData = {};
        $scope.planetData.planets = res.data;
        console.log('Planets: ' + JSON.stringify( $scope.planetData.planets));
    });
});

mainApp.controller('intermediatePlanetsPicker', function($scope, $http) {
    $http.get('/planet/fetch_intermediate_planets').then(function(res) {
        
        $scope.planetData = {};
        $scope.planetData.planets = res.data;
        console.log('Planets: ' + JSON.stringify( $scope.planetData.planets));
    });
});

mainApp.controller('hardPlanetsPicker', function($scope, $http) {
    $http.get('/planet/fetch_hard_planets').then(function(res) {
        
        $scope.planetData = {};
        $scope.planetData.planets = res.data;
        console.log('Planets: ' + JSON.stringify( $scope.planetData.planets));
    });
});

mainApp.controller('ownedItems', function($scope, $http, $interval) {
    //console.error('Parent is: ' + JSON.stringify($scope.$parent));
    
    // $scope = $scope.$parent.$scope;
    
    let updateOwnedItems = function() {
        $http.get('/planet_user/update_production').then(function(result) {
            $http.get('/planet_user/owned').then(function(res) {
                $scope.owned = res.data;
            });
        });
    };
    
    updateOwnedItems(); // To update at start
    $interval(updateOwnedItems, 2000); // To update every 2 sec
});


mainApp.controller('ownedRobots', function($scope, $http, $window) {
    $http.get('/robot_type/robot/fetchAll').then(function(res) {
        $scope.owned_robots = res.data;
        $scope.toggleEnabled = function (robot_id) {
            $http.get('/robot_type/robot/toggleEnabled', {params:{"robot_id":robot_id}}).then(function(res_toggle){
               if(!res_toggle.data) { //If response was false
                   $window.location.href = '/home'; //Redirect to home
               } 
            });
        };
    });
    
});

mainApp.controller('complete', function($http, $interval, $window) {
    let check = function() {
        $http.get('/planet_user/check_if_completed').then(function(res) {
            if(res.data.completed) { //If planet quest is completed, show the modal saying level is completed. 
                $('#modal_level_complete').modal('show');
            }
            else if(res.data.all_completed) { // If all planets are completed, redirect to end page.
                $window.location.href = '/completed';
            }
        });
    };
    
    check();
    $interval(check, 1000); //Periodically check every second if the planet quest is completed.
});

mainApp.controller('friendLeaderboard', function($scope, $http) {
    $http.get('/user/friends').then(function(res) {
        $scope.friend = {};
        $scope.friend.leaderboardData = res.data;
    });

    const showFriendLeaderboard = function() {
        $http.get('/user/leaderboard_friend').then(function(res){
            $scope.leaderboardData = res;
        });
    };

    const showGlobalLeaderboard = function() {
        $http.get('/planet_user/leaderboard').then(function(res) {
            $scope.leaderboardData = res.data;
        });
    }
});

mainApp.controller('addFriendControl', function($scope, $http) {
    $http.post('/user/valid').then(function(res) {
        if(res.data=="new") {
            $scope.invalid = true;
        }
        else {
            $scope.invalid = false;
        }
    });
    
    $scope.addFriendSubmit = () => {
        console.error('In add friend1 with ' + ($scope.addFriend.inputFriend.$viewValue));
        if($scope.addFriend.inputFriend.$viewValue){
            console.error('In add friend2 with ' + $scope.addFriend.inputFriend.$viewValue);
            $http.post('/user/add_friend', {username: $scope.addFriend.inputFriend.$viewValue}).then(function(response) {
                 $http.get('/user/friends').then(function(res) {
                    $scope.friend.leaderboardData = res.data;
                });
            });
        }
    }
});

//Custom Validator to check if that username exists
mainApp.directive('usernameExists', ['$http', function($http) {
    return {
        require: 'ngModel',
        link: function(scope, element, attributes, model) { 
            model.$asyncValidators.usernameAvailable = function(uname) { 
                return $http.get('/user/uname/available', {params: { username: uname}}).then(function (res) {
                    model.$setValidity('usernameExists', !res.data);
                }); 
            };
        }
    } 
}]);

//Custom Validator to check if that user already has that friend
mainApp.directive('notFriend', ['$http', function($http) {
    return {
        require: 'ngModel',
        link: function(scope, element, attributes, model) { 
            model.$asyncValidators.isFriend = function(uname) { 
                return $http.get('/user/is_friend', {params: { friend: uname}}).then(function (res) {
                    model.$setValidity('notFriend', !(res.data != null && res.data.length > 0));
                }); 
            };
        }
    } 
}]);

//Custom Validator to check if that user is trying to add himself
mainApp.directive('notSelf', ['$http', function($http) {
    return {
        require: 'ngModel',
        link: function(scope, element, attributes, model) { 
            model.$asyncValidators.isSelf = function(uname) { 
                return $http.get('/user/is_self', {params: { friend: uname}}).then(function (res) {
                    model.$setValidity('notSelf', !(res.data));
                }); 
            };
        }
    } 
}]);

mainApp.controller('nightControl', function($scope, $http, $window) {
        $scope.mode = 'light';
        $scope.modeDisplay = 'Dark Mode';
        $scope.pnlColor = 'color: black;';
        $scope.hColor = 'color: black;';
        $scope.bkgClr = '';
        
        $scope.switchMode = () => {
            if($scope.mode == 'light'){
                $scope.mode = 'dark';
                $scope.modeDisplay = 'Light Mode';
                $scope.pnlColor = 'background-color: #566584; color: white;';
                $scope.hColor = 'background-color: #45408e; color: white;';
                $scope.bkgClr = 'night';
            } else {
                $scope.mode = 'light';
                $scope.modeDisplay = 'Dark Mode';
                $scope.pnlColor = 'color: black;';
                $scope.hColor = 'color: black;';
                $scope.bkgClr = '';
            }
        };
});