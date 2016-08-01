angular.module('playlist-manager.playlist', []).controller(
		'PlaylistsCtrl',
		[ '$scope', '$location', '$log', '$route', 'mopidyservice',
				function($scope, $location, $log, $route, mopidyservice) {
					mopidyservice.getPlaylists().then(function(playlists) {
						$scope.playlists = playlists;
					});

					$scope.deletePlaylist = function(playlist) {
						$log.debug('delete:', playlist);
						mopidyservice.deletePlaylist(playlist.uri).then(function(data) {
							$log.debug('removed:', data);
							$route.reload();
						});
					}
				} ]).controller(
		'playlistFromTracklistCtrl',
		[ '$scope', '$log', '$route', '$location', 'mopidyservice',
				function($scope, $log, $route, $location, mopidyservice) {
					$log.debug('playlistFromTracklistCtrl');
					$scope.create = function(playlist) {
						mopidyservice.createPlaylist(playlist.name, "mongodb").then(function(data) {
							mopidyservice.getCurrentTrackList().then(function(currentTracklist) {
								$log.debug('current tracklist to save: ', currentTracklist);
								data.tracks = currentTracklist;
								$log.debug('try to save tracklist: ', data);
								mopidyservice.savePlaylist(data).then(function(savedPlaylist) {
									$log.debug('Plaaylist saved 111', savedPlaylist);
									$route.reload();
								});
							})
						})
						$log.debug('create from tracklist', $scope.tracks);
					};

				} ])