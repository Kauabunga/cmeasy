(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

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

    });


})(angular);
