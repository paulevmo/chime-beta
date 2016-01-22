angular.module("userApp",["ngAnimate","app.routes","authService","mainCtrl","userCtrl","chimeCtrl","interestedUserCtrl","userService","chimeService","interestedUserService","ui.bootstrap"]).config(["$httpProvider",function(e){e.interceptors.push("AuthInterceptor")}]),angular.module("app.routes",["ngRoute"]).config(["$routeProvider","$locationProvider",function(e,t){e.when("/",{templateUrl:"app/views/pages/home.html",controller:"mainController",controllerAs:"main"}).when("/login",{templateUrl:"app/views/pages/login.html",controller:"mainController",controllerAs:"login"}).when("/users",{templateUrl:"app/views/pages/users/all.html",controller:"userController",controllerAs:"user"}).when("/users/create",{templateUrl:"app/views/pages/users/single.html",controller:"userCreateController",controllerAs:"user"}).when("/users/:user_id",{templateUrl:"app/views/pages/users/single.html",controller:"userEditController",controllerAs:"user"}).when("/chimes",{templateUrl:"app/views/pages/chimes/all.html",controller:"chimeController",controllerAs:"chime"}).when("/chimes/create",{templateUrl:"app/views/pages/chimes/single.html",controller:"chimeCreateController",controllerAs:"chime"}).when("/chimes/:chime_id",{templateUrl:"app/views/pages/chimes/single.html",controller:"chimeEditController",controllerAs:"chime"}).when("/interested_users",{templateUrl:"app/views/pages/interested_users/all.html",controller:"interestedUserController",controllerAs:"interestedUser"}).when("/interested_users/create",{templateUrl:"app/views/pages/interested_users/single.html",controller:"interestedUserCreateController",controllerAs:"interestedUser"}).when("/interested_users/:interested_user_id",{templateUrl:"app/views/pages/interested_users/single.html",controller:"interestedUserEditController",controllerAs:"interestedUser"}),t.html5Mode(!0)}]),angular.module("chimeCtrl",["chimeService","soundCloudService"]).controller("chimeController",["Chime",function(e){var t=this;t.processing=!0,e.all().success(function(e){t.processing=!1,t.chimes=e}),t.deleteChime=function(r){t.processing=!0,e["delete"](r).success(function(r){e.all().success(function(e){t.processing=!1,t.chimes=e})})}}]).controller("chimeCreateController",["Chime","SoundCloud","$scope",function(e,t,r){var n=this;n.type="create",n.soundCloud={},n.musicProviders=[{name:"SoundCloud",icon:"fa-soundcloud"},{name:"Spotify",icon:"fa-spotify"},{name:"Google Play",icon:"fa-play"},{name:"Apple Music",icon:"fa-apple"},{name:"YouTube",icon:"fa-youtube-play"}],n.currentMusicProvider=n.musicProviders[0],r.filterByName=function(e){return function(t){return t.name!=e}},n.setMusicProvider=function(e){n.currentMusicProvider=e},n.authenticateSoundCloud=function(){t.authenticate()},n.getTrack=function(e){t.getTrack(e).then(function(e){n.soundCloud.track=e,console.log(n.soundCloud),r.$apply()},function(e){console.log("Track with that id does not exist: "),console.log(e)})},n.searchTracks=function(e){t.searchTracks(e).then(function(e){console.log(e),n.soundCloud.tracks=e,r.$apply()},function(e){console.log("No tracks found matching that search term!"),console.log(e)})},n.saveChime=function(){n.processing=!0,n.message="",e.create(n.chimeData).success(function(e){n.processing=!1,n.chimeData={},n.message=e.message})}}]).controller("chimeEditController",["$routeParams","Chime",function(e,t){var r=this;r.type="update",t.get(e.chime_id).success(function(e){r.chimeData=e}),r.saveChime=function(){r.processing=!0,r.message="",t.update(e.chime_id,r.chimeData).success(function(e){r.processing=!1,r.chimeData={},r.message=e.message})}}]),angular.module("interestedUserCtrl",["interestedUserService"]).controller("interestedUserController",["InterestedUser",function(e){var t=this;t.processing=!0,e.all().success(function(e){t.processing=!1,t.interestedUsers=e}),t.deleteInterestedUser=function(r){t.processing=!0,e["delete"](r).success(function(r){e.all().success(function(e){t.processing=!1,t.interestedUsers=e})})}}]).controller("interestedUserCreateController",["InterestedUser",function(e){var t=this;t.type="create",t.saveInterestedUser=function(){t.processing=!0,t.message="",e.create(t.interestedUserData).success(function(e){t.processing=!1,t.interestedUserData={},t.message=e.message})}}]).controller("interestedUserEditController",["$routeParams","InterestedUser",function(e,t){var r=this;r.type="update",t.get(e.interested_user_id).success(function(e){r.interestedUserData=e}),r.saveInterestedUser=function(){r.processing=!0,r.message="",t.update(e.interested_user_id,r.interestedUserData).success(function(e){r.processing=!1,r.interestedUserData={},r.message=e.message})}}]),angular.module("mainCtrl",[]).controller("mainController",["$rootScope","$location","Auth","InterestedUser",function(e,t,r,n){var s=this;s.loggedIn=r.isLoggedIn(),e.$on("$routeChangeStart",function(){s.loggedIn=r.isLoggedIn(),r.getUser().then(function(e){s.user=e.data})}),s.doLogin=function(){s.processing=!0,s.error="",r.login(s.loginData.username,s.loginData.password).success(function(e){s.processing=!1,e.success?t.path("/users"):s.error=e.message})},s.doLogout=function(){r.logout(),s.user="",t.path("/login")},s.doSignUp=function(){return console.log("signing up..."),console.log(s.interestedUser),console.log(s.interestedUser.name),n.create(s.interestedUser).success(function(e){console.log("here"),console.log(e),s.interestedUser={}}),s.hideSignUp=!0,!0}}]),angular.module("userCtrl",["userService"]).controller("userController",["User",function(e){var t=this;t.processing=!0,e.all().success(function(e){t.processing=!1,t.users=e}),t.deleteUser=function(r){t.processing=!0,e["delete"](r).success(function(r){e.all().success(function(e){t.processing=!1,t.users=e})})}}]).controller("userCreateController",["User",function(e){var t=this;t.type="create",t.saveUser=function(){t.processing=!0,t.message="",e.create(t.userData).success(function(e){t.processing=!1,t.userData={},t.message=e.message})}}]).controller("userEditController",["$routeParams","User",function(e,t){var r=this;r.type="edit",t.get(e.user_id).success(function(e){r.userData=e}),r.saveUser=function(){r.processing=!0,r.message="",t.update(e.user_id,r.userData).success(function(e){r.processing=!1,r.userData={},r.message=e.message})}}]),angular.module("authService",[]).factory("Auth",["$http","$q","AuthToken",function(e,t,r){var n={};return n.login=function(t,n){return e.post("/api/authenticate",{username:t,password:n}).success(function(e){return r.setToken(e.token),e})},n.logout=function(){r.setToken()},n.isLoggedIn=function(){return r.getToken()?!0:!1},n.getUser=function(){return r.getToken()?e.get("/api/me",{cache:!0}):t.reject({message:"User has no token."})},n}]).factory("AuthToken",["$window",function(e){var t={};return t.getToken=function(){return e.localStorage.getItem("token")},t.setToken=function(t){t?e.localStorage.setItem("token",t):e.localStorage.removeItem("token")},t}]).factory("AuthInterceptor",["$q","$location","AuthToken",function(e,t,r){var n={};return n.request=function(e){var t=r.getToken();return t&&(e.headers["x-access-token"]=t),e},n.responseError=function(n){return 403==n.status&&(r.setToken(),t.path("/login")),e.reject(n)},n}]),angular.module("chimeService",[]).factory("Chime",["$http",function(e){var t={};return t.get=function(t){return e.get("/api/chimes/"+t)},t.all=function(){return e.get("/api/chimes/")},t.create=function(t){return e.post("/api/chimes/",t)},t.update=function(t,r){return e.put("/api/chimes/"+t,r)},t["delete"]=function(t){return e["delete"]("/api/chimes/"+t)},t}]),angular.module("interestedUserService",[]).factory("InterestedUser",["$http",function(e){var t={};return t.get=function(t){return e.get("/api/interested_users/"+t)},t.all=function(){return e.get("/api/interested_users/")},t.create=function(t){return e.post("/public/interested_users/",t)},t.update=function(t,r){return e.put("/api/interested_users/"+t,r)},t["delete"]=function(t){return e["delete"]("/api/interested_users/"+t)},t}]),angular.module("soundCloudService",[]).factory("SoundCloud",["$location",function(e){var t="09552849399f3a58cd8b85d8c5b1218d",r=e.protocol()+"://"+e.host()+":"+e.port(),n={};return SC.initialize({client_id:t,redirect_uri:r+"/callback"}),n.getTrack=function(e){return SC.get("/tracks/"+e)},n.searchTracks=function(e){return SC.get("/tracks",{q:e})},n.authenticate=function(){return SC.connect(function(){SC.get("/me",function(e){alert("Hello, "+e.username)})})},n}]),angular.module("userService",[]).factory("User",["$http",function(e){var t={};return t.get=function(t){return e.get("/api/users/"+t)},t.all=function(){return e.get("/api/users/")},t.create=function(t){return e.post("/api/users/",t)},t.update=function(t,r){return e.put("/api/users/"+t,r)},t["delete"]=function(t){return e["delete"]("/api/users/"+t)},t}]);