'use strict';

angular
		.module('playlist-manager', ['angularValidator', 'ngAnimate', 'ngRoute' ])
		.config(function($routeProvider) {
			$routeProvider.when('/', {
				templateUrl : 'articles.html'
			}).when('/about', {
				template : 'Über unsere Pizzeria'
			}).when('/create', {
				templateUrl : 'create.html'
			}).when('/createFromTracklist', {
				templateUrl : 'playlistFromTracklist.html'
			}).when('/tracklist', {
				templateUrl : 'tracklist.html'
			}).otherwise({
				redirectTo : '/'
			});
		}).factory("mopidyCall", function () {
			var callMopidy = function (callbackFn){
				window.mopidy = new Mopidy({callingConvention: "by-position-or-by-name"});
				mopidy.on("state:online", function () {
					callbackFn(mopidy);
			    });
			};
			return {
				callMopidy: callMopidy
		     };
		 }).factory("playlistService", function ($log,mopidyCall) {
			var createPlaylist = function (playlist,callbackFn){
				mopidyCall.callMopidy(function(mopidy){
					mopidy._send({method: "core.playlists.create",jsonrpc: "2.0", params: playlist, id: 1 }).then(function (data) {
			       		callbackFn(data);
			         });
				});
			};
			var savePlaylist = function (playlist,callbackFn){
				mopidyCall.callMopidy(function(mopidy){
					$log.debug("try to save playlist ",playlist)
					mopidy._send({method: "core.playlists.save",jsonrpc: "2.0", params: { playlist : playlist }, id: 1 }).then(function (data) {
			       		callbackFn(data);
			         });
				});
			};			
			return {
				createPlaylist: createPlaylist,
				savePlaylist : savePlaylist
		     };
		 }).factory("currentTracklistService", function (mopidyCall) {
			var getTracks = function (callbackFn){
				mopidyCall.callMopidy(function(mopidy){
			       	  mopidy._send({method: "core.tracklist.get_tracks",jsonrpc: "2.0", id: 1 }).then(function (data) {
			       		callbackFn(data);
			             });
			})};
			return {
				getTracks: getTracks
		     };
		 })
		.directive(
				'price',
				function() {
					return {
						restrict : 'E',
						scope : {
							value : '='
						},
						template : '<span ng-show="value == 0">kostenlos</span>'
								+ '<span ng-show="value > 0">{{value | currency}}</span>'
					}
				}).factory('Cart', function() {
			var items = [];
			return {
				getItems : function() {
					return items;
				},
				addArticle : function(article) {
					items.push(article);
				},
				sum : function() {
					return items.reduce(function(total, article) {
						return total + article.price;
					}, 0);
				}
			};
		}).controller('ArticlesCtrl', function($scope, $http, Cart) {
			$scope.cart = Cart;
			$http.get('articles.json').then(function(articlesResponse) {
				$scope.articles = articlesResponse.data;
			});
		}).controller('CartCtrl', function($scope, Cart) {
			$scope.cart = Cart;
		}).controller('CreateCtrl', ['$scope','$location','$log','$route',function($scope, $location,$log,$route) {
			$scope.create = function(playlist) {
				window.mopidy = new Mopidy({callingConvention: "by-position-or-by-name"});
				$log.debug('create new Playlist', playlist);
		        mopidy.on("state:online", function () {
		        	  mopidy._send({method: "core.playlists.create",jsonrpc: "2.0", params: playlist, id: 1 }).then(function (data) {
		        		  $log.debug('response: ', data);
		        		  // $location.path('/about');
		        		  $route.reload();
		              });
		        });
			};

		}]).controller('CurrentTracklistCtrl', ['$scope','$log','$route',function($scope, $log,$route) {
			window.mopidy = new Mopidy({callingConvention: "by-position-or-by-name"});
			$log.debug('load trackist');
	        mopidy.on("state:online", function () {
	        	  mopidy._send({method: "core.tracklist.get_tracks",jsonrpc: "2.0", id: 1 }).then(function (data) {
	        		  window.a = data;
	        		  $scope.$apply(function () {
	        			  $log.debug('$apply trackist',data);
	        			  $scope.tracks = data;
	        		  });
	        		  // $location.path('/about');
	              });
	        });
		}]).controller('playlistFromTracklistCtrl', ['$scope','$log','$route','currentTracklistService','playlistService',function($scope, $log,$route,currentTracklistService,playlistService) {
			window.mopidy = new Mopidy({callingConvention: "by-position-or-by-name"});
			currentTracklistService.getTracks(function(tracks) {
				    $scope.tracks = tracks;
				  });
			$scope.playlist = { uri_scheme: "mongodb" };
			$log.debug('playlistFromTracklistCtrl');
			$scope.create = function(playlist) {
				playlistService.createPlaylist(playlist,function(data){
					data.tracks = $scope.tracks;
					$log.debug('tracklist saved',data);
					playlistService.savePlaylist(data,function(savedPlaylist){
						$log.debug('playlist saved',savedPlaylist);
					})
					
				})
				$log.debug('create from tracklist',$scope.tracks);
			};
			
		}]);

var ws = new WebSocket("ws://" + document.location.host + "/mopidy/ws/");
ws.onmessage = function (message) {
    // var console = document.getElementById('ws-console');
	// var newLine = (new Date()).toLocaleTimeString() + ": " +
	//   message.data + "\n";
	// console.innerHTML = newLine + console.innerHTML;
};
