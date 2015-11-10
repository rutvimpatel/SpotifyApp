// ($function() {
$(document).ready(function(){

  var data;
  var baseUrl = 'https://api.spotify.com/v1/search?type=track&query=';
  var myApp = angular.module('myApp', ['firebase']);

  var myCtrl = myApp.controller('myCtrl', function($scope, $http, $firebaseAuth, $firebaseObject) {
    var ref = new Firebase('https://343spotapp.firebaseio.com/');

    // Create references to store tweets and users
    var usersRef = ref.child("users");

    $scope.users = $firebaseObject(usersRef);
    $scope.authObj = $firebaseAuth(ref);
console.log(users);
    console.log(authObj);

    var authData = $scope.authObj.$getAuth();
    if (authData) {
      $scope.user = authData.uid;
    }

   // console.log(authObj);

    // SignUp function
    $scope.signUp = function() {
      // Create user
      $scope.authObj.$createUser({
        email: $scope.newName,
        password: $scope.newPass     
      })

      // Once the user is created, call the logIn function
      .then($scope.logIn)

      // Once logged in, set and save the user data
      .then(function(authData) {
        $scope.user = authData.uid;
        $scope.users[authData.uid] = {
          // handle: "hello", 
          // userImage:$scope.userImage,
        }
        $scope.users.$save()
      })

      // Catch any errors
      .catch(function(error) {
        console.error("Error: ", error);
      });
    }

    // LogIn function
    $scope.logIn = function() {
      console.log('log in')
      console.log(authObj);
      return $scope.authObj.$authWithPassword({
        email : $scope.user,
        password: $scope.pass
      })
    }

    // SignIn function
    $scope.signIn = function() {
      $scope.logIn().then(function(authData){
        $scope.user = authData.uid;
      })
    }

    // LogOut function
    $scope.logOut = function() {
      $scope.authObj.$unauth()
      $scope.user = false
    }

    $scope.audioObject = {}
    $scope.getSongs = function() {
      $http.get(baseUrl + $scope.track).success(function(response){
        data = $scope.tracks = response.tracks.items
        
      })
    }
    $scope.play = function(song) {
      if($scope.currentSong == song) {
        $scope.audioObject.pause()
        $scope.currentSong = false
        return
      }
      else {
        if($scope.audioObject.pause != undefined) $scope.audioObject.pause()
        $scope.audioObject = new Audio(song);
        $scope.audioObject.play()  
        $scope.currentSong = song
      }
    }
  })

  // Add tool tips to anything with a title property
  $('body').tooltip({
      selector: '[title]'
  });
// })

});
