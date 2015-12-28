'use strict';

angular.module('cmeasyApp')
  .controller('HistoryAdminDialogCtrl', function ($scope, $http, $log, $state, $stateParams, $mdDialog, $q, Admin) {

    return init();

    /**
     *
     */
    function init(){

      $scope.selectHistoryItem = selectHistoryItem;
      $scope.getHistoryItemDisplay = getHistoryItemDisplay;
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
      var display = _.get(item, key);
      if(! display){
        return _.get(item, 'meta.' + key);
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


  });
