'use strict';

angular.module('myApp.report', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/report/:brand', {
    templateUrl: 'report/report.html',
    controller: 'ReportCtrl'
  });
}])

.controller('ReportCtrl', ['$scope', '$routeParams', '$rootScope', function($scope,$routeParams,$rootScope) {

	function sumBrands(attr){
		var sum = 0;
		angular.forEach(brands,function(e,i){
			sum += e[attr]
		})
		return sum
	}
	if($routeParams.brand == "combined"){
		$scope.impressions = sumBrands("impressions")
		$scope.clicks = sumBrands("clicks")
		$scope.brand = "Combined results"
		$scope.cpi = Math.round($scope.clicks/$scope.impressions * 100)
		$scope.cpc = 2
		$scope.markup = 0.67
	}
	else{
		var brand = brands[$routeParams.brand]
		$scope.impressions = brand.impressions
		$scope.clicks = brand.clicks
		$scope.brand = brand.name
		$scope.cpi = Math.round(brand.clicks/brand.impressions * 100)
		$scope.cpc = 2
		$scope.markup = 0.67
	}
}]);

