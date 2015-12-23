'use strict';

angular.module('cmeasyApp')
  .factory('Admin', function Admin($http, $q, $log, $cacheFactory, $rootScope, $window, $state, appConfig) {

    var adminCache = $cacheFactory('adminCache');

    return init();


    /**
     *
     *
     */
    function init(){

      return {
        getModel: getModel,
        getModels: getModels,

        getAll: getAll,
        getItem: getItem,
        saveItem: saveItem,
        createItem: createItem,
        deleteItem: deleteItem,
        getItemHistory: getItemHistory,
        getTypeMetadata: getTypeMetadata,
        getTypeColumns: getTypeColumns
      };
    }


    /**
     *
     * @param id
     * @returns {*}
     */
    function getModel(id){
      return getModels()
        .then(function(models){
          return _(models).filter(function(model){return model._cmeasyId === id;}).first();
        });
    }

    /**
     *
     */
    function getModels(){
      return $q.when($window._cmeasy.models);
    }

    /**
     *
     * @param type
     * @returns {*}
     */
    function getAll(type, options) {
      return $http.get(appConfig.apiRoute + '/' + type, { cache: getCache(options) })
        .then(getDataFromSuccess);
    }

    /**
     *
     * @param type
     * @param item
     * @returns {HttpPromise}
     */
    function saveItem(type, item) {
      return $http.post(appConfig.apiRoute + '/' + type, item)
        .then(handleChangeResponseForType(type));
    }

    /**
     *
     * @param type
     * @param item
     * @returns {HttpPromise}
     */
    function createItem(type, item) {
      return $http.post( appConfig.apiRoute + '/' + type, item)
        .then(getDataFromSuccess)
        .then(handleChangeResponseForType(type));
    }

    /**
     * Update the current session and other tabs with the new content
     *
     * @param response
     * @returns {*}
     */
    function handleChangeResponseForType(type){
      return function(response) {
        $log.debug('Changed item response', response);
        return response;
      };
    }
    /**
     *
     */
    function getItem(type, id, options) {
      return $http.get(appConfig.apiRoute + '/' + type + '/' + id, {cache: false})
        .then(getDataFromSuccess);
    }

    /**
     *
     */
    function getTypeMetadata(type, options) {
      return $http.get(appConfig.apiRoute + '/' + type + '/' + appConfig.modelFormlyRoute, {cache: getCache(options)})
        .then(getDataFromSuccess);
    }

    /**
     *
     */
    function getTypeColumns(type, options) {
      return $http.get(appConfig.apiRoute + '/' + type + '/' + appConfig.modelColumnRoute, {cache: getCache(options)})
        .then(getDataFromSuccess);
    }

    /**
     *
     * @param type
     * @param id
     * @param options
     * @returns {HttpPromise}
     *
     * TODO get history route into config
     */
    function getItemHistory(type, id, options) {
      return $http.get(appConfig.apiRoute + '/' + type + '/' + id + '/history', {cache: false})
        .then(getDataFromSuccess);
    }

    /**
     *
     * @param type
     * @param id
     * @returns {HttpPromise}
     */
    function deleteItem(type, id) {
      return $http.delete(appConfig.apiRoute + '/' + type + '/' + id)
        .then(getDataFromSuccess)
        .then(handleChangeResponseForType(type));
    }

    /**
     *
     * @param options
     * @returns {boolean}
     */
    function isCacheRequest(options) {
      var cache = true;
      options = options || {};
      if (options.force) {
        cache = false;
      }
      return cache;
    }


    /**
     *
     */
    function getCache(options) {
      if (!isCacheRequest(options)) {
        adminCache.removeAll();
      }
      return adminCache;
    }

    /**
     *
     */
    function getDataFromSuccess(response){
      return response && response.data || [];
    }


  });
