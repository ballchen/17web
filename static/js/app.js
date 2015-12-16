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
			$scope.streams = data
		})
	}

	$scope.Select = function(i){
		$scope.date = i;
		$scope.filelist = $scope.collections[i];
	}

	$scope.getUser = function(oid){
		$scope.showUser = true;
		$scope.user = {};
		$http.get('/user/'+oid).success(function(user){
			$scope.user = user;
		})
	}
}])