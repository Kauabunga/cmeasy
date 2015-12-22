'use strict';

angular.module('cmeasyApp')
  .factory('AdminDialog', function AdminDialog($log, $mdDialog, $q, $window, $location, $rootScope) {

    var isDialogActive = false;

    return init();


    /**
     *
     *
     */
    function init() {

      $rootScope.$on('$stateChangeStart', blockBackButton);

      return {
        showHistoryDialog: showHistoryDialog,
        showDeleteDialog: showDeleteDialog,
        showSaveDialog: showSaveDialog
      };
    }


    /**
     *
     * @param $event
     * @param locals
     * @returns {*}
     */
    function showSaveDialog($event, locals){

      if(! isDialogActive) {
        isDialogActive = true;

        return $mdDialog.show({
          controller: 'SaveAdminDialogCtrl',
          templateUrl: 'components/admin-dialog/save-dialog-admin/save-dialog-admin.html',
          parent: angular.element(document.body),
          targetEvent: $event,
          clickOutsideToClose:true,
          locals: _.merge({}, locals || {})
        }).finally(dismissDialog);
      }
      else {
        return $q.reject();
      }
    }


    /**
     *
     * @param $event
     * @param locals
     * @returns {*}
     */
    function showDeleteDialog($event, locals){

      if(! isDialogActive) {
        isDialogActive = true;

        return $mdDialog.show({
          controller: 'DeleteAdminDialogCtrl',
          templateUrl: 'components/admin-dialog/delete-dialog-admin/delete-dialog-admin.html',
          parent: angular.element(document.body),
          targetEvent: $event,
          clickOutsideToClose: true,
          locals: _.merge({deleteTitle: ''}, locals || {})
        }).finally(dismissDialog);
      }
      else {
        return $q.reject();
      }
    }


    /**
     *
     * @param $event
     * @returns {*}
     */
    function showHistoryDialog($event){

      if(! isDialogActive) {
        isDialogActive = true;

        return $mdDialog.show({
          controller: 'HistoryAdminDialogCtrl',
          templateUrl: 'components/admin-dialog/history-dialog-admin/history-dialog-admin.html',
          parent: angular.element(document.body),
          targetEvent: $event,
          clickOutsideToClose: true
        }).finally(dismissDialog);

      }
      else {
        return $q.reject();
      }

    }

    /**
     *
     * @param response
     * @returns {*}
     */
    function dismissDialog(response){
      $mdDialog.cancel();
      isDialogActive = false;
      return response;
    }


    /**
     *
     */
    function blockBackButton($event){
      if ( isDialogActive ) {
        $event.preventDefault();
        $window.history.pushState({}, $location.path(), $location.path());
        dismissDialog();
      }
    }


  });
