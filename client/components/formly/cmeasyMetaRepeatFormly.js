(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

      return formlyConfigProvider.setType({
        //TODO should come from config
        name: 'cmeasyMetaRepeat',
        templateUrl: 'components/formly/formlyTemplates/cmeasyMetaRepeat.html',
        defaultOptions: {},
        controller: ['$scope', '$log', '$timeout', '$http', '$q', controller]
      });

      /**
       *
       */
      function controller($scope, $log, $timeout, $http, $q){

        const DEFINITION_KEY = 'definitionKey';

        return init();

        /**
         *
         */
        function init(){
          $scope.metaFields = getDefinitionAsArray($scope.model.definition);
          $scope.cmeasyMeta = getCmeasyMetaFormlyDefinition();

          //Watch all definitionKey items and update the definition based on changes
          $scope.$watch(getMetaFieldsDefinitionKeys, watchMetaFieldsDefinitionKeys, true);

          //Handle history selections / what ever else the item directive throws this way
          $scope.$watch('model', function(model){ $scope.metaFields = getDefinitionAsArray(model.definition); });

        }

        /**
         *
         * @returns {Array|*}
         */
        function getMetaFieldsDefinitionKeys(){
          return _($scope.metaFields).map((item) => {
            return item[DEFINITION_KEY];
          }).value();
        }

        /**
         *
         * @returns {Array|*}
         */
        function watchMetaFieldsDefinitionKeys(newKeys, prevKeys){
          $scope.model.definition = getDefinitionAsObject($scope.metaFields);
        }

        /**
         *
         * @param definition
         */
        function getDefinitionAsArray(definition){
          return _(definition).map(function (value, key) {
            return _.merge(value, {[DEFINITION_KEY]: key});
          }).filter().value();
        }

        /**
         *
         */
        function getCmeasyMetaFormlyDefinition(){
          return [ { type: 'cmeasyMeta' } ];
        }

        /**
         *
         * @param definition
         */
        function getDefinitionAsObject(definition){
          return _(definition).reduce((result, value, index) => {
            if(index === 1){
              result = {[result[DEFINITION_KEY]]: result};
            }
            return _.merge(result, {[value[DEFINITION_KEY]]: value});
          });
        }

      }

    });


})(angular);
