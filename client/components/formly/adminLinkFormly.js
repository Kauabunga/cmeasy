(function(angular){

  'use strict';

  angular.module('cmeasyApp')
    .config(function (formlyConfigProvider) {

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

    });


})(angular);
