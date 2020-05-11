app.controller('employeesDetailsCtrl', function ($scope, $http) {
    var urlParts = [];
    var employeeId;
    var personnelNumber;
    $scope.locationDetails = { Address: '', LocationLongitude: 0, LocationLatitide: 0 };
    $scope.locations = [];
    var locationsJs = [];
    $scope.locationsReversed = [];

    $scope.getEmployeeId = function () {
        urlParts = window.location.href.split('/');
        employeeId = urlParts[4];

        console.log(baseUrl);
        $scope.getEmployeInfo();
    };

    $scope.getEmployeInfo = function () {
        $http.get(baseUrl + "employees/recid/" + employeeId).then(function (response) {
            $scope.employeeData = response.data;
            $scope.employeename = $scope.employeeData.name;
            $scope.personnelnumber = response.data.personnelNumber;
            personnelNumber = response.data.personnelNumber;

            document.title = 'Set ' + $scope.employeename + " (" + $scope.personnelnumber + ") as Sales Rep";

            $scope.employeedataloaded = true;
        });
    };

    $scope.drawCoveragePolygon = function (locations) {
        setPolygonCoordinates(locations);
    };

    $scope.addToLocationList = function () {
        var fullAddress = $('#formattedaddress').val();
        var latitude = $('#latitude').val();
        var longitude = $('#longitude').val();

        $scope.locationDetails = { Address: fullAddress, LocationLongitude: longitude, LocationLatitide: latitude };
        $scope.locations.push($scope.locationDetails);
        locationsJs.push($scope.locationDetails);
        $scope.locationsReversed = [];
        console.log($scope.locations.length);


        $scope.locationsReversed = locationsJs.reverse();

        console.log($scope.locationsReversed);
    };

    $scope.getEmployeeId();
});