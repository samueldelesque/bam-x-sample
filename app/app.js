'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.report',
  'myApp.view2',
  'myApp.version',
  'angular-datepicker'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/report'});
}])
.controller('MainCtrl', function($scope) {
    $scope.brands = brands
})
.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
}]);

var brands = {
	saks: {
		name: "Saks Fith Avenue",
		impressions: 103705,
		clicks: 3111
	},
	neiman: {
		name: "Neiman Marcus",
		impressions: 10220,
		clicks: 1230
	}
}

