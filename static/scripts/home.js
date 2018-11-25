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

//To set active tab in navigation bar
function HeaderController($scope, $location) 
{ 
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
}


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

mainApp.controller('planets', function($scope, $http) {
    $http.get('/planet/fetch_all').then(function(res) {
        $scope.planets = res;
    });
});

mainApp.controller('ownedItems', function($scope, $http, $interval) {
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
        $scope.leaderboardData = res.data;
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
        if($scope.inputFriend){
            
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
mainApp.directive('isFriend', ['$http', function($http) {
    return {
        require: 'ngModel',
        link: function(scope, element, attributes, model) { 
            model.$asyncValidators.isFriend = function(uname) { 
                return $http.get('/user/is_friend', {params: { friend: uname}}).then(function (res) {
                    model.$setValidity('addFriend.inputFriend.$error.isFriend', !res.data);
                }); 
            };
        }
    } 
}]);