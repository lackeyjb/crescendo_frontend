'use strict';

angular.module('crescendoApp')
.service('ScoreService', [ '$http', function ($http) {

  this.postScore = function (userId, score) {
    console.log('postScore of: ' + JSON.stringify(score));

    return $http.post('/api/scores', 
            { score: { userId: userId,
                       points:  score
                      }
            }
          );
  };

}]);