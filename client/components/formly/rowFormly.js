(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

      formlyConfigProvider.setType({
        name: 'row',
        templateUrl: 'components/formly/formlyTemplates/row.html'
      });

    });


})(angular);
