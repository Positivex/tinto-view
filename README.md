tinto-view
==========

A customization of ng-view to avoid destroying the created DOM and hide the view instead. This is useful if you don't want the overhead of re-creating the DOM every time the user changes screen!.

> INSTALL bower install tinto-view --save

```javascript
$routeProvider
	.when('/screen1', {templateUrl: 'screen1.html', controller: 'Screen1Controller'})
	.when('/screen2', {templateUrl: 'screen2.html', controller: 'Screen2Controller'})
	.when('/screen3', {templateUrl: 'screen3.html', controller: 'Screen3Controller', hideOnly: true, viewName: 'screen3'})
```

By replacing ng-view with the tinto-view directive, you can add "hideOnly" & "viewName" attributes in your ngRoute configuration (viewName should be unique).

The Screen3 DOM will persist and will just be hidden/shown. You can use the 'enter' and 'leave' events on the screens scope to take action when required:

```javascript
.controller('Screen3Controller', function($scope) {
		$scope.lastTimeLoaded = new Date();
		$scope.$on('enter', function() {
			$scope.lastTimeEntered = new Date(); 
		});
		$scope.$on('leave', function() {
			$scope.lastTimeLeft = new Date(); 
		});
	})
```

When building Tinto (Angular/Phonegap application) the main information feed was rather large, and re-creating the DOM every time the user came back to the feed was quite visible and slow. Tinto-view was one of the performance enhancements it took to make it work.

Check [tinto-bind](https://github.com/TchernoLeRigolo/tinto-bind) for more enhancements.

Check the example in the Test folder to see it working.

Developed for Tinto with @Positivex