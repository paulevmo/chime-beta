angular.module('chimeCtrl', ['chimeService', 'soundCloudService'])
  .controller('chimeController', [
    'Chime',
    function(Chime) {
      var vm = this;
      vm.processing = true;

      Chime.all()
        .success(function(data) {
          vm.processing = false;
          vm.chimes = data;
        });

      vm.deleteChime = function(id) {
        vm.processing = true;

        Chime.delete(id)
          .success(function(data) {
            Chime.all()
              .success(function(data) {
                vm.processing = false;
                vm.chimes = data;
              });
          });
      };
    }
  ])

  .controller('chimeCreateController', [
    'Chime',
    'SoundCloud',
    '$scope',
    '$sce',
    function(Chime, SoundCloud, $scope, $sce) {
      var vm = this;
      vm.type = 'create';

      vm.musicProviders = [
        { name: 'SoundCloud', icon: 'fa-soundcloud', value: 'soundCloud' },
        { name: 'Spotify', icon: 'fa-spotify', value: 'spotify' },
        { name: 'Google Play', icon: 'fa-play', value: 'googlePlay' },
        { name: 'Apple Music', icon: 'fa-apple', value: 'appleMusic' },
        { name: 'YouTube', icon: 'fa-youtube-play', value: 'youTube' },
      ];
      vm.currentMusicProvider = vm.musicProviders[0];

      $scope.filterByName = function(name) {
          return function(provider) {
              return provider.name != name;
          };
      };

      vm.setMusicProvider = function(provider) {
        vm.currentMusicProvider = provider;
      };


      vm.setStartTime = function() {
        vm.startTimeSet = true;
        var startTime = +vm.startTime;
        var duration = vm.selectedTrack.duration;
        var width = angular.element(document.getElementById('slider-container'))[0].clientWidth;
        vm.leftOffset = startTime/duration*width;
        vm.widthOffset = width - vm.leftOffset;
      };

      vm.setEndTime = function() {
        vm.endTimeSet = true;
        var startTime = +vm.startTime;
        var endTime = +vm.endTime;
        var duration = vm.selectedTrack.duration;
        var width = angular.element(document.getElementById('slider-container'))[0].clientWidth;
        vm.chimeWidth = (endTime - startTime)*width/duration;
      };

      vm.clearEndTime = function() {
        vm.endTimeSet = false;
        vm.endTime = vm.startTime;
        vm.chimeWidth = 0;
      };

      vm.clearStartTime = function() {
        vm.startTimeSet = false;
        vm.endTimeSet = false;
        vm.startTime = 0;
        vm.endTime = 0;
      };

      vm.playSelection = function() {
        vm.soundCloudWidget = $sce.trustAsHtml('<p>Loading...</p>');
        console.log(vm.startTime);
        console.log(vm.endTime);
        console.log(vm.selectedTrack);
        SoundCloud.playTrackSection(vm.selectedTrack.permalink_url, Math.floor(vm.startTime/1000))
          .then(function(oEmbed) {
            console.log('oEmbed response: ', oEmbed);
            vm.soundCloudWidget = $sce.trustAsHtml(oEmbed.html);
            $scope.$apply();
          });
      };

      vm.playTrack = function(track) {
        SoundCloud.playTrack(track.permalink_url)
          .then(function(oEmbed) {
            console.log('oEmbed response: ', oEmbed);
            vm.streamingTrack = track;
            vm.soundCloudWidget = $sce.trustAsHtml(oEmbed.html);
            $scope.$apply();

            vm.iframe = document.getElementById('soundcloud_widget').querySelector('iframe');
            vm.widget = SoundCloud.getSC().Widget(vm.iframe);
          });
      };

      vm.selectTrack = function(track) {
        if(track !== vm.streamingTrack) { vm.playTrack(track); }
        vm.selectedTrack = track;
        vm.widget.bind('seek', function(info) {
          console.log('Seeking....');
          console.log(info);
        });
      };

      vm.clearSelectedTrack = function() {
        delete vm.selectedTrack;
      };
      // vm.streamingTrackUrl = $sce.trustAsResourceUrl("http://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/39804767&show_artwork=false&liking=false&sharing=false&auto_play=true");
      // vm.showIframe = true;
      // vm.element = document.getElementById('soundcloud_widget');
      // vm.widgetObject = SoundCloud.createWidget(vm.element);
      // console.log("widgetObject: ", vm.widgetObject);
      // vm.widgetObject.widget.bind(vm.widgetObject.events.READY, function() {
      //   console.log('Ready....');
      // });
      // vm.widgetObject.widget.bind(vm.widgetObject.events.SEEK, function(xxx) {
      //   console.log('SEEKING....');
      //   console.log(xxx);
      // });
      // vm.widgetObject.widget.bind(vm.widgetObject.events.PLAY_PROGRESS, function(xxx) {
      //   console.log('PLAY_PROGRESS....');
      //   console.log(xxx);
      // });

      vm.saveChime = function() {
        vm.processing = true;
        vm.message = '';

        Chime.create(vm.chimeData)
          .success(function(data) {
            vm.processing = false;
            vm.chimeData = {};
            vm.message = data.message;
          });
      };
    }
  ])

  .controller('chimeEditController', [
    '$routeParams',
    'Chime',
    function($routeParams, Chime) {
      var vm = this;
      vm.type = 'update';

      Chime.get($routeParams.chime_id)
        .success(function(data) {
          vm.chimeData = data;
        });

      vm.saveChime = function() {
        vm.processing = true;
        vm.message = '';
        Chime.update($routeParams.chime_id, vm.chimeData)
          .success(function(data) {
            vm.processing = false;
            vm.chimeData = {};
            vm.message = data.message;
          });
      };
    }
  ])

  .directive('soundCloudSongSearch', [
    'SoundCloud',
    '$sce',
    function(SoundCloud, $sce) {
      return{
        restrict: 'E',
        scope: {
          chime: '=',
        },
        templateUrl: 'app/views/pages/chimes/soundCloudSongSearch.html',
        link: function(scope, element, attrs) {
          scope.soundCloud = {};
          scope.soundCloudSearchInput = '';

          scope.searchTracks = function(term) {
            SoundCloud.searchTracks(term)
              .then(function(results) {
                console.log('Search results: ', results);
                scope.soundCloud.tracks = results;
                scope.$apply();
              }, function(error) {
                console.log("No tracks found matching that search term: ", error);
              });
          };

          scope.authenticateSoundCloud = function() {
            SoundCloud.authenticate();
          };
        }
      };
    }
  ])

  .directive('spotifySongSearch', [
    '$sce',
    function($sce) {
      return{
        restrict: 'E',
        scope: {
          chime: '=',
        },
        templateUrl: 'app/views/pages/chimes/spotifySongSearch.html',
        link: function(scope, element, attrs) {
          scope.spotify = {};
          scope.spotifySearchInput = '';
        }
      };
    }
  ]);
