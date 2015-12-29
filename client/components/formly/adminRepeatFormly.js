(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

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
