////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Modules

var moduleName = 'toastCancel';
var moduleDeps = [
    // Vendors
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'ngMessages',
    'pascalprecht.translate',
    // Components
    'idappsToastCancel'
];

angular.module(moduleName, moduleDeps)
    .config(configToastCancel)
    .config(configTranslate)
    .controller('ToastCancelController', ToastCancelController);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Config : ToastCancel

configToastCancel.$inject = [
    'toastCancelProvider'
];
function configToastCancel(toastCancelProvider) {
    toastCancelProvider.useToastModule('angular-material');
    toastCancelProvider.useTranslateFilter('translate');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Config : Translate

configTranslate.$inject = [
    '$translateProvider'
];
function configTranslate($translateProvider) {
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy();
    $translateProvider.translations('en', {
        toastCancel : {
            toasts : {
                test : {
                    doThenText      : 'DO success',
                    doThenAction    : 'Cancel',
                    doCatchText     : 'DO error',
                    doCatchAction   : 'Redo',
                    undoThenText    : 'UNDO success',
                    undoThenAction  : 'Cancel',
                    undoCatchText   : 'UNDO error',
                    undoCatchAction : 'Redo'
                }
            }
        }
    });
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
            do        : doHandler,
            undo      : undoHandler,
            i18n      : 'toastCancel.toasts.test',
            translate : true,
            position  : 'top right',
            delay     : 6000,
            doCatch   : {
                class : 'error'
            },
            undoCatch : {
                class : 'error'
            }
        }).do();
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
        }, 500);
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
        }, 500);
        return defer.promise;
    }
}

