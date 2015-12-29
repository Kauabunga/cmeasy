(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

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


    });


})(angular);
