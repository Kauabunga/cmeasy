(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

      formlyConfigProvider.setType({
        name: 'html',
        template: '<span ng-bind-html="to.htmlContent"></span>'
      });

    });


})(angular);
