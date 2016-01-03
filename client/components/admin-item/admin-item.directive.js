'use strict';

angular.module('cmeasyApp')
  .directive('adminItem', function ($state, $log, $http, $q, $stateParams, $mdDialog, $timeout,
                                    $window, $rootScope, $location, Admin, AdminDialog, Toast, appConfig) {
    return {
      templateUrl: 'components/admin-item/admin-item.html',
      restrict: 'EA',

      scope: {
        hideItemId: '=',
        itemTitle: '@',
        itemTypeParam: '@',
        itemIdParam: '@',
        deleteItemState: '@'
      },
      link: function (scope, element, attrs) {

        return init();

        /**
         *
         */
        function init(){

          scope.save = save;
          scope.create = create;
          scope.showHistory = showHistory;
          scope.deleteItem = deleteItem;

          //TODO populate model instance with defaults if it is a create item

          return Admin.getModel(getItemType())
            .then(function(model){

              scope.itemTitle = getItemTitle();
              scope.itemType = getItemType();
              scope.itemId = getItemId();
              scope.isCreateItem = isCreateItem;
              scope.canDeleteItem = getCanDeleteItem(model);

              return getItemData(scope.itemType, scope.itemId)
                .then(function([formlyFields, itemModel]){

                  formlyFields = formlyFields || [];
                  itemModel = itemModel || {};
                  $log.debug('Item model', itemModel);
                  $log.debug('Item fields', formlyFields);

                  scope.formlyFields = getFormlyFields(formlyFields);
                  if( ! isCreateItem() ){
                    scope.itemModelOriginal = itemModel;
                    scope.itemModel = _.cloneDeep(itemModel);
                  }

                  return $timeout(function(){
                    scope.isLoaded = true;
                    scope.dirtyWatcher = scope.$watch('itemModel', function(){
                      scope.isDirty = true;
                      scope.dirtyWatcher();
                    }, true);
                  }, 32);

                })
                .catch(function(err){
                  $log.debug('Error getting item data', err);
                  $state.go(getMainState());
                });
            });
        }

        /**
         *
         * @returns {string}
         */
        function getItemTitle() {
          var itemTitle = scope.itemTitle;

          if (!itemTitle) {
            itemTitle = getItemType();
          }

          var lastCharIndex = itemTitle.length - 1;
          if (itemTitle.charAt(lastCharIndex) === 's') {
            itemTitle = itemTitle.substring(0, lastCharIndex);
          }

          return itemTitle;
        }

        /**
         *
         * @param model
         */
        function getCanDeleteItem(model){

          console.log('getCanDeleteItem', model);

          return model && model.meta ? ! model.meta.disableDelete && ! model.meta.singleton : true;
        }

        /**
         *
         */
        function getItemType(){
          return $stateParams[scope.itemTypeParam];
        }

        /**
         *
         */
        function getItemId(){
          return $stateParams[scope.itemIdParam];
        }

        /**
         *
         */
        function getMainState(){
          return appConfig.state.main;
        }

        /**
         *
         * @returns {boolean}
         */
        function isCreateItem(){
          return getItemId() === 'create';
        }


        /**
         * TODO refactor this -> wrapper around admin-item directives to handle data fetching
         *
         * @param fields
         * @returns {*}
         */
        function getFormlyFields(fields){
          return _(fields).filter(keepMetaIdOnCreate).value();
        }

        /**
         *
         * @param field
         * @returns {boolean}
         */
        function keepMetaIdOnCreate(field){
          return field.key === 'meta._cmeasyId' ? isCreateItem() : true;
        }


        /**
         *
         */
        function showHistory($event, itemModel){

          return AdminDialog.showHistoryDialog($event)
            .then(function hide(historyItem) {
              $log.debug('History item selected', historyItem);
              scope.itemModel = historyItem;
            },
            function cancel() {
              $log.debug('History item canceled');
              scope.isDialogActive = false;
            })
            .catch(function(){
              $log.debug('Error creating history dialog');
            });

        }


        /**
         *
         * @param $event
         * @param item
         */
        function deleteItem($event, item){

          return AdminDialog.showDeleteDialog($event)
            .then(function hide() {
              scope.isDeleting = true;
              return Admin.deleteItem(getItemType(), getItemId())
                .then(function(response){
                  $log.debug('Delete response', response);
                  //$stateParams.listType = $stateParams.itemType;
                  $state.go(appConfig.state.list, $stateParams);
                })
                .finally(function(){
                  scope.isDeleting = false;
                });
            },
            function cancel() {
              $log.debug('Delete item canceled');
            })
            .catch(function(){
              $log.debug('Error creating delete dialog');
            });

        }

        /**
         *
         */
        function save($event, item){

          var locals = {
            saveItem: item,
            saveItemType: getItemType(),
            saveItemOriginal: scope.itemModelOriginal
          };

          return AdminDialog.showSaveDialog($event, locals)
            .then(function hide(saveModel) {
              $log.debug('saving item', item, saveModel);
              scope.isDialogActive = false;


              scope.isPublishing = true;
              return Admin.saveItem(getItemType(), _.assign(item, saveModel)).
                then(function(response){
                  $log.debug('save response', response);

                  scope.itemModelOriginal = response.data;
                  scope.itemModel = _.cloneDeep(response.data);
                  Toast.publishToastMessage();
                  $timeout(function(){ scope.isDirty = false; });

                })
                .finally(function(){
                  scope.isPublishing = false;
                });

            },
            function cancel() {
              $log.debug('save item canceled');
              scope.isDialogActive = false;
            })
            .catch(function(){
              $log.debug('Error creating save dialog');
            });

        }

        /**
         *
         */
        function create(item){
          $log.debug('creating item', item);
          if( ! scope.isCreating ){

            scope.isCreating = true;

            return Admin.createItem(getItemType(), item)
              .then(function(itemModel){

                $log.debug('save response', itemModel);
                scope.itemModel = itemModel;
                $stateParams.itemId = itemModel[appConfig.itemInstanceKey];

                $state.go($state.current.name, $stateParams, { location: 'replace' });
              })
              .finally(function(){
                scope.isCreating = false;
              });
          }
        }

        /**
         *
         * @param itemType
         * @param itemId
         * @returns {Promise}
         */
        function getItemData(itemType, itemId){

          var promises = [ Admin.getTypeMetadata(itemType, itemId) ];
          if( ! isCreateItem() ){ promises.push(Admin.getItem(itemType, itemId)); }

          return $q.all(promises);
        }

      }
    };
  });


