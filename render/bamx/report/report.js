'use strict';

angular.module('myApp.report', ['ngRoute','googlechart'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/report/:brand', {
	templateUrl: 'report/report.html',
	controller: 'ReportCtrl'
  });
}])

.controller('ReportCtrl', ['$scope', '$routeParams', '$rootScope', function($scope,$routeParams,$rootScope) {
	function render(){
		var cols = [{id: "day", label: "Day", type: "string"}];
		var rows = [],y=0;

		if($routeParams.brand == "combined" || $routeParams.brand == "stacked"){
			$scope.impressions = $scope.totals.impressions
			$scope.clicks = $scope.totals.clicks
			$scope.brand = "Combined results"
			$scope.cpi = Math.round($scope.totals.clicks/$scope.totals.impressions * 100)
			$scope.cpc = 2
			$scope.markup = 0.67

			if($routeParams.brand == "stacked"){
				angular.forEach($scope.brands,function(brand,slug){
					cols.push({id:slug,label:brand.name,type:"number"})
					angular.forEach(brand.data,function(dayData,x){
						rows[x] = rows[x] || {c:[{v:(dayData.date.getMonth()+1)+"/"+dayData.date.getDate()}]}
						rows[x].c.push({v:dayData.clicks})//add f property here for hover label
					})
					y++
				})
			}
			else{
				cols.push({id:"combined",label:"All combined",type:"number"})
				angular.forEach($scope.totals.days,function(dayData,x){
					rows[x] = rows[x] || {c:[{v:(dayData.date.getMonth()+1)+"/"+dayData.date.getDate()}]}
					rows[x].c.push({v:dayData.clicks})//add f property here for hover label
				})
			}
		}
		else{
			var brand = $scope.brands[$routeParams.brand]
			var totals = $scope.sumData(brand)
			$scope.impressions = totals.impressions
			$scope.clicks = totals.clicks
			$scope.brand = brand.name
			$scope.cpi = Math.round(totals.clicks/totals.impressions * 100)
			$scope.cpc = 2
			$scope.markup = 0.67
			
			cols.push({id:$routeParams.brand,label:brand.name,type:"number"})

			angular.forEach(brand.data,function(dayData,x){
				rows[x] = rows[x] || {c:[{v:(dayData.date.getMonth()+1)+"/"+dayData.date.getDate()}]}
				rows[x].c.push({v:dayData.clicks})//add f property here for hover label
			})

		}

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
		$scope.test = $rootScope.startDate;
	}

	$scope.$watch("startDate", function(date, oldValue) {
		render()
	})
	$scope.$watch("endDate", function(date, oldValue) {
		render()
	})
}]);

