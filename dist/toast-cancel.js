;(function () {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Modules

    var moduleName = 'idappsToastCancel';
    var moduleDeps = [];

    angular.module(moduleName, moduleDeps)
        .provider('toastCancel', toastCancelProvider);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Type : Configuration

    /**
     * @typedef {{
     *     do : {
     *         handler : function():Promise,
     *         then    : Toast,
     *         catch   : Toast
     *     },
     *     undo : {
     *         handler : function():Promise,
     *         then    : Toast,
     *         catch   : Toast
     *     }
     * }}
     */
    var Configuration;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Type : Configuration

    /**
     * @typedef {{
     *     text     : string,
     *     action   : string?,
     *     position : string?,
     *     theme    : string?
     * }}
     */
    var Toast;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Provider : toastCancel

    function toastCancelProvider() {
        var toastCancelProvider = {};

        /**
         * Toast module to use
         * @type {string}
         */
        var module = 'angular-material';

        ////////// API

        $get.$inject = [
            '$injector'
        ];
        /**
         * Angular provider $get implementation
         * @returns {function(Configuration):Promise}
         */
        function $get($injector) {
            switch (module) {
                case 'angular-material' :
                    return getToastServiceAngularMaterial($injector.get('$mdToast'));
                default :
                    return function () {};
            }
        }
        toastCancelProvider.$get = $get;

        /**
         * Set the toast module to use
         * @param {string} usedToastModule
         */
        toastCancelProvider.useToastModule = function (usedToastModule) {
            module = usedToastModule;
        };

        return toastCancelProvider;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Service : toastService

    /**
     * Service to be injected through dependency injection
     * @param {$mdToast} $mdToast
     */
    function getToastServiceAngularMaterial($mdToast) {
        /**
         * @param {Configuration} config
         */
        return function (configuration) {
            var doThenToast = new ToastAngularMaterial($mdToast, configuration.do.then);
            var doCatchToast = new ToastAngularMaterial($mdToast, configuration.do.catch);
            var undoThenToast = new ToastAngularMaterial($mdToast, configuration.undo.then);
            var undoCatchToast = new ToastAngularMaterial($mdToast, configuration.undo.catch);

            return executeDo();

            ////////// Private

            /**
             * Execute the configuration.do.handler method which return a Promise
             * @returns {Promise}
             */
            function executeDo() {
                return /** @type {Promise} */(configuration.do.handler())
                    .then(function () {
                        console.log('show doThenToast', doThenToast);
                        $mdToast.show(doThenToast)
                            .then(function (response) {
                                if (response === 'ok') {
                                    executeUndo();
                                }
                            });
                    })
                    .catch(function () {
                        console.log('show doCatchToast', doCatchToast);
                        $mdToast.show(doCatchToast)
                            .then(function (response) {
                                if (response === 'ok') {
                                    executeDo();
                                }
                            });
                    });
            }

            /**
             * Execute the configuration.undo.handler method which cancel the configuration.do.handler method
             */
            function executeUndo() {
                return /** @type {Promise} */(configuration.undo.handler())
                    .then(function () {
                        $mdToast.show(undoThenToast)
                            .then(function (response) {
                                if (response === 'ok') {
                                    executeDo();
                                }
                            });
                    })
                    .catch(function () {
                        $mdToast.show(undoCatchToast)
                            .then(function (response) {
                                if (response === 'ok') {
                                    executeUndo();
                                }
                            });
                    });
            }
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Toast : Angular Material

    /**
     * @param {$mdToast} $mdToast
     * @param {Toast} toast
     * @constructor
     */
    function ToastAngularMaterial($mdToast, toast) {
        var simple = $mdToast.simple();
        simple.textContent(toast.text);
        toast.action && simple.action(toast.action);
        toast.position && simple.position(toast.position);
        toast.theme && simple.theme(toast.theme);
        return simple;
    }

})();