(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

      formlyConfigProvider.setType({
        name: 'mdSelect',
        templateUrl: 'components/formly/formlyTemplates/mdSelect.html',
        defaultOptions: {},
        controller: ['$scope', '$parse', controller]
      });


      /**
       *
       */
      function controller($scope, $parse){
        return init();

        /**
         *
         */
        function init(){

          //TODO parse to.selectOptions in the case it is a reference to an angular scope object


        }
      }

    });


})(angular);
