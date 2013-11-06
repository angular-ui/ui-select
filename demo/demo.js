angular.module('DemoApp', ['ui.select'])
  .controller('MainCtrl', ['$scope', function ($scope) {

    $scope.data = {};
    $scope.data.items = [
      {title: "ActionScript" },
      {title: "AppleScript" },
      {title: "Asp" },
      {title: "BASIC" },
      {title: "C" },
      {title: "C++" },
      {title: "Clojure" },
      {title: "COBOL" },
      {title: "ColdFusion" },
      {title: "Erlang" },
      {title: "Fortran" },
      {title: "Groovy" },
      {title: "Haskell" },
      {title: "Java" },
      {title: "JavaScript" },
      {title: "Lisp" },
      {title: "Perl" },
      {title: "PHP" },
      {title: "Python" },
      {title: "Ruby" },
      {title: "Scala" },
      {title: "Scheme" }
    ];

  }]);