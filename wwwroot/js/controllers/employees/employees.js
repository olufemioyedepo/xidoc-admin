app.controller('employeesListCtrl', function ($scope, $http) {

    $scope.getEmployees = function () {
        $http.get("https://geofencingwebapi20191030062137.azurewebsites.net/api/employees").then(function (response) {
            $scope.employees = response.data;
            //$('#myTable').DataTable().clear().destroy();
            //$('#sampleTable').DataTable();

            //$('#sampleTable').DataTable();
            angular.element(document).ready(function () {
                dTable = $('#sampleTable');
                dTable.DataTable();
            });
            //$('#sampleTable').dataTable();//.fnClearTable();
            console.log($scope.employees);
        });
    };

    $scope.unMapSalesRep = function (employeeName, personnelNumber) {
        var obj = { 'personnelNumber': personnelNumber };

        swal({
            title: "Remove?",
            text: "Are you sure you want to remove " + employeeName + " (" + personnelNumber + ") as Sales Rep?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Remove",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.value) {
                $.LoadingOverlay("show");

                setTimeout(function () {

                    $http.post('https://geofencingwebapi20191030062137.azurewebsites.net/api/Employees/removeasagent', obj).then(function (response) {

                        $.LoadingOverlay("hide");

                        swal({
                            title: "Success",
                            text: employeeName + " has been removed as a Sales Rep",
                            type: "warning",
                            confirmButtonText: "Ok"
                        }).then((result) => {
                            if (result.value) {
                                window.location.href = '/employees';
                            }
                        });


                    }, function (response) {
                        alert('an error occured');
                    });

                }, 3000);
                
            }
        });  
    };

    $scope.showOverlay = function(name, personnelNumber) {
        // Hide it after 3 seconds
        //setTimeout(function () {
        //    $scope.unMapSalesRep(name, personnelNumber);
        //}, 3000);
    };

    function removeSalesAgent(personnelNumber, employeeName) {
        alert('hey');
    }

    $scope.getEmployees();

});