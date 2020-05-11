app.controller('utilCtrl', function ($scope, $http) {

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
});