'use strict';

angular.module('TintoViewTest', ['Tinto', 'ngRoute'])
	.controller('Screen1Controller', function($scope) {
		$scope.lastTimeLoaded = new Date();
	})
	.controller('Screen2Controller', function($scope) {
		$scope.lastTimeLoaded = new Date();
	})
	.controller('Screen3Controller', function($scope) {
		$scope.lastTimeLoaded = new Date();
		$scope.$on('enter', function() {
			$scope.lastTimeEntered = new Date(); 
		});
		$scope.$on('leave', function() {
			$scope.lastTimeLeft = new Date(); 
		});
	})
	.controller('MainController', function($scope) {

	})
	.config(function($routeProvider) {
		$routeProvider
   			.when('/screen1', {templateUrl: 'screen1.html', controller: 'Screen1Controller'})
			.when('/screen2', {templateUrl: 'screen2.html', controller: 'Screen2Controller'})
			.when('/screen3', {templateUrl: 'screen3.html', controller: 'Screen3Controller', hideOnly: true, viewName: 'screen3'})
			.otherwise()
		;
	});