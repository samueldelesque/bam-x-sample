'use strict';

angular.module('myApp.report', ['ngRoute','googlechart'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/report/:brand', {
	templateUrl: 'report/report.html',
	controller: 'ReportCtrl'
  });
}])

.controller('ReportCtrl', ['$scope', '$routeParams', '$rootScope', function($scope,$routeParams,$rootScope) {

	function sumData(brand,dayStart,dayEnd){
		var sums = {clicks:0,impressions:0}
		angular.forEach(brand.data,function(e,i){
			sums.clicks += e.clicks
			sums.impressions += e.impressions
		})
		return sums
	}
	function sumBrands(brands){
		var sums = {clicks:0,impressions:0,days:[]}
		angular.forEach(brands,function(brand,i){
			var brandSum = sumData(brand)
			sums.clicks += brandSum.clicks
			sums.impressions += brandSum.impressions
			angular.forEach(brand.data,function(dayData,day){
				sums.days[day] = sums.days[day] || {clicks:0,impressions:0}
				sums.days[day].clicks += dayData.clicks
				sums.days[day].impressions += dayData.impressions
			})
		})
		return sums
	}

	var cols = [{id: "day", label: "Day", type: "string"}];
	var rows = [],y=0;
	var start = new Date()


	$scope.startDate = start.setDate(start.getDate()-14)
	$scope.endDate = new Date()

	if($routeParams.brand == "combined" || $routeParams.brand == "stacked"){
		var totals = sumBrands(brands)
		$scope.impressions = totals.impressions
		$scope.clicks = totals.clicks
		$scope.brand = "Combined results"
		$scope.cpi = Math.round($scope.clicks/$scope.impressions * 100)
		$scope.cpc = 2
		$scope.markup = 0.67

		if($routeParams.brand == "stacked"){
			angular.forEach(brands,function(brand,slug){
				cols.push({id:slug,label:brand.name,type:"number"})
				angular.forEach(brand.data,function(dayData,day){
					rows[day] = rows[day] || {c:[{v:14-day}]}
					rows[day].c.push({v:dayData.clicks})//add f property here for hover label
				})
				y++
			})
		}
		else{
			cols.push({id:"combined",label:"All combined",type:"number"})
			angular.forEach(totals.days,function(dayData,day){
				rows[day] = rows[day] || {c:[{v:14-day}]}
				rows[day].c.push({v:dayData.clicks})//add f property here for hover label
			})
		}
	}
	else{
		var brand = brands[$routeParams.brand]
		var totals = sumData(brand)
		$scope.impressions = totals.impressions
		$scope.clicks = totals.clicks
		$scope.brand = brand.name
		$scope.cpi = Math.round(totals.clicks/totals.impressions * 100)
		$scope.cpc = 2
		$scope.markup = 0.67

		cols.push({id:$routeParams.brand,label:brand.name,type:"number"})
		angular.forEach(brand.data,function(dayData,day){
			rows[day] = rows[day] || {c:[{v:14-day}]}
			rows[day].c.push({v:dayData.clicks})//add f property here for hover label
		})
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

	var clicksPerDay = {
		type: "LineChart",
		cssStyle: "height:300px; width:100%;",
		data: {
			cols: cols,
			rows: rows
		},
		options: {
			"title": "Clicks per day",
			"isStacked": "true",
			"fill": 20,
			"displayExactValues": true,
			"vAxis": {
				"title": "Clicks", "gridlines": {"count": 8}
			},
			"hAxis": {
				"title": "Day"
			}
		},
		formatters: {}
	}

	$scope.chart = clicksPerDay;
}]);

