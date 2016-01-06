'use strict';

angular.module('cmeasyApp')
  .directive('adminApiDisplay', function ($state, $log, $http, $q, Admin, appConfig) {
    return {
      templateUrl: 'components/admin-api-display/admin-api-display.html',
      restrict: 'EA',

      scope: {},
      link: function (scope, element, attrs) {

        return init();

        /**
         *
         */
        function init(){

          scope.getAllContentUrl = getAllContentUrl;
          scope.showAllContent = showAllContent;
        }


        /**
         *
         * @returns {string}
         */
        function getAllContentUrl(){
          return 'http://localhost:9000/admin/api/v1/content';
        }


        /**
         *
         * @returns {*}
         */
        function showAllContent(){
          return Admin.getAllContent()
            .then(function(allContent){
              scope.allContent = allContent;
            })
        }

      }
    };
  });


