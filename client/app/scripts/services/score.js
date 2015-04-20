'use strict';

angular.module('crescendoApp')
.service('ScoreService', ['$http', function ($http) {

  this.getScores  = function () {
    return $http.get('/api/scores');
  };

  this.postScore = function (userId, score) {
    return $http.post('/api/scores', 
            { score: { userId: userId,
                       points:  score } }
    );
  };
}]);