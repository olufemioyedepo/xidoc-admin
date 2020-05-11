app.controller('territoryMappingCtrl', function ($scope, $http) {
    $("#processingButton").hide();

    $scope.disableMapToTerritory = true;
    $scope.fetchingmappedterritories = true;

    $scope.mappingModel = { State: '', LocalGovernment: '' };
    $scope.employeeIdModel =  { Value: '' };

    $scope.territoryMapModel = { TerritoryRecId: 0, EmployeeId: '' };

    $scope.getEmployeeId = function () {
        urlParts = window.location.href.split('/');
        employeeId = urlParts[5];

        console.log(baseUrl);
        $scope.getEmployeInfo();
    };

    $scope.getEmployeInfo = function () {
        $http.get(baseUrl + "employees/recid/" + employeeId).then(function (response) {
            $scope.employeeData = response.data;
            $scope.employeename = $scope.employeeData.name;
            $scope.personnelnumber = response.data.personnelNumber;

            $scope.employeeIdModel.Value = $scope.personnelnumber;
            $scope.territoryMapModel.EmployeeId = $scope.personnelnumber;
            $scope.email = response.data.primaryContactEmail;
                
            personnelNumber = response.data.personnelNumber;

            document.title = 'Territory Settings for ' + $scope.employeename;
            $scope.employeedataloaded = true;

            $scope.getMappedTerritories();
        });
    };

    $scope.getStates = function () {
        $http.get(baseUrl + 'states/').then(function (response) {
            $scope.states = response.data;
        });
    };

    $scope.getLocalGovernments = function (stateCode) {
        $http.get(baseUrl + 'lga/stateCode/' + stateCode).then(function (response) {
            $scope.localGovernments = response.data;
        });
    };

    $scope.successNotification = function (successText) {
        GrowlNotification.notify({
            title: 'Sucesss!',
            description: successText,
            image: '~/js/plugins/growl-notification/img/success.png',
            type: 'success',
            position: 'top-right',
            closeTimeout: 5000,
            closeWith: 'button'
        });
    };

    $scope.mappingAlreadyExist = function () {
        GrowlNotification.notify({
            title: 'Warning!',
            description: 'It seems ' + $scope.employeename + ' has already been setup as Sales Rep in the selected territory!',
            type: 'warning',
            position: 'top-right',
            closeTimeout: 5000,
            closeWith: 'button'
        });
    };

    $scope.couldNotGetResource = function (text) {
        GrowlNotification.notify({
            title: 'Error!',
            description: text,
            type: 'error',
            position: 'top-right',
            closeTimeout: 5000,
            closeWith: 'button'
        });
    };
    


    $scope.mapRepToTerritory = function () {
        $("#processingButton").show();
        $("#mapSalesRepButton").hide();

        setTimeout(function () {
            $http.post(baseUrl + 'territory/mapsalesrep', $scope.territoryMapModel).then(function (response) {
                $scope.response = response.data;

                $("#processingButton").hide();
                $("#mapSalesRepButton").show();

                if ($scope.response === true) {
                    $scope.successNotification("Territory mapping was sucessful!");

                    $scope.getMappedTerritories();
                } else {
                    $scope.mappingAlreadyExist();
                }

            }, function (response) {
                $("#processingButton").hide();
                $("#mapSalesRepButton").show();
                $scope.errorNotification("Could not create territory!");
            });
        }, 2000);
    };

    $scope.unMapRepFromTerritoryAction = function () {
        $http.post(baseUrl + 'territory/unmapsalesrep', $scope.territoryMapModel).then(function (response) {
            $scope.response = response.data;

            if ($scope.response === true) {
                $scope.successNotification("Sales Rep removed from territory!");

                $("#territoriesPane").LoadingOverlay("hide", true);
                $scope.getMappedTerritories();
            }

        }, function (response) {
            $scope.couldNotGetResource("Could not remove Sales Rep from territory!");
        });
    };

    $scope.getMappedTerritories = function () {
        $scope.fetchingmappedterritories = true;

        setTimeout(function () {
            $http.post(baseUrl + 'territory/getmappedterritories', $scope.employeeIdModel).then(function (response) {
                $scope.mappedTerritories = response.data;
                $scope.fetchingmappedterritories = false;
            }, function (error) {
                $scope.fetchingmappedterritories = false;
                $scope.couldNotGetResource("Could not get territory data!");
            });
        }, 2000);
    };

    $scope.unMapRepFromTerritory = function (territoryRecId) {
        $scope.territoryMapModel.TerritoryRecId = territoryRecId;

        swal({
            title: "Remove?",
            text: "Are you sure you want to remove " + $scope.employeeData.name + " from this territory?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Remove",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.value) {
                $("#territoriesPane").LoadingOverlay("show", {
                    background: "rgba(165, 190, 100, 0.5)"
                });

                setTimeout(function () {
                    $scope.unMapRepFromTerritoryAction();
                }, 2000);
            }
        });
    };

    $scope.getTerritoriesByLga = function (localGovernment) {
        var e = document.getElementById("stateDropdown");
        var state = e.options[e.selectedIndex].text;

        $http.get(baseUrl + 'territory/bystatelocalgovernment/' + state + '/' + localGovernment).then(function (response) {
            $scope.territories = response.data;

            if ($scope.territories.length > 0) {
                $scope.disableMapToTerritory = false;
            } else {
                $scope.disableMapToTerritory = true;
            }
        });
    };

    $scope.getEmployeeId();
    $scope.getStates();
});