'use strict';

var app = angular.module("smashingStations", []);

app.service('bracketService', function($http) {
  this.getBracket = function(id) {
    return $http.get('/brackets/' + id);
  }
});

app.controller('bracketController', ['$scope', 'bracketService', function($scope, bracketService) {
  var sets = function(setups, queuedSets, startedSets) {
    return setups.map(function(setup) {
      setup.queuedSets = queuedSets.filter(function(set){
        return set.stationId === setup.id;
      });
      setup.startedSets = startedSets.filter(function(set){
        return set.stationId === setup.id;
      });
      return setup;
    });
  };

  $scope.playerName = function(id) {
    var entrant = $scope.entrants.find(function(entrant) { return entrant.id === id; });
    return entrant ? entrant.name : 'bye';
  };

  $scope.$watch('bracketID', function () {
    bracketService.getBracket($scope.bracketID).then(function(response){
      var entities = response.data.entities;
      var queuedSets = entities.sets.filter(function(set) {
        return set.state === 1;
      });
      var startedSets = entities.sets.filter(function(set) {
        return set.state === 2;
      });
      var streams = entities.stream;
      var stations = entities.station;

      $scope.entrants = entities.entrants;
      $scope.streams = sets(streams, queuedSets, startedSets);
      $scope.stations = sets(stations, queuedSets, startedSets);
    });
  });
}]);
