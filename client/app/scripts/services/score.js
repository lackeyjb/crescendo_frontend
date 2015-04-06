'use strict';

angular.module('crescendoApp')
.service('ScoreService', [ '$http', function ($http) {

  this.getScores  = function () {
    console.log($http.get('/api/scores'));
    return $http.get('/api/scores');
  };

  this.postScore = function (userId, score) {
    console.log('postScore of: ' + JSON.stringify(score));

    return $http.post('/api/scores', 
            { score: { userId: userId,
                       points:  score } }
    );
  };

}]);