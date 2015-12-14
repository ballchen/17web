var app = angular.module('MyApp', []);
app.controller('MainCtrl', ['$scope', '$http', function($scope, $http){
	$http.get('/collection').success(function(data){
		$scope.collections = data;
	})
}])