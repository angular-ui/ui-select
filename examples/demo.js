'use strict';

angular.module('demo', ['ui.select'])
  .controller('MainCtrl', ['$scope', function ($scope) {
    $scope.person = {};
    $scope.people = [
      { name: 'Wladimir Coka',   email: 'wcoka@email.com' },
      { name: 'Samantha Smith',  email: 'sam@email.com' },
      { name: 'Estefanía Smith', email: 'esmith@email.com' },
      { name: 'Natasha Jones',   email: 'ncoka@email.com' },
      { name: 'Nicole Smith',    email: 'nicky@email.com' },
      { name: 'Adrian Jones',    email: 'asmith@email.com' },
    ];
  }]
);
