(function(app){
    var services = angular.module("ImobleServices", ['ngResource']);

    services.factory("Immobiles", ["$resource", "$http", function ($resource, $http) {
        this.resource = $resource (app.config.apiUrl + "/immobile/:id", {}, {
            save : {method : 'POST', params : {id : "@id"}},
            remove : {method : 'DELETE', params : {id : "@id"}},
            update : {method : 'PUT'},
        });

        this.create = function (immobile) {
            return new this.resource(immobile);
        };

        this.get = function (id, callback) {
            return this.resource.get({"id" : id});
        };

        this.query = function (callback) {
            return $http({
                method : 'GET', 
                url : App.config.apiUrl + "/immobile",
            }).then(callback);
        };

        return this;
    }]);

    services.factory("ImmobileItems", ["$resource", "$http", function ($resource, $http) {
        this.resource = $resource (app.config.apiUrl + "/immobile/:immobile/items/:id", {}, {
            get : {method : 'GET', params : {id : "=id", immobile : "@immobile"}},
            save : {method : 'POST', params : {id : "@id", immobile : "@immobile"}},
            remove : {method : 'DELETE', params : {id : "@id", immobile : "@immobile"}},
            update : {method : 'PUT', params : {id : "@id", immobile : "@immobile"}},
        });

        this.create = function (immobileItem) {
            return new this.resource(immobileItem);
        };

        this.get = function (immobile, id, callback) {
            return this.resource.get({"immobile" : immobile, "id" : id});
        };

        return this;
    }]);

    services.factory ("AppService", ["$http", "Immobiles", "ImmobileItems", function($http, Immobiles, ImmobileItems) {
    	var that = this;

        this.registerState = function (key, data) {
            if (App.data.states == undefined)
                App.data.states = {};

            App.data.states[key] = data;
        };

        this.getState = function (key) {
            if (App.data.states == undefined)
                App.data.states = {};

            if (App.data.states.hasOwnProperty(key))
                return App.data.states[key];
            else
                return undefined;
        };

        this.createImmobile = function (immobile) {
            return Immobiles.create(immobile);
        };

        this.createImmobileItem = function (immobileItem) {
            return ImmobileItems.create(immobileItem);
        };

        this.removeImmobile = function (immobile, callback) {
            return immobile.$remove().then(
                function(immobile) {
                    App.removeImmobile(immobile.id);
                    callback (immobile);
                }, 
                function (response) {
                    callback (response.data, response)
                }
            );
        };

        this.removeImmobileItem = function (immobileItem, callback) {
            return immobileItem.$remove().then(
                function(immobileItem) {
                    callback (immobileItem);
                }, 
                function (response) {
                    callback (response.data, response)
                }
            );
        };

        this.saveImmobile = function (immobile, callback) {
            return immobile.$save().then(
                function(immobile) {
                    App.updateImmobile(immobile);
                    callback (immobile);
                }, 
                function (response) {
                    callback (response.data, response)
                }
            );
        };

        this.saveImmobileItem = function (immobileItem, callback) {
            return immobileItem.$save().then(
                function(immobileItem) {
                    callback (immobileItem);
                }, 
                function (response) {
                    callback (response.data, response)
                }
            );
        };

    	this.getImmobile = function (id, callback) {
    		return Immobiles.get(id).$promise.then(function (immobile) {
				App.updateImmobile(immobile);
    			immobile = App.data.immobilesMap[id];

    			callback(immobile);
    		}, function (response) {
                callback(response.data, response)
            });
    	};

        this.getImmobileItem = function (immobile, id, callback) {
            return ImmobileItems.get(immobile, id).$promise.then(function (immobileItem) {
                callback(immobileItem);
            }, function (response) {
                callback(response.data, response)
            });
        };

    	this.getImmobiles = function (callback) {
    		if (App.data.immobiles)
    			callback (App.data.immobiles);

    		Immobiles.query(function(evt) {
    			App.processImmobiles(evt.data);
    			callback (App.data);
    		});
    	};

        this.getImmobileMap = function (callback) {
            if (App.data.immobilesMap) {
                callback (App.data.immobilesMap);
            } else {
                this.getImmobiles (function (immobiles) {
                    return App.data.immobilesMap;
                });
            }
        };

        this.getTypeMap = function () {
            if(!App.data.typeMap) {
                App.data.typeMap = {};
                var types = this.getTypeList();
                for (var key in types) {
                    App.data.typeMap[types[key].id] = types[key];
                }
            }
            return App.data.typeMap;
        };

    	this.getTypeList = function () {
    		if (!App.data.typeList) {
    			App.data.typeList = [
    				{id : "house", icon : "home", plural : "houses"},
    				{id : "building", icon : "building", plural : "buildings"},
    				{id : "subdivision", icon : "tree", plural : "subdivisions"},
    			];
    		}

    		return App.data.typeList;
    	};

    	this.getStatusList = function () {
    		if (!App.data.statusList) {
    			App.data.statusList = [
    				"to_rent", "to_sell", "rented", "selled"
    			];
    		}

    		return App.data.statusList;
    	};

    	this.getStatesList = function () {
    		if (!App.data.states) {
    			App.data.states = [
		            { name: "Acre", id : "AC"},
		            { name: "Alagoas", id : "AL"},
		            { name: "Amapá", id : "AP"},
		            { name: "Amazonas", id : "AM"},
		            { name: "Bahia", id : "BA"},
		            { name: "Ceará", id : "CE"},
		            { name: "Distrito Federal", id : "DF"},  
		            { name: "Espírito Santo", id : "ES"},
		            { name: "Goiás", id : "GO"},
		            { name: "Maranhão", id : "MA"}, 
		            { name: "Mato Grosso", id : "MT"},  
		            { name: "Mato Grosso do Sul", id : "MS"},  
		            { name: "Minas Gerais", id : "MG"},
		            { name: "Pará", id : "PA"},
		            { name: "Paraíba", id : "PB"},
		            { name: "Paraná", id : "PR"},
		            { name: "Pernambuco", id : "PE"},
		            { name: "Piauí", id : "PI"},
		            { name: "Rio de Janeiro", id : "RJ"},
		            { name: "Rio Grande do Norte", id : "RN"},
		            { name: "Rio Grande do Sul", id : "RS"},
		            { name: "Rondônia", id : "RO"},
		            { name: "Roraima", id : "RR"},
		            { name: "Santa Catarina", id : "SC"},
		            { name: "São Paulo", id : "SP"},
		            { name: "Sergipe", id : "SE"},
		            { name: "Tocantins", id : "TO"},
		        ];
    		}

    		return App.data.states;
    	};

	    return this;
	}]);

})(App);