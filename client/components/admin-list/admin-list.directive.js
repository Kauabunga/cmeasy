'use strict';

angular.module('cmeasyApp')
  .directive('adminList', function ($state, $log, $http, $q, $stateParams, Admin, $timeout, Toast, appConfig) {
    return {
      templateUrl: 'components/admin-list/admin-list.html',
      restrict: 'E',
      scope: {
        listTitle: '@',
        listTypeParam: '@',
        itemState: '@'
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

          scope.list = scope.list || [];
          scope.filterText = '';

          return Admin.getModel(getListType())
            .then(function(model){

              //TODO dont need these? or use model
              scope.listTitle = getListTitle();
              scope.listType = getListType();
              scope.canCreate = getCanCreateModel(model);

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
          $state.go(getItemState(), { itemType: getListType(), itemId: getListItemId(listItem) });
        }

        /**
         *
         * @param value
         * @returns {*}
         */
        function getRenderedColumnValue(value){
          if(value instanceof Array){

            return _(value)
              .map(function(valueItem){ return _.omit(valueItem, '_id'); })
              .map(function(valueItem){
                return ' ' + _.map(valueItem, function(value){ return value; }).toString()
                  .replace(/"/g, '').replace(/,/g, ' : ') + ' ';
              })
              .value().toString().replace(/,/g, ' &nbsp;&nbsp;|&nbsp;&nbsp; ');
          }
          else {
            return value;
          }
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
          return appConfig.state.main;
        }

        /**
         *
         */
        function filterList(item, index, list){

          if( ! scope.filterText){ return true; }

          var valid = false;
          _.map(scope.listColumns, function(column){
            if(JSON.stringify(item[column] || '').toLowerCase().indexOf(scope.filterText.toLowerCase()) !== -1){
              valid = true;
            }
          });

          return valid;
        }

        /**
         *
         * @param listItem
         */
        function getListItemId(listItem){
          return listItem[appConfig.itemIdKey];
        }

        /**
         *
         */
        function getCanCreateModel(model){
          return ! model.disableCreate;
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
          // insert a space before all caps
          return label.replace(/([A-Z])/g, ' $1')
            // uppercase the first character
            .replace(/^./, function(str){ return str.toUpperCase(); });
        }

        /**
         *
         * @returns {*|listType}
         */
        function getListType(){
          return $stateParams[scope.listTypeParam];
        }


      }
    };
  });
