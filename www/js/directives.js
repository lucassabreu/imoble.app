(function(app){
    var directives = angular.module('ImobleDirectives', []);

    directives.filter ("formatDecimal", function () {
        return function (input, decimals) {
            return parseFloat(input).formatMoney(2, ",", ".");
        }
    })

    directives.directive ("deleteImmobile", function() {
        return {
            restrict : "E",
            templateUrl : "view/delete.html",
            scope : {
                confirm : "&confirm",
            },
            link : function ($scope, $element, $attrs) {
                $element.find('a').click (function (e) {
                    e.preventDefault();
                    return false;
                });
            }
        };
    });

    directives.directive ("deleteImmobileItem", function() {
        return {
            restrict : "E",
            templateUrl : "view/delete-item.html",
            scope : {
                confirm : "&confirm",
            },
            link : function ($scope, $element, $attrs) {
                $element.find('a').click (function (e) {
                    e.preventDefault();
                    return false;
                });
            }
        };
    });

    directives.directive("modalTrigger", function () {
        return {
            restrict : "A",
            compile : function ($element) {
                $element.leanModal ({
                    dismissible: true, // Modal can be dismissed by clicking outside of the modal
                    opacity: .5, // Opacity of modal background
                    in_duration: 300, // Transition in duration
                    out_duration: 300, // Transition out duration
                });

                $element.click(function (evt) {
                    evt.preventDefault();
                    return false;
                });
            },
        };
    });

    directives.directive ("preloader", function() {
        return {
            restrict : "E",
            transclude : false,
            scope : {
                colorsAttr : "@colors",
            },
            link : function ($scope, $element, $attrs) {
                var colors = $attrs["colorsAttr"];
                if (!colors) {
                    colors = ["red", "yellow", "green"];
                } else {
                    colors = colors.split(",");
                    colors.forEach(function(e, i) { colors[i] = e.trim(); });
                }

                $scope.colors = colors;
            },
            template : (
                "<div class=\"preloader-wrapper small active\">" +
                    "<div ng-repeat=\"color in colors\" class=\"spinner-layer spinner-{{color}}{{preloadUnique ? '-only' : ''}}\">" +
                        "<div class=\"circle-clipper left\">" +
                            "<div class=\"circle\"></div>" +
                        "</div>" +
                        "<div class=\"gap-patch\">" +
                            "<div class=\"circle\"></div>" +
                        "</div>" +
                        "<div class=\"circle-clipper right\">" +
                            "<div class=\"circle\"></div>" +
                        "</div>" +
                    "</div>" +
                "</div>"
            ),
        };
    })

    directives.filter ("line_break", function (){
        return function (input) {
            return input ? input.replace("\n", "\n") : " ";
        }
    });

    directives.directive('autofocus', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link : function($scope, $element) {
                $timeout(function() {
                    $element[0].focus();
                });
            }
        }
    }]);
    
    directives.directive('iconTabChooser', function($timeout){
        return {
            compile : function($element) {
                $element.find('a').attr('icon-tab-chooser-tab', 'icon-tab-chooser-tab');
            },
            scope : {
                currentTab : "=currentTab",
            },
            controller : [
                "$scope", "$element", function ($scope, $element){
                    var _indicador = jQuery('<div class="indicator"></div>');
                    $element.append(_indicador);

                    var _tabMap = {};

                    $scope.select = function (element){
                        var li = element.parent();
                        _indicador.width(li.width());
                        _indicador.css('left', li.offset().left);
                        $element.find('a').removeClass('active');
                        element.addClass('active');
                    }

                    this.addTab = function(childElement, id) {
                        _tabMap[id] = childElement;

                        if (_tabMap.hasOwnProperty($scope.currentTab))
                            $scope.select(_tabMap[$scope.currentTab]);

                        childElement.click(function(evt) {
                            $scope.select(jQuery(this));
                        });
                    };

                    $scope.$watch($scope.currentTab, function () {
                        $timeout(function(){

                        });
                    })
                }
            ]
        }
    }).directive('iconTabChooserTab',function(){
        return {
            require : ['^iconTabChooser'],
            scope : {
                tabId : "=tabId"
            },
            link : function ($scope, $element, $attrs, controllers){
                $element.addClass('tab');
                controllers[0].addTab($element, $scope.tabId);
            },
        }
    });
    
    directives.directive('swipeViewControl', function($timeout){
        return {
            compile : function($element){
                $element.addClass('tabs scroll-tabs');
            },
            scope : {
                currentView : "=currentView",
            },
            controller : [
                '$scope', '$element', '$attrs', function($scope, $element, $attrs){

                    var _container = jQuery($element.context);
                    var _indicador = jQuery('<div class="indicator"></div>');
                    _container.append(_indicador);
                    var _links = null;
                    var _linksSequence = [];

                    $scope.$watch ("currentView", function (newValue, oldValue) {
                        if (newValue != oldValue)
                            $scope.select(_linksSequence[newValue]);
                    });

                    $scope.select = function (target){
                        _indicador.width(_links[target].width());
                        _indicador.css('left', _links[target].offset().left);
                        $element.find('a').removeClass('active');
                        _links[target].find('a').addClass('active');

                        var firstView = jQuery('[swipe-view] .view:first');
                        var view = jQuery(target);

                        if(view.length > 0) {
                            $timeout(function () {
                                var i = (view.offset().left - parseInt(firstView.css('margin-left'))) / 
                                    firstView.parent().width();
                                $scope.currentView = i;
                            });
                        }
                    }

                    this.addTab = function(childElement, target) {

                        if (_links === null) {
                            _links = {};
                            _links[target] = childElement;
                            $scope.select(target);
                        } else
                            _links[target] = childElement;

                        _linksSequence.push(target);

                        if (_linksSequence.length > $scope.currentView)
                            $scope.select(_linksSequence[$scope.currentView]);

                        childElement.find('a').on('click', function(evt){
                            $scope.select(target);
                            evt.preventDefault();
                            return false;
                        });
                    };
                }
            ],
        };
    }).directive('swipeTabLink', function(){
        return {
            require : ['^swipeViewControl'],
            transclude : true,
            scope : {
                target : '=target',
            },
            template : '<a class="waves-effect" ng-transclude></a>',
            link : function ($scope, $element, $attrs, controllers){
                $element.addClass('tab');
                controllers[0].addTab($element, $scope.target);
            },
        }
    });

    directives.directive('swipeView', function () {
        return {
            controllerAs : 'swv',
            scope : {
                currentView : "=currentView",
                canSwipe : "=canSwipe"
            },
            controller : [
                '$scope', '$element', '$attrs', function($scope, $element, $attrs){

                    var swipeViewControlIndicador = jQuery('[swipe-view-control] .indicator');

                    $scope.hm = new Hammer ($element.context);
                    $scope.jqElement = jQuery($element.context);
                    
                    var unit = $scope.jqElement.width() * -1;
                    var nViews = $scope.jqElement.find('.view').length - 1;
                    var hm = $scope.hm;

                    if(!$scope.currentView)
                        $scope.currentView = 0;

                    $scope.$watch ("currentView", function (newValue, oldValue) {
                        $scope.changeTab();
                    });

                    $scope.changeTab  = function () {
                        nViews = $scope.jqElement.find('.view').length - 1;
                        $scope.viewCtrl = $scope.jqElement.find('.view:first');

                        $scope.viewCtrl.css('transition', '');
                        swipeViewControlIndicador.css('transition', '');

                        swipeViewControlIndicador.css('left', (((unit * -1) / (nViews + 1)) * $scope.currentView))
                        $scope.viewCtrl.css('margin-left', ($scope.currentView * unit));
                    };

                    hm.get('pan').set({
                        direction: Hammer.DIRECTION_HORIZONTAL
                    });
                    
                    hm.on ('panend panstart panleft panright', function(event) {
                        if(!$scope.canSwipe)
                            return;

                        $scope.viewCtrl = $scope.jqElement.find('.view:first');

                        switch(event.type) {
                            case 'panstart':
                            case 'panright':
                            case 'panleft':
                                if (($scope.currentView * unit + event.deltaX) < 0
                                &&  ($scope.currentView * unit + event.deltaX) > (nViews * unit)) {
                                    $scope.viewCtrl.css('transition', 'margin-left 0s 0s');
                                    swipeViewControlIndicador.css('transition', 'left 0s 0s');

                                    var perc = event.deltaX / unit;
                                    var pos = perc * (unit / nViews);

                                    swipeViewControlIndicador.css('left', (((unit * -1) / (nViews + 1)) * $scope.currentView) - pos);
                                    $scope.viewCtrl.css('margin-left', 
                                        ($scope.currentView * unit + event.deltaX));
                                }
                                break;
                            case 'panend':
                                $scope.$apply (function () {
                                    var currentViewScroll = $scope.currentView * unit;
                                    var currentScroll = parseInt($scope.viewCtrl.css('margin-left'));

                                    var perc = (currentScroll - currentViewScroll) / unit;

                                    if (perc > .5) {
                                        $scope.currentView++;
                                        if($scope.currentView > nViews)
                                            $scope.currentView = nViews;
                                    }
                                    else {
                                        if (perc < -.5) {
                                            $scope.currentView--;
                                            if ($scope.currentView < 0)
                                                $scope.currentView = 0;
                                        }
                                    }

                                    $scope.changeTab();
                                });

                                break;
                        }
                    });
                }
            ]
        };
    });
})(App);
