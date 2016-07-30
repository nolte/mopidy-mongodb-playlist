angular.module('api', [
    'controllers'
]);
angular.module('controllers', ['mgcrea.ngStrap'])
    .controller('MainCtrl', function ($scope) {
        window.mopidy = new Mopidy({callingConvention: "by-position-or-by-name"});
        console.log('from inside the log method rock on' );
        $scope.methods_toc = {}
        mopidy.on("state:online", function () {
        	  mopidy._send({method: "core.playlists.as_list" }).then(function (data) {
                  window.a = data;
                  $scope.$apply(function () {
	                  $scope.playlists = data;
	                  data.forEach(function (playlist) {
	                	  if(playlist.uri.toLowerCase().startsWith('mongod'))
	                	  {
	                		  console.log('element: ' + JSON.stringify(playlist) );  
	                	  }
	                  });
                  });
                  
              });
        });
    }).filter('htmlify', ['$sce', function ($sce) {
        return function (input) {
            if (!input) {
                return '';
            }
            return $sce.trustAsHtml(input);
        };
    }]);
var ws = new WebSocket("ws://" + document.location.host + "/mopidy/ws/");
ws.onmessage = function (message) {
    var console = document.getElementById('ws-console');
    var newLine = (new Date()).toLocaleTimeString() + ": " +
        message.data + "\n";
    console.innerHTML = newLine + console.innerHTML;
};