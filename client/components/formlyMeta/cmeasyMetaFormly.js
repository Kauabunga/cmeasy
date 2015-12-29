(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

      return formlyConfigProvider.setType({

        name: 'cmeasyMeta',
        templateUrl: 'components/formlyMeta/formlyTemplates/cmeasyMeta.html',
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
        }

        /**
         *
         */
        function getMetaFields(){
          return getBaseMetaFields()
            .concat(getStringMetaFields())
            .concat(getSelectMetaFields());
        }

        /**
         *
         */
        function getBaseMetaFields(){
          return [
            {
              key: 'definitionKey',
              type: 'mdInput',
              templateOptions: {
                label: 'Key'
              }
            },
            {
              key: 'displayOptions',
              type: 'mdCheckbox',
              templateOptions: {
                label: 'Display Options'
              }
            },
            {
              key: 'type',
              type: 'mdSelect',
              templateOptions: {
                label: 'Type',
                selectOptions: ['String', 'Select']
              },
              hideExpression: '! model.displayOptions'
            },
            {
              key: 'label',
              type: 'mdInput',
              templateOptions: {
                label: 'Label'
              },
              hideExpression: '! model.displayOptions'
            }
          ];
        }

        /**
         *
         */
        function getStringMetaFields(){
          const hideExpression = '! model.displayOptions || model.type !== "String"';
          return [
            {
              key: 'default',
              type: 'mdInput',
              templateOptions: {
                label: 'Default String Value'
              },
              hideExpression: hideExpression
            }
          ];
        }

        /**
         * TODO return extra props when type === 'Select'
         *
         * @returns {Array}
         */
        function getSelectMetaFields(){
          const hideExpression = '! model.displayOptions || model.type !== "Select"';
          return [
            {
              //TODO validate that it is one of the listed enums
              key: 'default',
              type: 'mdInput',
              templateOptions: {
                label: 'Default Select Value'
              },
              hideExpression: hideExpression
            },
            {
              key: 'enum',
              type: 'adminRepeat',
              templateOptions: {
                label: 'Enum Options',
                fields: [{ type: 'mdInput' }]
              },
              hideExpression: hideExpression
            }
          ];
        }

      }

    });


})(angular);
