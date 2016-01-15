(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

      return formlyConfigProvider.setType({

        name: 'cmeasyMeta',
        templateUrl: 'components/formly-meta/formlyTemplates/cmeasyMeta.html',
        defaultOptions: {},
        controller: ['$scope', '$log', '$timeout', '$http', '$q', 'Toast', controller]
      });

      /**
       *
       */
      function controller($scope, $log, $timeout, $http, $q, Toast){

        return init();

        /**
         *
         */
        function init(){
          $scope.removeField = removeField;

          $scope.metaFields = getMetaFields();
        }

        /**
         *
         */
        function removeField($event){
          $log.debug('Removing field @ index', getIndex());

          var undoClone = _.cloneDeep(getMetaFieldsParentModel()[getIndex()]);

          $log.debug('undoClone', undoClone);
          Toast.undoToast()
            .then(function(response){
              if(response === 'ok'){
                getMetaFieldsParentModel().push(undoClone);
              }
            });

          getMetaFieldsParentModel().splice(getIndex(), 1);
        }

        /**
         *
         * @returns {*}
         */
        function getIndex(){
          return $scope.$parent.$parent.$parent.$parent.$index;
        }

        /**
         *
         * @returns {*|$scope.metaFields}
         */
        function getMetaFieldsParentModel(){
          return $scope.$parent.$parent.$parent.$parent.$parent.metaFields;
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
              type: 'row',
              templateOptions: {
                fields: [
                  {
                    key: 'definitionKey',
                    type: 'mdInput',
                    templateOptions: {
                      label: 'Key',
                      require: true
                    }
                  },
                  {
                    key: 'type',
                    type: 'mdSelect',
                    templateOptions: {
                      label: 'Type',
                      //TODO get types from server
                      selectOptions: ['String', 'Select']
                    }
                  },
                  //Only used to show/hide additional field details
                  {
                    key: 'displayOptions',
                    type: 'mdCheckbox',
                    templateOptions: {
                      label: 'Display Options'
                    }
                  },
                ]
              }
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
         *
         * @returns {Array}
         */
        function getSelectMetaFields(){
          const hideExpression = '! model.displayOptions || model.type !== "Select"';
          return [
            //{
            //  //TODO validate that it is one of the listed enums
            //  key: 'default',
            //  type: 'mdInput',
            //  templateOptions: {
            //    label: 'Default Select Value'
            //  },
            //  hideExpression: hideExpression
            //},
            //{
            //  key: 'defaultOptions',
            //  type: 'mdSelect',
            //  templateOptions: {
            //    label: 'Default Select Value',
            //    selectOptions: 'model.enum'
            //  },
            //  hideExpression: hideExpression
            //},
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
