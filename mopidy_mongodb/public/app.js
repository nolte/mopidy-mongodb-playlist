'use strict';

angular.module(
		'playlist-manager',
		[ 'angularValidator', 'ngAnimate', 'ngRoute', 'playlist-manager.mopidy', 'playlist-manager.tracklist',
				'playlist-manager.playlist' ]).config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl : 'main.html'
	}).otherwise({
		redirectTo : '/'
	});
}).controller('AppCtrl', [ '$scope', '$log', 'mopidyservice', function($scope, $log, mopidyservice) {
	mopidyservice.start();
	$log.debug('AppCtrl');
} ]);
