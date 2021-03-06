'use strict';

angular.module('cmeasyApp')
  .directive('adminList', function ($state, $log, $http, $q, $stateParams, Admin, $timeout, Toast, appConfig) {
    return {
      templateUrl: 'components/admin-list/admin-list.html',
      restrict: 'E',
      scope: {
        listTitle: '@',
        listType: '@',
        listTypeParam: '@',
        itemState: '@',
        disableCreate: '@'
      },
      link: function (scope, element, attrs) {

        return init();

        /**
         *
         */
        function init(){

          scope.openListItem = openListItem;
          scope.createItem = createItem;
          scope.filterList = filterList;
          scope.getRenderedColumnValue = getRenderedColumnValue;
          scope.getPrettyLabel = getPrettyLabel;
          scope.getListIdDisplay = getPrettyLabel;

          $log.debug('List admin init', getListType(), $stateParams[scope.listTypeParam]);

          return Admin.getModel(getListType())
            .then(function(model){

              //TODO dont need these? or use model
              scope.listTitle = getListTitle();
              scope.listType = getListType();
              scope.canCreate = getCanCreateModel(model);
              scope.list = scope.list || [];
              scope.filterText = '';

              return getListData(getListType(), { force: !! getCanCreateModel(model) })
                .then(function([allItems, itemColumns]){

                  scope.list = allItems || [];
                  scope.listColumns = itemColumns;

                  $timeout(function(){scope.isLoaded = true;}, 32);

                })
                .catch(function(err){
                  $log.debug('Error getting item data', err);
                  $state.go(getMainState());
                });
            });
        }

        /**
         *
         * @returns {Promise}
         */
        function getListData(listType, options){
          return $q.all(
            [
              Admin.getAll(listType, options),
              Admin.getTypeColumns(listType, options)
                .then(defaultColumnsIfEmpty)
            ]
          );
        }

        /**
         *
         */
        function defaultColumnsIfEmpty(columns){

          if( ! columns || columns.length === 0){
            return [appConfig.itemIdKey];
          }
          else {
            return columns;
          }
        }

        /**
         *
         * @param listOption
         */
        function openListItem(listItem){
          $state.go(getItemState(), { itemType: getItemType(listItem), itemId: getListItemId(listItem) });
        }

        /**
         *
         * @param value
         * @returns {*}
         */
        function getRenderedColumnValue(item, label){

          var value = _.get(item, label);

          if(value instanceof Array){
            return _(value)
              .map(function(valueItem){ return _.omit(valueItem, '_id'); })
              .map(function(valueItem){
                return ' ' + _.map(valueItem, function(value){ return value; }).toString()
                  .replace(/"/g, '').replace(/,/g, ' : ') + ' ';
              })
              .value().toString().replace(/,/g, ' &nbsp;&nbsp;|&nbsp;&nbsp; ');
          }
          else if(isCamelCaseValue(value)){
            return getPrettyLabel(value);
          }
          else {
            return value && value.default || value;
          }
        }

        function isCamelCaseValue(value){
          return value === _.camelCase(value);
        }

        /**
         *
         * @returns {string|string}
         */
        function getItemState(){
          return scope.itemState || appConfig.state.item;
        }

        /**
         *
         * @returns {string}
         */
        function getMainState(){
          return appConfig.state.content;
        }

        /**
         *
         */
        function filterList(item, index, list){

          if( ! scope.filterText){ return true; }

          var valid = false;
          _.map(scope.listColumns, function(column){
            _.map(scope.filterText.toLowerCase().split(' '), function(searchSplit){
              if(JSON.stringify(item[column] || item.meta && item.meta[column] || '').toLowerCase().indexOf(searchSplit) !== -1){
                valid = true;
              }
            });
          });

          return valid;
        }

        /**
         *
         * @param listItem
         */
        function getListItemId(listItem){

          if(typeof listItem[appConfig.itemInstanceKey] !== 'string'){
            //Get the id from a schema type
            return listItem.meta[appConfig.itemIdKey];
          }
          else {
            //Get the id of a non singleton model type
            return listItem[appConfig.itemInstanceKey];
          }

        }

        /**
         *
         */
        function getCanCreateModel(model){

          if(scope.disableCreate){
            return false;
          }
          else {
            return model ? ! model.meta.disableCreate : true;
          }
        }

        /**
         *
         */
        function createItem(){
          $state.go(getItemState(), { itemType: getListType(), itemId: 'create' });
        }

        /**
         *
         * @returns {string}
         */
        function getListTitle() {
          var listTitle = scope.listTitle;

          if (!listTitle) {
            listTitle = getListType();
          }

          var lastCharIndex = listTitle.length - 1;
          if (listTitle.charAt(lastCharIndex) === 's') {
            listTitle = listTitle.substring(0, lastCharIndex);
          }

          return listTitle;
        }

        /**
         *
         * @param label
         */
        function getPrettyLabel(label){

          // replace all . with a space
          return label && label.replace(/\./g, ' ')
            //replace all underscores
            .replace(/_/g, ' ')
            // insert a space before all caps
            .replace(/([A-Z])/g, ' $1')
            // uppercase the first character
            .replace(/^./, function(str){ return str.toUpperCase(); });
        }

        /**
         *
         * @returns {*|listType}
         */
        function getListType(){
          return scope.listType || $stateParams[scope.listTypeParam];
        }


        /**
         *
         */
        function getItemType(){
          return getListType();
        }


      }
    };
  });
