'use strict';

angular.module('cmeasyApp')
  .directive('adminApiDisplay', function ($state, $log, $http, $q, Admin, appConfig, $location) {
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
          return `${$location.protocol()}://${location.host}/admin/api/v1/content`;
        }


        /**
         *
         * @returns {*}
         */
        function showAllContent(){
          scope.isHideAllContent === undefined ? scope.isHideAllContent = false : scope.isHideAllContent = ! scope.isHideAllContent; //jshint ignore:line
          return Admin.getAllContent()
            .then(function(allContent){
              scope.allContent = allContent;
            });
        }

      }
    };
  });


