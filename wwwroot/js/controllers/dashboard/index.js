app.controller('employeesListCtrl', function ($scope, $http) {
    $scope.getEmployeesCount = function () {
        $http.get(baseUrl + 'employees/count').then(function (response) {
            $scope.employeescount = response.data;
        });
    };

    $scope.getSalesRepsCount = function () {
        $http.get(baseUrl + 'employees/salesrepscount').then(function (response) {
            $scope.salesrepscount = response.data;
        });
    };

    $scope.getEmployeesCount();
    $scope.getSalesRepsCount();
});