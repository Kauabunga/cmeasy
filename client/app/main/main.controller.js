'use strict';

(function(angular) {

class MainController {

  constructor($mdSidenav) {
    this.$mdSidenav = $mdSidenav;

    //$mdSidenav('admin-left-nav').toggle();
  }

  //constructor($http, $scope, socket) {
  //  this.$http = $http;
  //  this.awesomeThings = [];
  //
  //  $http.get('/api/things').then(response => {
  //    this.awesomeThings = response.data;
  //    socket.syncUpdates('thing', this.awesomeThings);
  //  });
  //
  //  $scope.$on('$destroy', function() {
  //    socket.unsyncUpdates('thing');
  //  });
  //}
  //
  //addThing() {
  //  if (this.newThing) {
  //    this.$http.post('/api/things', { name: this.newThing });
  //    this.newThing = '';
  //  }
  //}
  //
  //deleteThing(thing) {
  //  this.$http.delete('/api/things/' + thing._id);
  //}
}

angular.module('cmeasyApp').controller('MainController', MainController);

})(angular);
