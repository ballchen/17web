var app = angular.module('MyApp', []);
app.controller('MainCtrl', ['$scope', '$http', function($scope, $http){
	$scope.showList = null;
	$http.get('/collection').success(function(data){
		$scope.collections = _.groupBy(data, function(n){
			return n.split('-')[0];
		})	
		console.log($scope.collections)
	})

	$scope.getCollection = function(name){
		$http.get('/hots/'+name).success(function(data){
			$scope.current = data
		})
	}

	$scope.Select = function(i){
		$scope.data = i;
		$scope.filelist = $scope.collections[i];
	}
}])