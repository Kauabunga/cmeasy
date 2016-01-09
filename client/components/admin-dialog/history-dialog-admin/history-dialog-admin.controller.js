'use strict';

angular.module('cmeasyApp')
  .controller('HistoryAdminDialogCtrl', function ($scope, $http, $log, $state, $stateParams, $mdDialog, $q, Admin, $window) {

    return init();

    /**
     *
     */
    function init(){

      $scope.selectHistoryItem = selectHistoryItem;
      $scope.getHistoryItemDisplay = getHistoryItemDisplay;
      $scope.getItemIdDisplay = getItemIdDisplay;
      $scope.historyItemId = $stateParams.itemId;

      return getHistoryData($stateParams.itemType, $stateParams.itemId)
        .then(function([historyItems]){
          $log.debug('HistoryAdminDialogCtrl', historyItems);

          $scope.historyItems = historyItems;
          $scope.listColumns = [
            'author',
            'comment',
            'dateCreated'
          ];
        });

    }

    /**
     *
     */
    function getHistoryItemDisplay(item, key){
      var display = _.get(item, key) ? _.get(item, key) : _.get(item, 'meta.' + key);
      if(key === 'dateCreated'){
        return moment($window.parseInt(display)).fromNow();
      }
      else {
        return display;
      }
    }

    /**
     *
     * @param itemType
     * @param itemId
     */
    function getHistoryData(itemType, itemId){
      return $q.all([
          Admin.getItemHistory(itemType, itemId)
        ]);
    }

    /**
     *
     * @param historyItem
     */
    function selectHistoryItem(historyItem){
      $log.debug('selected history item', historyItem);
      $mdDialog.hide(historyItem);
    }

    /**
     * TODO refactor this so it is not duplicated errywhere
     *
     * @param id
     */
    function getItemIdDisplay(id){
      // insert a space before all caps
      return id && id.replace(/([A-Z])/g, ' $1')
          // uppercase the first character
          .replace(/^./, function(str){ return str.toUpperCase(); });
    }


  });
