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
     *     do        : function():Promise,
     *     undo      : function():Promise,
     *     i18n      : string?,
     *     position  : string?,
     *     class     : string?,
     *     delay     : number,
     *     translate : boolean,
     *     doThen    : Toast?,
     *     doCatch   : Toast?,
     *     undoThen  : Toast?,
     *     undoCatch : Toast?
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
     *     class    : string?,
     *     delay    : number?
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
        var usedToastModule = '';

        /**
         * Translate filter to use for toasts
         * @type {string}
         */
        var usedTranslateFilter = '';

        ////////// API

        $get.$inject = [
            '$injector',
            '$q',
            '$filter'
        ];
        /**
         * Angular provider $get implementation
         * @returns {function(Configuration):{do : function:Promise, undo : function:Promise}}
         */
        function $get($injector, $q, $filter) {
            /**
             * Dummy promise for missing do/undo handlers
             * @type {Promise}
             */
            var dummyPromise = $q.when(null);

            /**
             * Angular filter to translate toasts
             * @type {function(string):string}
             */
            var translateFilter = usedTranslateFilter ? $filter(usedTranslateFilter) : angular.identity;

            switch (usedToastModule) {
                case 'angular-material' :

                    ////////////////////////////////////////////////////////////////////////////////////////////////////
                    // Service for angular material

                    return function (configuration) {
                        var fullConfiguration = makeConfiguration(dummyPromise, configuration);

                        /**
                         * Angular material toast service
                         */
                        var $mdToast = $injector.get('$mdToast');

                        /*
                         * Toasts to show
                         */
                        var doThenToast    = createToast(fullConfiguration.doThen);
                        var doCatchToast   = createToast(fullConfiguration.doCatch);
                        var undoThenToast  = createToast(fullConfiguration.undoThen);
                        var undoCatchToast = createToast(fullConfiguration.undoCatch);

                        return {
                            do   : angular.identity(executeDo),
                            undo : angular.identity(executeUndo)
                        };

                        ////////// Private

                        /**
                         * Execute the configuration.do.handler method which return a Promise
                         * @returns {Promise}
                         */
                        function executeDo() {
                            return /** @type {Promise} */(configuration.do())
                                .then(function () {
                                    $mdToast.show(doThenToast)
                                        .then(function (response) {
                                            if (response === 'ok') {
                                                executeUndo();
                                            }
                                        });
                                })
                                .catch(function () {
                                    $mdToast.show(doCatchToast)
                                        .then(function (response) {
                                            if (response === 'ok') {
                                                executeDo();
                                            }
                                        });
                                });
                        }

                        /**
                         * Execute the configuration.undo.handler method which cancel the configuration.do.handler
                         * method
                         */
                        function executeUndo() {
                            return /** @type {Promise} */(configuration.undo())
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

                        /**
                         * @param {Toast} toast
                         */
                        function createToast(toast) {
                            var simpleToast = $mdToast.simple();
                            if (toast.text) {
                                var text = fullConfiguration.translate ? translateFilter(toast.text) : toast.text;
                                simpleToast.textContent(text);
                            }
                            if (toast.action) {
                                var action = fullConfiguration.translate ? translateFilter(toast.action) : toast.action;
                                simpleToast.action(action);
                            }
                            if (toast.position) {
                                simpleToast.position(toast.position);
                            }
                            if (toast.class) {
                                simpleToast.theme(toast.class);
                            }
                            if (toast.delay) {
                                simpleToast.hideDelay(toast.delay);
                            }
                            return simpleToast;
                        }
                    };

                default :
                    return function () {
                        return {
                            do   : angular.identity(dummyPromise),
                            undo : angular.identity(dummyPromise)
                        };
                    };
            }
        }

        toastCancelProvider.$get = $get;

        /**
         * Set default configuration options
         * @param {Configuration} configuration
         */
        toastCancelProvider.defaultConfiguration = function (configuration) {
            angular.extend(makeConfiguration.defaults, configuration);
        };

        /**
         * Set the toast module to use
         * @param {string} toastModule
         */
        toastCancelProvider.useToastModule = function (toastModule) {
            usedToastModule = toastModule;
        };

        /**
         * Set the translate filter to use
         * @param {string} translateFilter
         */
        toastCancelProvider.useTranslateFilter = function (translateFilter) {
            usedTranslateFilter = translateFilter;
        };

        return toastCancelProvider;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Private

    makeConfiguration.defaults = {
        i18n      : '',
        position  : '',
        class     : '',
        delay     : 0,
        doThen    : {
            text     : '',
            action   : '',
            position : '',
            class    : '',
            delay    : 0
        },
        doCatch   : {
            text     : '',
            action   : '',
            position : '',
            class    : '',
            delay    : 0
        },
        undoThen  : {
            text     : '',
            action   : '',
            position : '',
            class    : '',
            delay    : 0
        },
        undoCatch : {
            text     : '',
            action   : '',
            position : '',
            class    : '',
            delay    : 0
        }
    };
    /**
     * Set all the configuration options to their defaults
     * @param {Promise} promise
     * @param {Configuration} configuration
     * @returns {*}
     */
    function makeConfiguration(promise, configuration) {
        var madeConfiguration = angular.extend({
            do   : angular.identity(promise),
            undo : angular.identity(promise)
        }, makeConfiguration.defaults, configuration);

        if (madeConfiguration.i18n) {
            madeConfiguration.doThen.text      = madeConfiguration.i18n + '.doThenText';
            madeConfiguration.doCatch.text     = madeConfiguration.i18n + '.doCatchText';
            madeConfiguration.undoThen.text    = madeConfiguration.i18n + '.undoThenText';
            madeConfiguration.undoCatch.text   = madeConfiguration.i18n + '.undoCatchText';
            madeConfiguration.doThen.action    = madeConfiguration.i18n + '.doThenAction';
            madeConfiguration.doCatch.action   = madeConfiguration.i18n + '.doCatchAction';
            madeConfiguration.undoThen.action  = madeConfiguration.i18n + '.undoThenAction';
            madeConfiguration.undoCatch.action = madeConfiguration.i18n + '.undoCatchAction';
        }

        if (madeConfiguration.position) {
            madeConfiguration.doThen.position    = madeConfiguration.position;
            madeConfiguration.doCatch.position   = madeConfiguration.position;
            madeConfiguration.undoThen.position  = madeConfiguration.position;
            madeConfiguration.undoCatch.position = madeConfiguration.position;
        }

        if (madeConfiguration.class) {
            madeConfiguration.doThen.class    = madeConfiguration.class;
            madeConfiguration.doCatch.class   = madeConfiguration.class;
            madeConfiguration.undoThen.class  = madeConfiguration.class;
            madeConfiguration.undoCatch.class = madeConfiguration.class;
        }

        if (madeConfiguration.delay > 0) {
            madeConfiguration.doThen.delay    = madeConfiguration.delay;
            madeConfiguration.doCatch.delay   = madeConfiguration.delay;
            madeConfiguration.undoThen.delay  = madeConfiguration.delay;
            madeConfiguration.undoCatch.delay = madeConfiguration.delay;
        }

        return madeConfiguration;
    }

})();