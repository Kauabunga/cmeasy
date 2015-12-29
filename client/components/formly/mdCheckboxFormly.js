(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

      formlyConfigProvider.setType({
        name: 'mdCheckbox',
        template: '<md-checkbox ng-model="model[options.key]">{{::to.label}}</md-checkbox>',
        defaultOptions: { }
      });

    });


})(angular);
