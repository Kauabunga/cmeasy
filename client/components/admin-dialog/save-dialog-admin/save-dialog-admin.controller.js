'use strict';

angular.module('cmeasyApp')
  .controller('SaveAdminDialogCtrl', function ($scope, $http, $log, $state, $stateParams,
                                               $mdDialog, saveItem, saveItemType, saveItemOriginal,
                                               $sessionStorage, $timeout) {

    return init();

    /**
     *
     */
    function init(){

      $scope.save = save;
      $scope.cancel = cancel;

      if(saveItem._id){
        $scope.model = $sessionStorage[saveItem._id] = $sessionStorage[saveItem._id] || getDefaultSaveModel();
      }
      else {
        $log.error('no saveItem passed to save-dialog');
      }

    }

    /**
     *
     */
    function save(adminForm){

      adminForm.$submitted = true;

      if(adminForm.$valid){
        $mdDialog.hide($scope.model);
        $timeout(function(){
          $sessionStorage[saveItem._id] = getDefaultSaveModel();
        }, 500);
      }
    }


    /**
     *
     */
    function cancel(){
      $mdDialog.cancel();
    }

    /**
     *
     * @returns {{comment: string, notifyChange: boolean}}
     */
    function getDefaultSaveModel(){

      return {
        comment: ''
      };
    }



  });
