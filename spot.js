(function() {


  var data;
  var baseUrl = 'https://api.spotify.com/v1/search?type=track&query='
  // Create application with dependency 'firebase'
  var myApp = angular.module('myApp', ['firebase']);

  // Bind controller, passing in $scope, $firebaseAuth, $firebaseArray, $firebaseObject
  myApp.controller('myCtrl', function($scope, $firebaseAuth, $firebaseObject, $http, $location){
    
    // Create a variable 'ref' to reference your firebase storage
    var ref = new Firebase('https://343spotapp.firebaseio.com/');

      var usersRef = ref.child("users");

      // Create a firebaseObject of your users, and store this as part of $scope
      $scope.users = $firebaseObject(usersRef);

    // Create authorization object that referes to firebase
    $scope.authObj = $firebaseAuth(ref);

    // Test if already logged in
    var authData = $scope.authObj.$getAuth();
    if (authData) {
      $scope.userID = authData.uid;
    } 
    console.log(authData);
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
        if ($scope.userID) {
          var location = window.location.href; 
          window.location.assign(location + "spot.html");
        }
    }

    $scope.logIn = function() {
      console.log('log in');
      return $scope.authObj.$authWithPassword({
        email: $scope.user,
        password: $scope.pass
      })
    }

    // LogIn function
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
      window.location.assign("http://students.washington.edu/rutvi/info343/SpotifyApp/");
      // document.body.innerHTML = "";
      // var signInAgain = document.createElement('h3');
      // signInAgain.innerHTML = "Sign in again on the main page to access";
      // document.body.appendChild(signInAgain);

    }

  


    console.log('entered');
    $scope.audioObject = {}
    $scope.getSongs = function() {
      $http.get(baseUrl + $scope.track).success(function(response){
        data = $scope.tracks = response.tracks.items
        
      })
    }
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