'use strict';

angular.module('cmeasyApp')
  .controller('DeleteAdminDialogCtrl', function ($scope, $http, $log, $state, $stateParams, $mdDialog, deleteTitle) {

    return init();

    /**
     *
     */
    function init(){
      $scope.deleteTitle = deleteTitle || 'Confirm delete';
      $scope.confirmDelete = confirmDelete;
      $scope.cancel = cancel;
      $scope.model = $scope.model || {};
    }

    /**
     *
     */
    function confirmDelete(adminForm){

      adminForm.$submitted = true;
      $log.debug('confirm delete adminForm', adminForm);

      if(adminForm.$valid){
        $mdDialog.hide();
      }
    }


    /**
     *
     */
    function cancel(){
      $mdDialog.cancel();
    }

  });
