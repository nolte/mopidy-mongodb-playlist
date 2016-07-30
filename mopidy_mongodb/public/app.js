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
			}).when('/playlist', {
				templateUrl : 'playlist.html'
			}).otherwise({
				redirectTo : '/'
			});
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

		}]).controller('CurrentPlaylistCtrl', ['$scope','$log','$route',function($scope, $log,$route) {
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
		}]);

var ws = new WebSocket("ws://" + document.location.host + "/mopidy/ws/");
ws.onmessage = function (message) {
    // var console = document.getElementById('ws-console');
	// var newLine = (new Date()).toLocaleTimeString() + ": " +
	//   message.data + "\n";
	// console.innerHTML = newLine + console.innerHTML;
};
