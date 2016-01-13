'use strict';

angular.module('cmeasyApp')
  .directive('adminContentList', function ($state, $log, $http, $q, $stateParams, Admin, $timeout, Toast, appConfig, Util) {
    return {
      templateUrl: 'components/admin-content-list/admin-content-list.html',
      restrict: 'E',
      scope: {},
      link: function (scope, element, attrs) {

        return init();

        /**
         *
         */
        function init(){

          scope.getModelLabel = getModelLabel;
          scope.openModel = openModel;

          return Admin.getModels()
            .then(function(models){

              scope.models = models;
              $timeout(function(){scope.isLoaded = true;}, 32);
            });
        }


        /**
         *
         * @param model
         * @returns {*}
         */
        function getModelLabel(model){
          return Util.getPrettyLabel(getModelId(model));
        }

        /**
         *
         * @param model
         */
        function openModel(model){
          if(isSingleton(model)){
            $state.go(appConfig.state.item, {
              itemType: getModelId(model),
              itemId: getModelId(model)
            });
          }
          else {
            $state.go(appConfig.state.list, {
              itemType: getModelId(model)
            });
          }
        }


        /**
         *
         * @param model
         * @returns {*}
         */
        function getModelId(model){
          return _.get(model, 'meta.' + appConfig.itemIdKey);
        }



        /**
         *
         * @param model
         * @returns {*}
         */
        function isSingleton(model){
          return _.get(model, 'meta.singleton');
        }

      }
    };
  });
