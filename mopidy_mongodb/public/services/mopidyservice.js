/**
 * base on: https://raw.githubusercontent.com/martijnboland/moped/48ce8201886c32fd9669612e7c7cd6bbfb1c6978/src/app/services/mopidyservice.js
 */

angular.module('playlist-manager.mopidy', [])
  .factory('mopidyservice', function($q, $rootScope) {

    // Wraps calls to mopidy api and converts mopidy's promise to Angular $q promise.
    // Mopidy method calls are passed as a string because some methods are not
    // available yet when this method is called, due to the introspection.
    // See also http://blog.mbfisher.com/2013/06/mopidy-websockets-and-introspective-apis.html
    function wrapMopidyFunc(functionNameToWrap, thisObj) {
      return function() {
        var deferred = $q.defer();
        var args = Array.prototype.slice.call(arguments);
        var self = thisObj || this;

        $rootScope.$broadcast('moped:mopidycalling', { name: functionNameToWrap, args: args });

        if (self.isConnected) {
          executeFunctionByName(functionNameToWrap, self, args).then(function(data) {
            deferred.resolve(data);
            $rootScope.$broadcast('moped:mopidycalled', { name: functionNameToWrap, args: args });
          }, function(err) {
            deferred.reject(err);
            $rootScope.$broadcast('moped:mopidyerror', { name: functionNameToWrap, args: args, err: err });
          });
        }
        else
        {
          self.mopidy.on("state:online", function() {
            executeFunctionByName(functionNameToWrap, self, args).then(function(data) {
              deferred.resolve(data);
              $rootScope.$broadcast('moped:mopidycalled', { name: functionNameToWrap, args: args });
            }, function(err) {
              deferred.reject(err);
              $rootScope.$broadcast('moped:mopidyerror', { name: functionNameToWrap, args: args, err: err });
            });
          });
        }
        return deferred.promise;
      };
    }

    function executeFunctionByName(functionName, context, args) {
      var namespaces = functionName.split(".");
      var func = namespaces.pop();
      for(var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
      }
      return context[func].apply(context, args);
    }

    return {
      mopidy: {},
      isConnected: false,
      currentTlTracks: [],
      start: function() {
        var self = this;
        $rootScope.$broadcast('playlist-manager:mopidystarting');

        if (window.localStorage && localStorage['playlist-manager.mopidyUrl']) {
          this.mopidy = new Mopidy({
            webSocketUrl: localStorage['playlist-manager.mopidyUrl'],
            callingConvention: 'by-position-or-by-name'
          });
        }
        else {
          this.mopidy = new Mopidy({
            callingConvention: 'by-position-or-by-name'
          });
        }
//        this.mopidy.on(consoleLog);
        // Convert Mopidy events to Angular events
        this.mopidy.on(function(ev, args) {
          $rootScope.$broadcast('playlist-manager:' + ev, args);
          if (ev === 'state:online') {
            self.isConnected = true;
          }
          if (ev === 'state:offline') {
            self.isConnected = false;
          }
        });

        $rootScope.$broadcast('playlist-manager:mopidystarted');
      },
      stop: function() {
        $rootScope.$broadcast('playlist-manager:mopidystopping');
        this.mopidy.close();
        this.mopidy.off();
        this.mopidy = null;
        $rootScope.$broadcast('playlist-manager:mopidystopped');
      },
      restart: function() {
        this.stop();
        this.start();
      },
      getPlaylists: function() {
        return wrapMopidyFunc("mopidy.playlists.asList", this)();
      },
      getPlaylist: function(uri) {
        return wrapMopidyFunc("mopidy.playlists.lookup", this)({ uri: uri });
      },
      getLibrary: function() {
        return wrapMopidyFunc("mopidy.library.browse", this)({ uri: null });
      },
      getCurrentTrack: function() {
        return wrapMopidyFunc("mopidy.playback.getCurrentTrack", this)();
      },
      getCurrentTrackList: function () {
        return wrapMopidyFunc("mopidy.tracklist.getTracks", this)();
      },
      savePlaylist: function (playlist) {
        return wrapMopidyFunc("mopidy.playlists.save", this)({ playlist : playlist });
      },
      deletePlaylist: function (uri) {
          return wrapMopidyFunc("mopidy.playlists.delete", this)({ uri: uri });
      },
      createPlaylist: function (name, uri_scheme) {
        return wrapMopidyFunc("mopidy.playlists.create", this)({ name: name, uri_scheme: uri_scheme });
      }
    };
  });