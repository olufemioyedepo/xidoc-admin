app.controller('territoriesListCtrl', function ($scope, $http) {
    document.title = "Territories";


    $scope.getterritories = function () {
        $http.get(baseUrl + 'territory/allterritories').then(function (response) {
            $scope.territories = response.data;
            angular.element(document).ready(function () {
                dTable = $('#territoriesTable');
                dTable.DataTable();
            });

            console.log($scope.territories);
        });
    };

    $scope.getterritories();
});