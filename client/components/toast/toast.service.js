'use strict';

angular.module('cmeasyApp').config(function($mdThemingProvider){

  $mdThemingProvider.theme('error-toast');
  $mdThemingProvider.theme('success-toast');

});


angular.module('cmeasyApp')
  .factory('Toast', function Toast($sessionStorage, $log, $http, $q, $window, $mdToast, $timeout) {

    return {
      basicToastMessage: basicToastMessage,
      errorToastMessage: errorToastMessage,
      successToastMessage: successToastMessage,

      publishToastMessage: publishToastMessage,
      genericErrorToastMessage: genericErrorToastMessage,
      finishErrorToastMessage: finishErrorToastMessage,
      saveErrorToastMessage: saveErrorToastMessage
    };


    /**
     *
     */
    function basicToastMessage(message){
      return $mdToast.show(
        $mdToast.simple()
          .content(message)
          .position('bottom right')
          .action('Close')
          .hideDelay(12000)
      );
    }

    /**
     *
     */
    function errorToastMessage(message){
      return $mdToast.show(
        $mdToast.simple()
          .content(message)
          .position('bottom right')
          .action('Close')
          .theme('error-toast')
          .hideDelay(12000)
      );
    }


    /**
     *
     */
    function successToastMessage(message){
      return $mdToast.show(
        $mdToast.simple()
          .content(message)
          .position('bottom right')
          .action('Close')
          .theme('success-toast')
          .hideDelay(12000)
      );
    }




    /**
     *
     */
    function publishToastMessage(){
      return successToastMessage('Published! Go back to check out the change.');
    }

    /**
     *
     */
    function genericErrorToastMessage(){
      return errorToastMessage('Uh oh! Something went wrong. Please try again.');
    }

    /**
     *
     */
    function saveErrorToastMessage(){
      return errorToastMessage('Something went wrong while trying to save your form. Please try again.');
    }

    /**
     *
     */
    function finishErrorToastMessage(){
      return errorToastMessage('Something went wrong while trying to finish your form. Please try again.');
    }

  });
