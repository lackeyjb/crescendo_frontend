"use strict";angular.module("crescendoApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ui.router","ngSanitize","ngTouch"]).config(["$httpProvider","$stateProvider","$urlRouterProvider",function(a,b,c){a.defaults.withCredentials=!0,b.state("home",{url:"/",templateUrl:"views/main.html",controller:"MainCtrl"}).state("about",{url:"/about",templateUrl:"views/about.html",controller:"AboutCtrl"}).state("game1",{url:"/game1",templateUrl:"views/game1.html",controller:"Game1Ctrl",onEnter:["$state","AuthService",function(a,b){b.isAuthenticated()||a.go("home")}]}).state("login",{url:"/login",templateUrl:"views/login.html",controller:"AuthCtrl"}).state("register",{url:"/register",templateUrl:"views/register.html",controller:"AuthCtrl"}),c.otherwise("/")}]),angular.module("crescendoApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("crescendoApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("crescendoApp").controller("AuthCtrl",["$scope","$rootScope","AuthService",function(a,b,c){a.register=function(){c.register(a.user).success(function(a){b.$emit("auth:new-registration",a)}).error(function(){alert("Something went wrong, please try again.")})},a.login=function(){c.login(a.session).success(function(a){b.$emit("auth:login",a)}).error(function(){alert("Something went wrong, please try again."),a.session={}})}}]),angular.module("crescendoApp").controller("NavCtrl",["$scope","$rootScope","$state","$browser","AuthService",function(a,b,c,d,e){a.tabs=[{state:"home",label:"home",active:!0,isPublic:!0},{state:"about",label:"about",active:!0,isPublic:!0}],a.getTabClass=function(a){return a.active?"active":""},a.$on("$stateChangeSuccess",function(){a.tabs.forEach(function(a){a.active=c.is(a.state)})}),a.isAuthenticated=function(){return!!a.user},a.showTab=function(b){return b.isPublic||a.isAuthenticated()},e.getSession().success(function(b){a.user=b}),a.logout=function(){e.logout().success(function(){b.$emit("auth:logout")})},b.$on("auth:new-registration",function(b,d){a.user=d,c.go("home")}),b.$on("auth:login",function(b,d){a.user=d,c.go("home")}),b.$on("auth:logout",function(){a.user=null,c.go("home")})}]),angular.module("crescendoApp").controller("Game1Ctrl",[function(){var a=new Phaser.Game(640,480,Phaser.AUTO,"gameview"),b=function(){this.player=null,this.platforms=null,this.sky=null,this.facing="left",this.edgeTimer=0,this.jumpTimer=0,this.wasStanding=!1,this.cursors=null};b.prototype={init:function(){this.game.renderer.renderSession.roundPixels=!0,this.world.resize(640,2e3),this.physics.startSystem(Phaser.Physics.ARCADE),this.physics.arcade.gravity.y=750,this.physics.arcade.skipQuadtree=!1},preload:function(){this.load.image("trees","images/trees.png"),this.load.image("clouds","images/clouds.png"),this.load.image("platform","images/moving_platform.png"),this.load.image("ice-platform","images/ice-platform.png"),this.load.spritesheet("dude","images/crescendodude.png",49.6,68)},create:function(){this.stage.backgroundColor="#2f9acc",this.sky=this.add.tileSprite(0,0,640,480,"clouds"),this.sky.fixedToCamera=!0,this.add.sprite(0,1906,"trees"),this.platforms=this.add.physicsGroup();for(var a=0,b=64,c=0;19>c;c++){var d=c%2===1?"platform":"ice-platform",e=this.platforms.create(a,b,d);e.body.velocity.x=this.rnd.between(100,150),Math.random()>.5&&(e.body.velocity.x*=-1),a+=200,a>=600&&(a=0),b+=104}this.platforms.setAll("body.allowGravity",!1),this.platforms.setAll("body.immovable",!0),this.player=this.add.sprite(320,1952,"dude"),this.physics.arcade.enable(this.player),this.player.body.collideWorldBounds=!0,this.player.body.setSize(45,52,0,16),this.player.animations.add("left",[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],30,!0),this.player.animations.add("right",[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],30,!0),this.camera.follow(this.player),this.cursors=this.input.keyboard.createCursorKeys()},wrapPlatform:function(a){a.body.velocity.x<0&&a.x<=-160?a.x=640:a.body.velocity.x>0&&a.x>=640&&(a.x=-160)},setFriction:function(a,b){"ice-platform"===b.key&&(a.body.x-=b.body.x-b.body.prev.x)},update:function(){this.sky.tilePosition.y=-(.7*this.camera.y),this.platforms.forEach(this.wrapPlatform,this),this.physics.arcade.collide(this.player,this.platforms,this.setFriction,null,this);var a=this.player.body.blocked.down||this.player.body.touching.down;this.player.body.velocity.x=0,this.cursors.left.isDown?(this.player.body.velocity.x=-200,"left"!==this.facing&&(this.player.anchor.setTo(.5,0),this.player.scale.x=-1,this.player.play("left"),this.facing="left")):this.cursors.right.isDown?(this.player.body.velocity.x=200,"right"!==this.facing&&(this.player.scale.x=1,this.player.play("right"),this.facing="right")):"idle"!==this.facing&&(this.player.animations.stop(),this.player.frame="left"===this.facing?0:5,this.facing="idle"),!a&&this.wasStanding&&(this.edgeTimer=this.time.time+250),(a||this.time.time<=this.edgeTimer)&&this.cursors.up.isDown&&this.time.time>this.jumpTimer&&(this.player.body.velocity.y=-500,this.jumpTimer=this.time.time+750),this.wasStanding=a}},a.state.add("Game",b,!0)}]),angular.module("crescendoApp").service("AuthService",["$http",function(a){var b=this;b.currentUser=null,b.isAuthenticated=function(){return!!b.currentUser},b.getSession=function(){var c=a.get("/api/sessions/");return c.success(function(a){console.log("getSession returned user = "+JSON.stringify(a)),b.currentUser=a}),c},b.getSession(),b.register=function(c){var d=a.post("/api/users/",{user:c});return d.success(function(a){b.currentUser=a}),d},b.login=function(c){var d=a.post("/api/sessions/",{session:c});return d.success(function(a){b.currentUser=a}),d},b.logout=function(){var c=a["delete"]("/api/sessions/");return c.success(function(){b.currentUser=null}),c}}]);