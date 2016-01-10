(function(){

'use strict';

angular.module('cmeasyApp', [
  'cmeasyApp.auth',
  'cmeasyApp.admin',
  'cmeasyApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngMaterial',
  'ngAnimate',
  'ngMessages',
  'ngStorage',
  'angulartics',
  'angulartics.google.analytics',
  'formly',
  'btford.socket-io',
  'ui.router',
  'validation.match'
])
  .config(function($urlRouterProvider, $locationProvider, $logProvider, $mdThemingProvider) {

    $urlRouterProvider.otherwise('/admin/main');
    $locationProvider.html5Mode(true);

    $logProvider.debugEnabled( ! window._cmeasy || window._cmeasy.env === 'development');

    $mdThemingProvider.theme('default').primaryPalette('blue').accentPalette('purple').warnPalette('orange');

  })
  .run(function($rootScope, $state, Analytics, $window, $log){

    return init();

    /**
     *
     */
    function init(){
      $rootScope.$on('$stateChangeStart', handleStateChangeSuccess());
      $window.onerror = handleOnError;
    }

    /**
     *
     */
    function handleStateChangeSuccess(){
      updateCurrentStateName(undefined, $state.current);
      return updateCurrentStateName;
    }

    /**
     *
     * @param event
     * @param toState
     */
    function updateCurrentStateName(event, toState){
      $rootScope.currentStateName = toState.name.replace(/\./g, '-');
    }


    /**
     *
     * @param message
     * @param url
     * @param lineNumber
     * @returns {boolean}
     */
    function handleOnError(message, url, lineNumber) {

      try {
        message = message || '';
        url = url || '';
        lineNumber = lineNumber || '';
        var eventLabel = message.toString() + ' ' + url.toString() + ' ' + lineNumber.toString();
        Analytics.trackEvent('Error', eventLabel);
      }
      catch (err) {
        $log.debug('Error in global error handler!', err);
      }

      return false;
    }


  });


})();




