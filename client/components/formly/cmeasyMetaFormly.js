(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

      formlyConfigProvider.setType({
        //TODO should come from config
        name: 'cmeasyMeta',
        templateUrl: 'components/formly/formlyTemplates/cmeasyMeta.html',
        defaultOptions: {}
      });

    });


})(angular);
