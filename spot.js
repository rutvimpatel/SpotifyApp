// Rutvi Patel
// Spotify Challenge
// Due: 11/10/15
// JavaScript file for the spotify Challenge

(function() {

  var data;
  var baseUrl = 'https://api.spotify.com/v1/search?type=track&query='
  // Creates a firebase application
  var myApp = angular.module('myApp', ['firebase']);

  // This creates a controller for the app with Parameters that will allow requests to be made,
  // and will allow the page to get songs, and authenticate users
  myApp.controller('myCtrl', function($scope, $firebaseAuth, $firebaseObject, $http, $location){

    var ref = new Firebase('https://343spotapp.firebaseio.com/');

    var usersRef = ref.child("users");

    // firebaseObject of users
    $scope.users = $firebaseObject(usersRef);
    $scope.authObj = $firebaseAuth(ref);

    // Test if already logged in
    var authData = $scope.authObj.$getAuth();
    if (authData) {
      $scope.userID = authData.uid;
    } 

    // SignUp function
    $scope.signUp = function() {
      // Create user
      $scope.authObj.$createUser({
        email: $scope.newEmail,
        password: $scope.newPass,      
      })

      // Once the user is created, call the logIn function
      .then($scope.newlogIn)

      // Once logged in, set and save the user data
      .then(function(authData) {
        $scope.userID = authData.uid;
        $scope.users[authData.uid] ={
          username : $scope.newName, 
          // userImage:$scope.userImage,
        }
        $scope.users.$save()
        
        // This will redirect to spot.html once the user is logged in
        if ($scope.userID) {
          var location = window.location.href; 
          window.location.assign(location + "spot.html");
        }
      })

      // Catch any errors
      .catch(function(error) {
        console.error("Error: ", error);
      });
    }

    // SignIn function
    $scope.signIn = function() {
      $scope.logIn().then(function(authData){
        $scope.userID = authData.uid;
      })
        // This will redirect to spot.html once the user is logged in
        if ($scope.userID) {
          var location = window.location.href; 
          window.location.assign(location + "spot.html");
        }
    }

    // This will log in existing users
    $scope.logIn = function() {
      console.log('log in');
      return $scope.authObj.$authWithPassword({
        email: $scope.user,
        password: $scope.pass
      })
    }

    // LogIn function for new users
    $scope.newlogIn = function() {
      console.log('new log in')
      return $scope.authObj.$authWithPassword({
        email: $scope.newEmail,
        password: $scope.newPass
      })
    }

    // LogOut function
    $scope.logOut = function() {
      $scope.authObj.$unauth();
      $scope.userID = false;
      // This will redirect to the login page
      window.location.assign("http://students.washington.edu/rutvi/info343/SpotifyApp/");
    }

    // This creates an object for the songs that the html page can reference
    $scope.audioObject = {}
    $scope.getSongs = function() {
      // This fills the tracks array when the call to get songs is succussful
      $http.get(baseUrl + $scope.track).success(function(response){
        data = $scope.tracks = response.tracks.items       
      })
    }

    // This function takes in information about the individual tracks based on 
    // each track that is printed from the array tracks in the html, and stores
    // it so that it will be available in other parts of the page
    $scope.play = function(song, aName, url) {
      $scope.didClick = true;
      $scope.imageLoc = "" + url;
      $scope.aName = aName;
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
})();