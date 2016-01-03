(function(){

  'use strict';

  angular.module('cmeasyApp')
    .directive('loadingScreen', function ($timeout, $rootScope, $log) {
      return {
        template: '<div id="app-loading-screen" ng-transclude=""></div>',
        restrict: 'EA',
        transclude: true,
        replace: true,
        link: function (scope, element, attrs) {

          return init();

          /**
           *
           */
          function init(){
            if(isSupportedBrowser()){
              removeLoadingScreen();
            }
          }

          /**
           *
           * @returns {*}
           */
          function isSupportedBrowser(){
            return ! angular.element(document.documentElement).hasClass('lt-ie10');
          }

          /**
           *
           */
          function removeLoadingScreen(){

            //TODO we should only remove the loading screen while the window is focued to avoid the css crazyness

            //Looks like we dont need to delay this load screen at all
            var throttleTilleLoaded = _.debounce(function(){

              $timeout(function(){
                element.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(){
                  if(element){ element.remove(); }
                });
                element.toggleClass('fade-out', true);
              });

              scope.viewContentLoadedDestroy();

            }, 200);

            scope.viewContentLoadedDestroy = $rootScope.$on('$viewContentLoaded', function(){
              $log.debug('$viewContentLoaded');
              throttleTilleLoaded();
            });

          }
        }

      };
    });

})();
