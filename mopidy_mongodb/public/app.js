'use strict';

angular
		.module('playlist-manager', ['angularValidator', 'ngAnimate', 'ngRoute','playlist-manager.mopidy' ])
		.config(function($routeProvider) {
			$routeProvider.when('/', {
				templateUrl : 'main.html'
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
						 $route.reload();
					 });
			 }
		}]).controller('CurrentTracklistCtrl', ['$scope','$log','$route','mopidyservice',function($scope, $log,$route,mopidyservice) {
			mopidyservice.getCurrentTrackList().then(function(data) {
				$scope.tracks = data;
			})
		}]).controller('playlistFromTracklistCtrl', ['$scope','$log','$route','$location','mopidyservice',function($scope, $log,$route,$location,mopidyservice) {
			$log.debug('playlistFromTracklistCtrl');
			$scope.create = function(playlist) {
				mopidyservice.createPlaylist(playlist.name,"mongodb").then(function(data) {
					mopidyservice.getCurrentTrackList().then(function(currentTracklist) {
						$log.debug('current tracklist to save: ',currentTracklist);
						data.tracks = currentTracklist;
						$log.debug('try to save tracklist: ',data);
						mopidyservice.savePlaylist(data).then(function(savedPlaylist){
							// not working :( ....
							$log.debug('Plaaylist saved 111',savedPlaylist);
							$route.reload();
						});
					})
				})
				$log.debug('create from tracklist',$scope.tracks);
			};
			
		}]);

