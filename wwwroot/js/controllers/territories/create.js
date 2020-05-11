app.controller('territoryCreateCtrl', function ($scope, $http) {
    $scope.territoryModel = { Latitude: "", Longitude: "", Name: "", Location: "", Region: "", State: "", LocalGovernment: "", Population: 0 };
    $scope.coordinatesDataModel = { RecId: 0, Coordinates: coordinatesArray };
    var localGovernmentsText = '';

    $scope.multiplelga = false;

    $scope.savingTerritory = false;
    $("#processingButton").hide();

    $scope.toggleLgaDropdown = function () {
        if ($scope.multiplelga === true) {
            $scope.result = true;
        } else {
            $scope.result = false;
        }

        console.log($scope.result);
    };


    $scope.getStateName = function () {
        for (var i = 0; i < $scope.states.length - 1; i++) {
            if ($scope.states[i].stateCode === $scope.territoryModel.State) {
                $scope.territoryModel.State = $scope.states[i].state;

                console.log($scope.territoryModel.State);
            }
        }     
    };

    $scope.selection = ['tomatoes', 'mozarella'];

    $scope.verticesCount = function () {
        //alert(coordinatesArray.length);
        //$scope.coordinatesDataModel.RecId = $scope.response.TerritoryInfoRecId;
        //$scope.coordinatesDataModel.Coordinates = coordinatesArray;
        console.log($scope.coordinatesDataModel);
    };

    $scope.successNotification = function (successText) {
        GrowlNotification.notify({
            title: 'Sucesss!',
            description: successText + ' successfully!',
            image: '~/js/plugins/growl-notification/img/success.png',
            type: 'success',
            position: 'top-right',
            closeTimeout: 5000,
            closeWith: 'button'
        });
    };

    $scope.errorNotification = function (errorText) {
        GrowlNotification.notify({
            title: 'Error!',
            description: errorText + ' An error occured..',
            type: 'error',
            position: 'top-right',
            closeTimeout: 5000,
            closeWith: 'button'
        });
    };

    $scope.notEnoughVerticesNotification = function () {
        GrowlNotification.notify({
            title: 'Warning!',
            description: 'You need to draw a shape with at least 3 points...',
            type: 'warning',
            position: 'top-right',
            closeTimeout: 5000,
            closeWith: 'button'
        });
    };

    $scope.yetToSelectLocalGovernment = function () {
        GrowlNotification.notify({
            title: 'Warning!',
            description: 'You are yet to select Local Government(s)...',
            type: 'warning',
            position: 'top-right',
            closeTimeout: 5000,
            closeWith: 'button'
        });
    };

    $scope.arr = function () {
        console.log(coordinatesArray);
    };

    $scope.saveTerritory = function () {
        //processSelectedLgas();

        if ($scope.territoryModel.Population === "") {
            $scope.territoryModel.Population = "0";
        }

        if (coordinatesArray.length <= 2) {
            $scope.notEnoughVerticesNotification();
        } else {
            $scope.getStateName();
            $scope.territoryModel.Latitude = currentLocationLatitude;
            $scope.territoryModel.Longitude = currentLocationLongitude;

            console.log($scope.territoryModel);

            $("#createTerritoryButton").hide();
            $("#processingButton").show();
            setTimeout(function () {
                $http.post(baseUrl + 'territory', $scope.territoryModel).then(function (response) {
                    $scope.response = response.data;
                    $scope.coordinatesDataModel.RecId = $scope.response.territoryInfoRecId;
                    $scope.coordinatesDataModel.Coordinates = coordinatesArray;

                    $http.post(baseUrl + 'territory/savecoordinates', $scope.coordinatesDataModel).then(function (response) {
                        $scope.response = response.data;

                        $("#createTerritoryButton").show();
                        $("#processingButton").hide();

                        $scope.successNotification("Territory created");

                    }, function (response) {
                        $("#createTerritoryButton").show();
                        $("#processingButton").hide();

                            console.log($scope.territoryModel.LocalGovernment);
                        if ($scope.territoryModel.LocalGovernment === "") {
                            $scope.yetToSelectLocalGovernment();
                        } else {
                            $scope.errorNotification("Could not create territory!");
                        }
                    });

                }, function (response) {
                    $("#createTerritoryButton").show();
                    $("#processingButton").hide();
                    $scope.errorNotification("Could not create territory!");
                });

            }, 3000);

        }
    };

    $scope.saveTerritoryCoorrdinates = function () {

        $http.post(baseUrl + 'territory', $scope.territoryModel).then(function (response) {
            $scope.response = response.data;

            $("#createTerritoryButton").show();
            $("#processingButton").hide();

            $scope.successNotification("Territory created");

        }, function (response) {
            $("#createTerritoryButton").show();
            $("#processingButton").hide();
            $scope.errorNotification("Could not create territory!");
        });
    };

    $scope.populateSelectedLgasArray = function () {
        var localGovernmentSelectControl = document.getElementById("localgovernments");
        var selectedLgas = [];
        for (var i = 0; i < localGovernmentSelectControl.length; i++) {
            if (localGovernmentSelectControl.options[i].selected) selectedLgas.push(localGovernmentSelectControl.options[i].value);
        }
        // console.log(selectedLgas);
    };

    $scope.processSelectedLgas = function () {
        console.log($("#localgovernments").val());
        var selectedLgas = $("#localgovernments").val();
        localGovernmentsText = '';

        selectedLgas.forEach(splitLgas);
        function splitLgas(item, index) {
            if (index === 0) {
                localGovernmentsText = localGovernmentsText + item;
            } else {
                localGovernmentsText = localGovernmentsText + ", " + item;
            }
        }
        $scope.territoryModel.LocalGovernment = localGovernmentsText;

        console.log($scope.territoryModel.LocalGovernment);
    };

    $scope.getLocalGovernments = function (stateCode) {
        $http.get(baseUrl + 'lga/stateCode/' + stateCode).then(function (response) {
            $scope.localGovernments = response.data;

            setTimeout(() => {
                $('#localgovernments').multiselect('reload');

                $('#localgovernments').multiselect({
                    search: true,
                    selectAll: true,
                    placeholder: 'Select Local Government(s)',
                    onOptionClick: function (element, option) {
                        var thisOpt = $(option);

                        //alert(
                        //    'The Option "' + thisOpt.val() + '" was '
                        //    + (thisOpt.prop('checked') ? '' : 'de') + 'selected'
                        //);

                        $scope.processSelectedLgas();
                    },
                    onSelectAll: function (element, selected) {
                        if (selected > 0) {
                            $scope.territoryModel.LocalGovernment = "All Local Governments";
                            console.log($scope.territoryModel);
                        }
                    }
                });
            }, 1000);
        });
    };

    $scope.getRegions = function () {
        $http.get(baseUrl + 'regions').then(function (response) {
            $scope.regions = response.data;
        });
    };

    $scope.getStates = function (regionName) {
        $http.get(baseUrl + 'states/region/' + regionName).then(function (response) {
            $scope.states = response.data;
        });
    };

    $scope.hey = function () {
        alert('heytrrr');
    };

    $scope.getRegions();
    //angular.element(document).ready(function () {
    //    $('#localgovernments').multiselect('reload');

    //    $('#localgovernments').multiselect({
    //        search: true,
    //        selectAll: true
    //    });
    //});
});