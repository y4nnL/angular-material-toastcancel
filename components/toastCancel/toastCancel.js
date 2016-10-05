////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Modules

var moduleName = 'toastCancel';
var moduleDeps = [
    // Vendors
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'ngMessages',
    // Components
    'idappsToastCancel'
];

angular.module(moduleName, moduleDeps)
    .config(configToastCancel)
    .controller('ToastCancelController', ToastCancelController);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Config : configToastCancel

configToastCancel.$inject = [
    'toastCancelProvider'
];
function configToastCancel(toastCancelProvider) {
    toastCancelProvider.useToastModule('angular-material');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Controller : ToastCancel

ToastCancelController.$inject = [
    '$scope',
    '$timeout',
    '$q',
    'toastCancel'
];
function ToastCancelController($scope, $timeout, $q, toastCancel) {
    ////////// API

    /**
     * Start the toast test
     */
    $scope.do = function () {
        toastCancel({
            do   : {
                handler : doHandler,
                then    : {text : 'DO : Success!', action : 'cancel DO'},
                catch   : {text : 'DO : Error!', action : 'redo DO'}
            },
            undo : {
                handler : undoHandler,
                then    : {text : 'UNDO : Success!', action : 'cancel UNDO'},
                catch   : {text : 'UNDO : Error!', action : 'redo UNDO'}
            }
        });
    };

    /**
     * @type {string}
     */
    $scope.state = '?';

    ////////// Private

    function doHandler() {
        var success = Math.random() * 2 >= 1;
        var defer   = $q.defer();
        $timeout(function () {
            if (success) {
                $scope.state = 'DO!';
                defer.resolve();
            } else {
                defer.reject();
            }
        }, 1000);
        return defer.promise;
    }

    function undoHandler() {
        var success = Math.random() * 2 >= 1;
        var defer   = $q.defer();
        $timeout(function () {
            if (success) {
                $scope.state = 'UNDO!';
                defer.resolve();
            } else {
                defer.reject();
            }
        }, 1000);
        return defer.promise;
    }
}

