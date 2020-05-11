app.controller('territoryDetailsCtrl', function ($scope, $http) {
    $('.selected-items-box').bind('click', function (e) {
        $('.wrapper .list').slideToggle('fast');
    });

    var territoryRecId = '';
    var urlParts = [];

    $scope.territoryMapModel = { TerritoryRecId: 0, EmployeeId: '' };

    $scope.getTerritoryId = function () {
        urlParts = window.location.href.split('/');
        territoryRecId = urlParts[5];

        //console.log(territoryRecId);
        $scope.getEmployeesInTerritory(territoryRecId);
        
        $scope.getTerritoryInfo();
    };

    $scope.getEmployeesInTerritory = function (territoryRecId) {
        $http.get(baseUrl + "territory/salesreps/" + territoryRecId).then(function (response) {
            $scope.employees = response.data;
        });
    };

    $scope.getTerritoryCoordinates = function (territoryRecId) {
        $http.get(baseUrl + "territory/coordinatesbyrecId/" + territoryRecId).then(function (response) {
            $scope.coordinates = response.data;

            for (var i = 0; i < $scope.coordinates.length; i++) {
                var coordinatePoint = { lat: parseFloat($scope.coordinates[i].latitude), lng: parseFloat($scope.coordinates[i].longitude) };
                coordinatesArray.push(coordinatePoint);
            }

            initMap();
            console.log(coordinatesArray);
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

    $scope.unMapRepFromTerritoryAction = function () {
        $http.post(baseUrl + 'territory/unmapsalesrep', $scope.territoryMapModel).then(function (response) {
            $scope.response = response.data;

            if ($scope.response === true) {
                $scope.successNotification("Sales Rep removed from territory!");

                $("#employeesPane").LoadingOverlay("hide", true);
                $scope.getEmployeesInTerritory(territoryRecId);
            }

        }, function (response) {
            $scope.couldNotGetResource("Could not remove Sales Rep from territory!");
        });
    };

    $scope.unMapRepFromTerritory = function (employeeId, employeeName) {
        $scope.territoryMapModel.EmployeeId = employeeId;
        $scope.territoryMapModel.TerritoryRecId = territoryRecId;

        swal({
            title: "Remove?",
            text: "Are you sure you want to remove " + employeeName + " from this territory?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Remove",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.value) {
                $("#employeesPane").LoadingOverlay("show", {
                    background: "rgba(165, 190, 100, 0.5)"
                });

                setTimeout(function () {
                    $scope.unMapRepFromTerritoryAction();
                }, 2000);
            }
        });
    };

    $scope.getTerritoryInfo = function () {
        $http.get(baseUrl + "territory/recId/" + territoryRecId).then(function (response) {
            $scope.territoryData = response.data[0];
            $scope.territoryName = $scope.territoryData.name;
            $scope.territoryLga = $scope.territoryData.localGovernment;
            $scope.territoryState = $scope.territoryData.state;

            territoryLatitude = parseFloat($scope.territoryData.latitude);
            territoryLongitude = parseFloat($scope.territoryData.longitude);
            territoryName = $scope.territoryName;

            $scope.territorydataloaded = true;
            document.title = $scope.territoryName + " Details";

            $scope.getTerritoryCoordinates(territoryRecId);
        });
    };

    $scope.friends = [
        { name: 'All LGAs' },
        { name: 'Lucky' },
        { name: 'Yoga'  },
        { name: 'Fauzan' },
        { name: 'Cecep' },
        { name: 'Nurjaman' },
        { name: 'Asti' }
    ];

    

    $scope.getSelectedItems = function (item) {
        return item.selected;
    };

    $scope.checkAction = function (item) {
        console.log(item);

        if (item.name === 'All LGAs') {
            $scope.toggleAllLgaSelection();
        } else {
            for (var i = 0; i < $scope.friends.length; i++) {
                if ($scope.friends[i].name === item.name) {
                    $scope.friends[i].selected = true;
                    //$scope.friendsSelection = $scope.friendsSelection + $scope.friends[i].name + ', ';
                }
            }
        }

        
        

    };

    $scope.toggleAllLgaSelection = function () {
        $scope.friendsSelection = '';

        if ($scope.alllocalgvt === true) {
            for (var i = 0; i < $scope.friends.length; i++) {
                $scope.friends[i].selected = true;
                $scope.friendsSelection = $scope.friendsSelection + $scope.friends[i].name + ', ';
            }
        } else {
            for (var j = 0; j < $scope.friends.length; j++) {
                $scope.friends[j].selected = false;
            }
        }
        console.log($scope.friendsSelection);

        // console.log('sdsdsd');
    };

    $scope.getTerritoryId();
    
    
});


