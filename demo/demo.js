angular.module('DemoApp', ['ui.select'])

  .config(function(uiSelectConfig){
    // uiSelectConfig.defaultTheme = 'select2';
    // uiSelectConfig.defaultTheme = 'selectize';
  })

  .controller('MainCtrl', ['$scope', function ($scope) {

    $scope.data = {};
    $scope.data.items = [
      {
        "id": 1,
        "name": "Wladimir Coka",
        "email": "wcoka@email.com",
      },
      {
        "id": 2,
        "name": "Samantha Smith",
        "email": "sam@email.com",
      },
      {
        "id": 3,
        "name": "Estefanía Smith",
        "email": "esmith@email.com",
      },
      {
        "id": 4,
        "name": "Natasha Jones",
        "email": "ncoka@email.com",
      },
      {
        "id": 5,
        "name": "Nicole Smith",
        "email": "nicky@email.com",
      },
      {
        "id": 6,
        "name": "Adrian Jones",
        "email": "asmith@email.com",
      },
    ];

}]);