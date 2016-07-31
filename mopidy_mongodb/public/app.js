'use strict';

angular
		.module('playlist-manager', ['angularValidator', 'ngAnimate', 'ngRoute','playlist-manager.mopidy' ])
		.config(function($routeProvider) {
			$routeProvider.when('/', {
				templateUrl : 'tracklist.html'
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
		}).controller('AppCtrl', ['$scope','$log','mopidyservice',function($scope, $log,mopidyservice) {
			 mopidyservice.start();
			$log.debug('AppCtrl');
		}])
		 .controller('PlaylistsCtrl', ['$scope','$location','$log','$route','mopidyservice',function($scope, $location,$log,$route,mopidyservice) {
			 mopidyservice.getPlaylists().then(function(playlists) {
						$scope.playlists = playlists;
			 });
			 
			 $scope.deletePlaylist = function(playlist) {
					$log.debug('delete:',playlist);
					 mopidyservice.deletePlaylist(playlist.uri).then(function(data) {
						 $log.debug('removed:',data);
					 });
			 }
		}]).controller('CreateCtrl', ['$scope','$location','$log','$route','mopidyservice',function($scope, $location,$log,$route,mopidyservice) {
			$scope.create = function(playlist) {
//				playlistService.createPlaylist(playlist,function(data){
//					 $route.reload();
//				})
			};
		}]).controller('CurrentTracklistCtrl', ['$scope','$log','$route','mopidyservice',function($scope, $log,$route,mopidyservice) {
			mopidyservice.getCurrentTrackList().then(function(data) {
				$log.debug('Rock Die Bohne',data);
				$scope.tracks = data;
			})
			$log.debug('load trackist');
		}]).controller('playlistFromTracklistCtrl', ['$scope','$log','$route','mopidyservice',function($scope, $log,$route,mopidyservice) {
			
			$scope.playlist = { uri_scheme: "mongodb" };
			$log.debug('playlistFromTracklistCtrl');
			$scope.create = function(playlist) {
				mopidyservice.createPlaylist(playlist.name,playlist.uri_scheme).then(function(data) {
					mopidyservice.getCurrentTrackList().then(function(currentTracklist) {
						$log.debug('Rock Die Bohne',currentTracklist);
						data.tracks = currentTracklist;
						mopidyservice.savePlaylist(data).then(function(saved) {
							$log.debug('Plaaylist saved 111',saved);
						});
					})
					$log.debug('Plaaylist saved xxxx',data);
				})
				$log.debug('create from tracklist',$scope.tracks);
			};
			
		}]);

//var ws = new WebSocket("ws://" + document.location.host + "/mopidy/ws/");
//ws.onmessage = function (message) {
//     var console = document.getElementById('ws-console');
//	 var newLine = (new Date()).toLocaleTimeString() + ": " +
//	   message.data + "\n";
//	 console.innerHTML = newLine + console.innerHTML;
//};
