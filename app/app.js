'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.report',
  'myApp.version',
  'ui.bootstrap',
  'googlechart'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/report'});
}])
.controller('MainCtrl', function($scope) {
	function getRandomArbitrary(min, max) {
		var r = Math.random() * (max - min) + min;
		return Math.round(r);
	}
	angular.forEach(brands,function(e,i){
		for(var y=0;y<14;y++){
			brands[i].data.push({
				clicks: getRandomArbitrary(e.fixtureMinClicks,e.fixtureMaxClicks),
				impressions: getRandomArbitrary(e.fixtureMinImpressions,e.fixtureMaxImpressions)
			})
		}
	})

    $scope.brands = brands
	$scope.budget = 50000
	$scope.spend = 10000
	$scope.spendingAlert = function(){ return $scope.spend > $scope.budget}
	$scope.budgetProgressClass = function(){
		if($scope.spend > $scope.budget) return "progress-bar-danger"
		else if(($scope.spend * 1.3) > $scope.budget) return "progress-bar-warning"
		else return "progress-bar-success"
	}
	$scope.spendingPercentage = function(){ return $scope.spend / $scope.budget * 100}
})
.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
}]);

var brands = {
	saks: {
		name: "Saks Fith Avenue",
		fixtureMaxClicks:5000,
		fixtureMinClicks:3000,
		fixtureMinImpressions:50000,
		fixtureMaxImpressions:100000,
		data: []
	},
	neiman: {
		name: "Neiman Marcus",
		fixtureMaxClicks:10000,
		fixtureMinClicks:7000,
		fixtureMinImpressions:70000,
		fixtureMaxImpressions:120000,
		data: []
	}
}

