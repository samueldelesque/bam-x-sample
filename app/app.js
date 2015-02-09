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
  $routeProvider.otherwise({redirectTo: '/report/neiman'});
}])
.controller('MainCtrl', function($scope) {

	function getRandomArbitrary(min, max) {
		var r = Math.random() * (max - min) + min;
		return Math.round(r);
	}
	$scope.generateData = function(brands){
		angular.forEach(brands,function(brand,i){
			for(var y=0;y<14;y++){
				var d = new Date()
				var dayDate = new Date(d.setDate(d.getDate()-y))
				brands[i].data.push({
					clicks: getRandomArbitrary(brand.fixtureMinClicks,brand.fixtureMaxClicks),
					impressions: getRandomArbitrary(brand.fixtureMinImpressions,brand.fixtureMaxImpressions),
					date: dayDate
				})
			}
		})
		return brands
	}
	$scope.filterData = function(brands,startDate,endDate){
		var newData = angular.copy(brands);
		angular.forEach(newData,function(brand,i){
			var copy_data = []
			angular.forEach(brand.data,function(dataData,x){
				if(startDate.getTime() < dataData.date.getTime() && dataData.date.getTime()-100 <= endDate.getTime()){
					copy_data.push(brand.data[x])
				}
			})
			newData[i].totals = $scope.sumData(brand)
			copy_data.reverse()
			newData[i].data = copy_data
		})
		console.log(newData)
		return newData
	}

	$scope.sumData = function(brand){
		var sums = {clicks:0,impressions:0}
		angular.forEach(brand.data,function(e,i){
			sums.clicks += e.clicks
			sums.impressions += e.impressions
		})
		return sums
	}
	$scope.sumBrands = function(brands){
		var sums = {clicks:0,impressions:0,days:[]}
		angular.forEach(brands,function(brand,i){
			var brandSum = $scope.sumData(brand)
			sums.clicks += brandSum.clicks
			sums.impressions += brandSum.impressions
			angular.forEach(brand.data,function(dayData,x){
				sums.days[x] = sums.days[x] || {clicks:0,impressions:0}
				sums.days[x].clicks += dayData.clicks
				sums.days[x].impressions += dayData.impressions
				sums.days[x].date = dayData.date
			})
		})
		return sums
	}
	$scope.daydiff = function(first, second) {
		return (second-first)/(1000*60*60*24);
	}
	$scope.startOpen = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.startOpened = true;
	};
	$scope.endOpen = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.endOpened = true;
	};
	$scope.spendingAlert = function(){ return $scope.spend > $scope.budget}
	$scope.budgetProgressClass = function(){
		if($scope.spend > $scope.budget) return "progress-bar-danger"
		else if(($scope.spend * 1.3) > $scope.budget) return "progress-bar-warning"
		else return "progress-bar-success"
	}
	$scope.spendingPercentage = function(){ return $scope.spend / $scope.budget * 100}

	var start = new Date()
	$scope.startDate = new Date(start.setDate(start.getDate()-14))
	$scope.endDate = new Date()
	$scope.minDate = $scope.startDate
	$scope.maxDate = $scope.endDate
	$scope.allData = $scope.generateData(brandsFixtures)
	$scope.brands = $scope.filterData($scope.allData,$scope.startDate,$scope.endDate)
	$scope.budget = 50000
	$scope.spend = 10000
	$scope.totals = $scope.sumBrands($scope.brands)

	$scope.$watch("startDate", function(date, oldValue) {
		console.log("StartDate changed")
		$scope.brands = $scope.filterData($scope.allData,$scope.startDate,$scope.endDate)
		$scope.totals = $scope.sumBrands($scope.brands)
	})
	$scope.$watch("endDate", function(date, oldValue) {
		console.log("EndDate changed")
		$scope.brands = $scope.filterData($scope.allData,$scope.startDate,$scope.endDate)
		$scope.totals = $scope.sumBrands($scope.brands)
	})
})
.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
	return $filter('number')(input * 100, decimals) + '%';
  };
}]);

var brandsFixtures = {
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

var test = true;
