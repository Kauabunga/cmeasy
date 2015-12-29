(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

      return formlyConfigProvider.setType({

        name: 'cmeasyMeta',
        templateUrl: 'components/formly/formlyTemplates/cmeasyMeta.html',
        defaultOptions: {},
        controller: ['$scope', '$log', '$timeout', '$http', '$q', controller]
      });

      /**
       *
       */
      function controller($scope, $log, $timeout, $http, $q){

        return init();

        /**
         *
         */
        function init(){
          $log.debug('metaType $scope', $scope);
          $scope.metaFields = getMetaFields();
          //$scope.metaModel = $scope.model;
        }

        /**
         *
         */
        function getMetaFields(){
          return [
            {
              key: 'definitionKey',
              type: 'mdInput',
              templateOptions: {
                label: 'Key'
              }
            },
            {
              key: 'type',
              type: 'mdInput',
              templateOptions: {
                label: 'Type'
              }
            },
            {
              key: 'label',
              type: 'mdInput',
              templateOptions: {
                label: 'Label'
              }
            },
            {
              key: 'default',
              type: 'mdInput',
              templateOptions: {
                label: 'Default'
              }
            }
          ];
        }

      }

    });


})(angular);
