(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

      formlyConfigProvider.setType({
        name: 'mdChipsAutocomplete',
        templateUrl: 'components/formly/formlyTemplates/mdChipsAutocomplete.html',
        controller: ['$scope', '$log', '$timeout', '$http', '$q', function($scope, $log, $timeout, $http, $q) {

          return init();

          /**
           *
           */
          function init(){
            $scope.id = $scope.options.key;
            $scope.querySearch = querySearch;
            $scope.model = $scope.model || {};
            $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
            $q.all(getCompleteModelsFromId())
              .then(function(){});
          }

          /**
           *
           */
          function getCompleteModelsFromId(){
            return _.map($scope.model[$scope.options.key], function(chipItem, index){
              return querySearch(chipItem[$scope.to.autocompleteId]).then(function(autocompletes){

                var completeAutocompleteModel = _(autocompletes).filter(function(autocomplete){
                  return autocomplete[$scope.to.autocompleteId] === chipItem[$scope.to.autocompleteId];
                }).first();

                _.merge($scope.model[$scope.options.key][index], completeAutocompleteModel);
              });
            });
          }

          /**
           *
           * @param searchText
           * @returns {*}
           */
          function querySearch(searchText){

            if( ! searchText ){ return []; }

            return $http.get('/api/v1/' + $scope.to.autocompleteType + '/autocomplete/' + searchText)
              .then(function(response){
                return response.data;
              })
              .catch(function(err){
                 $log.debug('Error getting autocomplete', err);
              });
          }

        }]
      });


    });


})(angular);
