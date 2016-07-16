(function(App) {
    var controllers = angular.module("ImobleControllers", []);

    controllers.controller("ImobleSettingsCtrl", [
        "$scope", function ($scope) {
            $scope.back = function () {
                history.back();
            };            
        }
    ]); 

    controllers.controller("ImobleItemAddManyCtrl", [
        "$scope", "$routeParams", "AppService", "$translate",
        function ($scope, $routeParams, AppService, $translate) {

            $scope.stateList = AppService.getStatesList();
            $scope.typeList = AppService.getTypeList();
            $scope.statusList = AppService.getStatusList();

            $scope.immobile = undefined;
            $scope.data = {
                itemStatus : $scope.statusList[0],
            };

            if ($routeParams.id) {
                AppService.getImmobile ($routeParams.id, function (immobile, response) {
                    if (response) {
                        Materialize.toast($translate.instant("immobile_not_found"), 5000);
                        history.back();
                    } else {
                        $scope.immobile = immobile;
                    }
                });
            } else {
                Materialize.toast($translate.instant("immobile_not_found"), 5000);
                history.back();
            }

            $scope.getIcon = function(type) {
                return $scope.types[type].icon;
            };

            $scope.confirm = function () {
                $scope.data.endNumber = parseInt($scope.data.endNumber);
                $scope.data.startNumber = parseInt($scope.data.startNumber);

                if (!$scope.data.startNumber || $scope.data.startNumber == 0) {
                    Materialize.toast($translate.instant("start_number_must_be_more_than_zero"), 5000);
                    return;
                }

                if (!$scope.data.endNumber || $scope.data.endNumber == 0) {
                    Materialize.toast($translate.instant("end_number_must_be_more_than_zero"), 5000);
                    return;
                }

                if ($scope.data.startNumber > $scope.data.endNumber) {
                    Materialize.toast($translate.instant("start_number_bigger_than_end_number"), 5000);
                    return;
                }

                var length = new String($scope.data.endNumber).length;

                for (var i =  $scope.data.startNumber; 
                         i <= $scope.data.endNumber; i++) {

                    var immobileItem = AppService.createImmobileItem ({
                        name : $scope.data.itemPrefix + i.formatToFixedInteger(length),
                        immobile : $routeParams.id,
                        status : $scope.data.itemStatus,
                        description : $scope.data.itemDescription
                    });

                    AppService.saveImmobileItem(immobileItem, function (data, response) {
                        if (response) {
                            if (response.status === 403) { // forbidden
                                Materialize.toast(data.error.msg, 5000);
                            }
                        }
                    });
                }
                history.back();
            };

            $scope.cancel = function () {
                history.back();
            };
        }
    ]);

    controllers.controller("ImobleItemEditCtrl", [
        "$scope", "$routeParams", "AppService", "$translate",
        function ($scope, $routeParams, AppService, $translate) {

            $scope.stateList = AppService.getStatesList();
            $scope.typeList = AppService.getTypeList();
            $scope.statusList = AppService.getStatusList();

            $scope.immobileItem = undefined;

            if ($routeParams.id && $routeParams.itemId) {
                $scope.editing = true;
                AppService.getImmobileItem ($routeParams.id, $routeParams.itemId, 
                    function (immobileItem, response) {
                        if (response) {
                            Materialize.toast($translate.instant("immobile_not_found"), 5000);
                            history.back();
                        } else {
                            $scope.immobileItem = immobileItem;
                        }
                    }
                );
            } else {
                $scope.editing = false;
                if (App.data.immobilesMap && App.data.immobilesMap[$routeParams.id]) {
                    $scope.immobileItem = AppService.createImmobileItem({
                        immobile : App.data.immobilesMap[$routeParams.id].id,
                        status : $scope.statusList[0],
                    });
                } else {
                    $scope.immobileItem = AppService.createImmobileItem({
                        immobile : $routeParams.id,
                        status : $scope.statusList[0],
                    });
                }
            }

            $scope.getIcon = function(type) {
                return $scope.types[type].icon;
            };

            $scope.confirm = function () {
                AppService.saveImmobileItem($scope.immobileItem, function (data, response) {
                    if (response) {
                        if (response.status === 403) { // forbidden
                            Materialize.toast(data.error.msg, 5000);
                        }
                    } else {
                        Materialize.toast($translate.instant("immobile_item_saved", {name : data.name}), 5000);
                        history.back();
                    }
                });
            };

            $scope.cancel = function () {
                history.back();
            };

            $scope.remove = function(){
                AppService.removeImmobileItem ($scope.immobileItem, function(data, response) {
                    if (response) {
                        if (response.status == 404)
                            Materialize.toast($translate.instant('immobile_item_not_found'), 5000);
                        else
                            Materialize.toast(response.error.msg, 5000);
                    } else {
                        Materialize.toast($translate.instant('immobile_item_removed'), 5000);
                        history.back();
                    }
                });
            };
        }
    ]);

    controllers.controller("ImobleItemDetailCtrl", [
        "$scope", "$routeParams", "AppService", "$translate",
        function ($scope, $routeParams, AppService, $translate) {

            $scope.statusList = AppService.getStatusList();

            $scope.immobileItem = undefined;

            if ($routeParams.id && $routeParams.itemId) {
                AppService.getImmobileItem ($routeParams.id, $routeParams.itemId, 
                    function (immobileItem, response) {
                        if (response) {
                            Materialize.toast($translate.instant("immobile_item_not_found"), 5000);
                            history.back();
                        } else {
                            $scope.immobileItem = immobileItem;
                        }
                    }
                );
            } else {
                history.back();
            }

            $scope.back = function () {
                history.back();
            };

            $scope.remove = function(){
                AppService.removeImmobileItem ($scope.immobileItem, function(data, response) {
                    if (response) {
                        if (response.status == 404)
                            Materialize.toast($translate.instant('immobile_item_not_found'), 5000);
                        else
                            Materialize.toast(response.error.msg, 5000);
                    } else {
                        Materialize.toast($translate.instant('immobile_item_removed'), 5000);
                        history.back();
                    }
                });
            };
        }
    ]);

    controllers.controller("ImobleItemListCtrl", [
        "$scope", "$routeParams", "AppService", "$translate",
        function ($scope, $routeParams, AppService, $translate) {

            $scope.immobileId = ($routeParams.id ? $routeParams.id : '').trim();

            if ($scope.immobileId == '') {
                location.href = "#/main";
                return;
            }

            if ($routeParams.id) {
                $scope.immobile = undefined;
                AppService.getImmobile ($routeParams.id, function (immobile, response) {
                    if (response) {
                        Materialize.toast($translate.instant("immobile_not_found"), 5000);
                        $scope.back();
                    } else {
                        $scope.immobile = immobile;
                        $scope.immobile.items.sort(function (e1, e2) {
                            if(e1.name < e2.name) 
                                return -1;
                            else
                                return 1;
                        });
                        $scope.immobileItemsList = undefined;
                    }
                });
            }

            $scope.immobileItemsList = undefined;
            $scope.currentView = 0;
            $scope.statusList = AppService.getStatusList();
            $scope.selected = [];

            $scope.select = function (immobileItem) {
                immobileItem.selected = !immobileItem.selected;

                if (immobileItem.selected) {
                    $scope.selected.push(immobileItem);
                } else {
                    $scope.selected = $scope.selected.filter(function(e) {
                        return e.selected;
                    });
                }
            };

            $scope.edit = function (immobileItem) {
                location.href = "#/immobile/" + immobileItem.immobile + "/items/" + immobileItem.id;
            };

            $scope.back = function () {
                history.back();
            };

            $scope.getListImmobileItems = function (status){
                if ($scope.immobileItemsList === undefined) {
                    $scope.immobileItemsList = [];

                    for(var key in $scope.statusList) {
                        $scope.immobileItemsList[$scope.statusList[key]] = [];
                    }
                    
                    if ($scope.immobile !== undefined) {
                        var item = null;
                        for(var key in $scope.immobile.items) {
                            item = $scope.immobile.items[key];
                            $scope.immobileItemsList[item.status].push(item);
                        }
                    }
                }
                
                return $scope.immobileItemsList[status];
            };
        }
    ]);

    controllers.controller("ImobleEditCtrl", [
        "$scope", "$routeParams", "AppService", "$translate",
        function ($scope, $routeParams, AppService, $translate) {

            $scope.stateList = AppService.getStatesList();
            $scope.typeList = AppService.getTypeList();
            $scope.statusList = AppService.getStatusList();

            $scope.types = {};
            for(var key in App.data.typeList) {
                $scope.types[App.data.typeList[key].id] = App.data.typeList[key];
            }

            if ($routeParams.id) {
                $scope.editing = false;
                $scope.immobile = undefined;
                AppService.getImmobile ($routeParams.id, function (immobile, response) {
                    if (response) {
                        Materialize.toast($translate.instant("immobile_not_found"), 5000);
                        history.back();
                    } else {
                        $scope.immobile = immobile;
                        $scope.immobile.state = $scope.immobile.state.toUpperCase();
                    }
                });
            } else {
                $scope.editing = true;
                $scope.immobile = AppService.createImmobile({
                    status : $scope.statusList[0],
                    type : $scope.typeList[0].id,
                });
            }

            $scope.getIcon = function(type) {
                return $scope.types[type].icon;
            };

            $scope.confirm = function () {
                AppService.saveImmobile($scope.immobile, function (data, response) {
                    if (response) {
                        if (response.status === 403) { // forbidden
                            Materialize.toast(data.error.msg, 5000);
                        }
                    } else {
                        Materialize.toast($translate.instant("immobile_saved", {name : data.name}), 5000);
                        history.back();
                    }
                });
            };

            $scope.cancel = function () {
                history.back();
            };

            $scope.remove = function(){
                AppService.removeImmobile($scope.immobile, function(data, response) {
                    if (response) {
                        console.log(response);
                        if (response.status == 404)
                            Materialize.toast($translate.instant('immobile_not_found'), 5000);
                        else
                            Materialize.toast(data.error.msg, 5000);
                    } else {
                        Materialize.toast($translate.instant('immobile_removed'), 5000);
                        location.href = "#/main";
                    }
                });
            };
        }
    ]);

    controllers.controller ("ImobleDetailCtrl", [
        "$scope", "$routeParams", "$translate", "AppService", 
        function ($scope, $routeParams, $translate, AppService) {
            $scope.immobileId = ($routeParams.id ? $routeParams.id : '').trim();

            if ($scope.immobileId == '') {
                location.href = "#/main";
                return;
            }

            if ($routeParams.id) {
                $scope.editing = false;
                $scope.immobile = undefined;
                AppService.getImmobile ($routeParams.id, function (immobile, response) {
                    if (response) {
                        Materialize.toast($translate.instant("immobile_not_found"), 5000);
                        $scope.back();
                    } else {
                        $scope.immobile = immobile;
                    }
                });
            }

            $scope.types = AppService.getTypeMap();

            $scope.getIcon = function(type) {
                return $scope.types[type].icon;
            };

            $scope.directions = function (){
                var immobile = $scope.immobile;
                location.href = "geo:0,0?q=" + encodeURI(immobile.address + ", " + immobile.city + " - " + immobile.state);
            };

            $scope.remove = function () {
                AppService.removeImmobile($scope.immobile, function(data, response) {
                    if (response) {
                        if (response.status == 404)
                            Materialize.toast($translate.instant('immobile_not_found'), 5000);
                        else
                            Materialize.toast(response.error.msg, 5000);
                    } else {
                        location.href = "#/main";
                    }
                });
            };

            $scope.back = function(){
                history.back(); // volta para a tela anterior
            };
        }
    ]);
    
    controllers.controller("ImobleMainCtrl", ["$scope", "Immobiles", "AppService", function($scope, Immobiles, AppService) {

        $scope.typeList = AppService.getTypeList();
        $scope.statusList = AppService.getStatusList();

        $scope.selected = [];
        $scope.immobiles = null;
        
        var state = AppService.getState('ImobleMainCtrl');

        if (state) {
            $scope.currentType = state.currentType;
            $scope.currentView = state.currentView;
        } else {
            $scope.currentType = $scope.typeList[0];
            $scope.currentView = 0;
        }

        $scope.select = function (immobile) {
            immobile.selected = !immobile.selected;

            if (immobile.selected) {
                $scope.selected.push(immobile);
            } else {
                $scope.selected = $scope.selected.filter(function(e) {
                    return e.selected;
                });
            }
        };

        AppService.getImmobiles(function (immobiles) {
            $scope.immobilesList = undefined;
            $scope.immobiles = immobiles;

            if (state) {
                for(var i in state.selected) {
                    var immobile = App.data.immobilesMap[state.selected[i].id];
                    if(immobile) {
                        if (immobile.type == state.selected[i].type
                        &&  immobile.status == state.selected[i].status) {
                            $scope.select(immobile);
                        }
                    }
                }
            }
        });

        $scope.$on ('$destroy', function ($event) {
            var selected = [];
            for (var i in $scope.selected) {
                selected.push({
                    id : $scope.selected[i].id,
                    type : $scope.selected[i].type,
                    status : $scope.selected[i].status
                });
            };

            AppService.registerState('ImobleMainCtrl', {
                "currentType" : $scope.currentType,
                "currentStatus" : $scope.currentView,
                "selected" : selected,
            })
        });

        $scope.remove = function () {
            Materialize.toast("clicou", 5000);
        };

        $scope.edit = function (immobile) {
            location.href = "#/immobile/" + immobile.id + "/edit";
        };
        
        $scope.detail = function (immobile) {
            location.href = "#/immobile/" + immobile.id;
        };

        $scope.changeType = function (type){
            $scope.currentType = type;
            $scope.immobilesList = undefined;
        };

        $scope.undoSelection = function() {
            $scope.selected = [];
            for(var key in App.data.immobiles) {
                App.data.immobiles[key].selected = false;
            }
        };
        
        $scope.getListImmobiles = function (status){
            if ($scope.immobilesList === undefined) {
                $scope.immobilesList = [];

                for(var key in App.data.statusList) {
                    $scope.immobilesList[App.data.statusList[key]] = [];
                }
                
                var immobile = null;
                for(var key in App.data.immobiles) {
                    immobile = App.data.immobiles[key];
                    if(immobile.type === $scope.currentType.id)
                        $scope.immobilesList[immobile.status].push(immobile);
                }
            }
            
            return $scope.immobilesList[status];
        };
        
    }]);

    controllers.controller('ImobleSearchCtrl', ["$scope", "$routeParams", function ($scope, $routeParams){
        $scope.searchText = ($routeParams.searchParam ? $routeParams.searchParam : '').trim();
        $scope.selected = [];

        // types
        $scope.types = {};

        for(var key in App.data.typeList) {
            $scope.types[App.data.typeList[key].id] = App.data.typeList[key];
        }

        $scope.undoSelection = function() {
            $scope.selected = [];
            for(var key in App.data.immobiles) {
                App.data.immobiles[key].selected = false;
            }
        };

        $scope.select = function (immobile) {
            immobile.selected = !immobile.selected;

            if (immobile.selected) {
                $scope.selected.push(immobile);
            } else {
                $scope.selected = $scope.selected.filter(function(e) {
                    return e.selected;
                });
            }
        };

        $scope.getIcon = function(type) {
            return $scope.types[type].icon;
        };

        $scope.back = function(){
            history.back(); // volta para a tela anterior
        };

        $scope.filter = function () {
            $scope.immobiles = [];

            if ($scope.searchText !== '') {

                for(var key in App.data.immobiles) {
                    var immobile = App.data.immobiles[key];
                    immobile.selected = false;

                    var searchRE = new RegExp($scope.searchText, "i");

                    if (immobile.name.match(searchRE)
                     || immobile.city.match(searchRE)
                     || immobile.state.match(searchRE)
                     || immobile.description.match(searchRE)
                     || immobile.address.match(searchRE)
                    ) {
                        $scope.immobiles.push(immobile);
                    }
                }
            }
        };

        $scope.clear = function () {
            $scope.searchText = "";
        }

        $scope.detail = function (immobile) {
            location.href = "#/immobile/" + immobile.id;
        };
    }]);
}) (App);