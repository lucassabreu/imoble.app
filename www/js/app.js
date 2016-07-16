var App = {
    data : {},
    config : {},
    angular : {
        app : null,
    },

    removeImmobile : function (immobileId) {
        if (App.data.immobilesMap) {
            var immobile = App.data.immobilesMap[immobileId];
            App.data.immobilesMap[immobileId] = undefined;
            if (App.data.immobiles.has(immobile)) {
                App.data.immobiles.remove(immobile);
            }
        }
    },

    updateImmobile : function (immobile) {
        immobile.value = window.parseFloat(immobile.value);

        if (!App.data.immobilesMap) {
            App.data.immobilesMap = {};
            App.data.immobiles = [];
        }

        if (!App.data.immobilesMap.hasOwnProperty(immobile.id)) {
            App.data.immobilesMap[immobile.id] = immobile;
            App.data.immobiles.push(App.data.immobilesMap[immobile.id]);
        } else {
            App.copyTo(immobile, App.data.immobilesMap[immobile.id]);

            this.processItems(App.data.immobilesMap[immobile.id]);
        }
    },

    processImmobiles : function (immobiles) {
        if(App.data.immobiles)
            App.data.immobiles.clear();
        else
            App.data.immobiles = [];

        if(App.data.cities)
            App.data.cities.clear();
        else
            App.data.cities = [];

        if (App.data.immobilesMap) {
            for(var key in App.data.immobilesMap)
                App.data.immobilesMap[key] = undefined;
        } else {
            App.data.immobilesMap = {};
        }

        var cities = [];

        for(var key in immobiles) {

            if (!cities.has((immobiles[key].city + "|" + immobiles[key].state).toUpperCase())) {
                cities.push((immobiles[key].city + "|" + immobiles[key].state).toUpperCase());
                App.data.cities.push({
                    city : immobiles[key].city.toUpperCase(),
                    state : immobiles[key].state.toUpperCase(),
                });
            }

            immobiles[key].value = window.parseFloat(immobiles[key].value);

            App.data.immobiles.push(immobiles[key]);
            App.data.immobilesMap[immobiles[key].id] = immobiles[key];

            this.processItems(immobiles[key]);
        }

        App.data.immobiles.sort(function (e1, e2) {
            if (e1.name < e2.name) 
                return -1;
            else
                return 1;
        });
    },

    processItems : function (immobile) {
        immobile.itemsMap = {};

        for(var i in immobile.items) {
            immobile.itemsMap[immobile.items[i].id] = immobile.items[i];
        }

        immobile.items.sort(function (e1, e2) {
            if (e1.name < e2.name) 
                return -1;
            else
                return 1;
        });
    },

    getJSON : function (url) {
        return JSON.parse(
            jQuery.ajax ({
                "url" : url,
                "async" : false,
            }).responseText
        );
    },

    copyTo : function (from, to) {
        for(var prop in from) {
            to[prop] = from[prop];
        }
    },

    onReady : function (event) {

        if(window.StatusBar) {
          // Set the statusbar to use the default style, tweak this to
          // remove the status bar on iOS or change it to use white instead of dark colors.
          StatusBar.styleDefault();
        }

        // copy the config
        if (window.cordova)
            App.copyTo({"apiUrl" : "http://192.168.42.15/server/api"}, App.config);
        else
            App.copyTo({"apiUrl" : "http://localhost/server/api"}, App.config);

        // start angularjs
        App.angular.app = angular.module("ImobleApp", [
            "ImobleControllers", 
            "ImobleServices", 
            "ImobleDirectives", 
            "ngRoute",
            "pascalprecht.translate",
            "angular-materialize",
            "hmTouchEvents"
        ]);

        App.angular.app.config(['$translateProvider',
            function ($translateProvider) {
                var languages = App.getJSON("resources/translations.json");
                for(var language in languages) {
                    $translateProvider.translations(language, languages[language]);
                }

                $translateProvider.useSanitizeValueStrategy('escape');
                $translateProvider.preferredLanguage('pt-BR');
            }
        ]);

        App.angular.app.config(['$routeProvider', 
            function ($routeProvider) {
                $routeProvider
                .when('/main', {
                    templateUrl : "view/main.html",
                    controller: "ImobleMainCtrl"
                })
                .when('/settings', {
                    templateUrl : "view/settings.html",
                    controller: "ImobleSettingsCtrl"
                })
                .when('/search', {
                    templateUrl : "view/search.html",
                    controller : "ImobleSearchCtrl"
                })
                .when('/immobile/:id', {
                    templateUrl : "view/immobile.html",
                    controller : "ImobleDetailCtrl",
                })
                .when('/immobile/:id/edit', {
                    templateUrl : "view/edit.html",
                    controller : "ImobleEditCtrl",
                })
                .when('/add', {
                    templateUrl : "view/edit.html",
                    controller : "ImobleEditCtrl",
                })
                .when('/immobile/:id/items', {
                    templateUrl : "view/items.html",
                    controller : "ImobleItemListCtrl",
                })
                .when('/immobile/:id/items/add', {
                    templateUrl : "view/item-edit.html",
                    controller : "ImobleItemEditCtrl",
                })
                .when('/immobile/:id/items/add-many', {
                    templateUrl : "view/item-add-many.html",
                    controller : "ImobleItemAddManyCtrl",
                })
                .when('/immobile/:id/items/:itemId', {
                    templateUrl : "view/immobile-item.html",
                    controller : "ImobleItemDetailCtrl",
                })
                .when('/immobile/:id/items/:itemId/edit', {
                    templateUrl : "view/item-edit.html",
                    controller : "ImobleItemEditCtrl",
                })
                .otherwise({
                    redirectTo : "/main",
                });
            }
        ]);

        angular.bootstrap(document, ["ImobleApp"]);
    },

    initialize : function () {
        var that = this;
        window.addEventListener('load', function(evt) {
            that.onReady(evt)
        }, false);
    },
};

App.initialize();