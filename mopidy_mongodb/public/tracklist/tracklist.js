angular.module('playlist-manager.tracklist', []).controller('CurrentTracklistCtrl',
		[ '$scope', '$log', '$route', 'mopidyservice', function($scope, $log, $route, mopidyservice) {
			mopidyservice.getCurrentTrackList().then(function(data) {
				$scope.tracks = data;
			})
		} ]);