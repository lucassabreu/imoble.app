(function(angular){
	var directives = angular.module("angular-materialize", []);

	directives.directive("materialSelect", [
		function () {
			return {
				compile: function ($element) {
					$element.find('option[ng-repeat]').attr("material-select-options", "material-select-options");
				},
				scope : {
					value : "=mgModel",
					disabled : "&ngDisabled",
				},
				controller : function ($scope, $element, $attrs) {
					var jqElement = null;
					var newSelect;
					var newSelectDropDown;
					var selectUID;
					var that = this;

					$scope.$watch ($scope.disabled, function (newValue, oldValue) {
						if (newValue != oldValue)
							that.applyFn();
					});

					this.applyFn = function () {
						var option = $element.find("option[value='" + $scope.value + "']");
						option.attr('selected', true);

						$element.material_select(function() {
							$scope.$apply(function () {
								$scope.value = jQuery($element).val();
							})
						});
					}
				}
			};
		}
	])
	.directive("materialSelectOptions", [
		function () {
			return {
				restrict : "A",
				require : ["^materialSelect"],
				link : function ($scope, $element, $attrs, $controllers) {
					$scope.$watch('$last', function (isLast) {
						if (isLast) {
							$controllers[0].applyFn();
						}
					});
				}
			};
		}
	]);
})(angular);