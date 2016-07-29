(function(angular) {
    'use strict';
    angular.module('myApp', [])
        .controller('myController', ['$rootScope', '$scope', '$http', '$log', function($rootScope, $scope, $http, $log) {
            $scope.start = 0;
            $scope.dataAddM = {};
            $scope.dataUpdate = {};
            $scope.getData = function() {
                return $http({
                    method: 'GET',
                    url: '/addresses?_start=' + $scope.start + '&_limit=20&_order=' + $scope.order + '&_sort=' + $scope.sortby + "&" + $scope.searchString
                }).then(function successCallback(response) {
                        // $log.log("hahahhhahha respond" + JSON.stringify(response));
                        if (response.data[0]) {
                            $scope.addresses = response.data;
                            $scope.keys = Object.keys(response.data[0]);
                            $scope.keys.forEach(function(key) {
                                if (key != "id") $scope.dataAddM[key] = key.toUpperCase();
                                $scope.dataUpdate[key] = "";
                            });
                        } else {
                            alert("not record found");
                        }
                        $log.log(response.config.url);
                    },
                    function errorCallback(response) {
                        alert("not get" + response.message);
                    });
            }

            $scope.go = function() {
                $scope.start = 0;
                if ($scope.searchby) {
                    $scope.searchString = $scope.searchby + "=" + $scope.search;
                } else {
                    $scope.searchString = "q=" + $scope.search;
                }
                $scope.getData();
            }
            $scope.nextPage = function() {
                $scope.start += 20;
                $scope.getData();
            }
            $scope.previousPage = function() {
                $scope.start -= 20;

                $scope.getData();
            }
            $scope.delete = function(id, index) {
                return $http({
                    method: 'DELETE',
                    url: '/addresses/' + id
                }).then(function successCallback(response) {
                        alert("successfully deleted the data with an id " + id);
                        $scope.addresses.splice(index, 1);
                    },
                    function errorCallback(response) {
                        alert("not get" + response.message);
                        $('.modal').modal('hide');
                    });

            }
            $scope.updateModal = function(x) {
                $scope.dataUpdate = x;
            }
            $scope.update = function() {

            }
            $scope.add = function() {
                return $http({
                    method: 'POST',
                    data: $scope.dataAddM,
                    'content-Type': "application/json",
                    url: '/addresses'
                }).then(function successCallback(response) {
                        if (response.data.id) {
                            alert("successfully added the data with an id" + response.data.id);
                            $scope.message = "successfully added the data with an id" + response.data.id;
                        } else {
                            alert("not able to update");
                        }
                        $log.log(response.config.url);

                        $('.modal').modal('hide');
                    },
                    function errorCallback(response) {
                        alert("not get" + response.message);
                        $('.modal').modal('hide');
                    });
            }
        }]);
})(window.angular);
