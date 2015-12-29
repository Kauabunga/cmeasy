(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

      formlyConfigProvider.setType({
        name: 'mdSelect',
        templateUrl: 'components/formly/formlyTemplates/mdSelect.html',
        defaultOptions: {}
      });

    });


})(angular);
