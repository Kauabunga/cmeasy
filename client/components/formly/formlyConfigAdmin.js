(function(angular){

  'use strict';

  //TODO seperate into individual formlyConfigs

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

      formlyConfigProvider.setType({
        name: 'mdSelect',
        templateUrl: 'components/formly/formlyTemplates/mdSelect.html',
        defaultOptions: {}
      });

      formlyConfigProvider.setType({
        name: 'mdInput',
        templateUrl: 'components/formly/formlyTemplates/mdInput.html',
        defaultOptions: {
          ngModelAttrs: {
            mdMaxlength: {
              bound: 'md-maxlength'
            }
          }
        }
      });

      formlyConfigProvider.setType({
        name: 'adminLink',
        templateUrl: 'components/formly/formlyTemplates/adminLink.html',
        controller: ['$scope', '$log', '$state', function($scope, $log, $state){

          return init();

          /**
           *
           */
          function init(){
            $scope.getElementDisplay = getElementDisplay;
            $scope.selectLink = selectLink;
          }

          /**
           *
           */
          function getElementDisplay(element){
            return element[$scope.to.linkId];
          }

          /**
           *
           */
          function selectLink($event, element){
            return $state.go($state.current.name, {
              itemType: $scope.to.linkType,
              itemId: element[$scope.to.linkId]
            });
          }

        }],
        defaultOptions: { }
      });

      formlyConfigProvider.setType({
        name: 'mdCheckbox',
        template: '<md-checkbox ng-model="model[options.key]">{{::to.label}}</md-checkbox>',
        defaultOptions: { }
      });

      formlyConfigProvider.setType({
        name: 'html',
        template: '<span ng-bind-html="to.htmlContent"></span>'
      });

      formlyConfigProvider.setType({
        name: 'WYSIWYG',
        templateUrl: 'components/formly/formlyTemplates/wysiwyg.html',
        controller: ['$scope', '$log', function($scope, $log){
          return init();

          function init(){

            $scope.$watch('model', function(model){
              if(model){
                $scope.wysiwygModel = getWysiwygModel().wysiwygModel;
                $scope.wysiwygKey = getWysiwygModel().wysiwygKey;
              }
            });

          }

          /**
           *
           */
          function getWysiwygModel(){
            var splitKey = $scope.options.key.split('.');

            var wysiwygModel = $scope.model;
            var wysiwygKey = splitKey[0];
            for(var i = 1; i < splitKey.length; i++){
              wysiwygModel = wysiwygModel[wysiwygKey];
              wysiwygKey = splitKey[i];
            }
            return {
              wysiwygModel: wysiwygModel,
              wysiwygKey: wysiwygKey
            };
          }

        }]
      });

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


      var unique = 1;
      formlyConfigProvider.setType({
        name: 'adminRepeat',
        templateUrl: 'components/formly/formlyTemplates/adminRepeat.html',
        controller: ['$scope', function($scope) {

          return init();

          function init(){
            $scope.formOptions = { formState: $scope.formState };
            $scope.addNew = addNew;
            $scope.copyFields = copyFields;
          }

          function copyFields(fields) {
            fields = angular.copy(fields);
            addRandomIds(fields);
            return fields;
          }

          function addNew() {
            $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
            var repeatsection = $scope.model[$scope.options.key];
            repeatsection.push({});
          }

          function addRandomIds(fields) {
            unique++;
            angular.forEach(fields, function(field, index) {
              if (field.fieldGroup) {
                addRandomIds(field.fieldGroup);
                return; // fieldGroups don't need an ID
              }

              if (field.templateOptions && field.templateOptions.fields) {
                addRandomIds(field.templateOptions.fields);
              }

              field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
            });
          }


          function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
          }

        }]
      });


    });


})(angular);
