"use strict";

angular.module("Tinto", ['ngRoute']).directive("tintoView", function($route, $compile, $controller, $window, $timeout, $location, $anchorScroll) {
    return {
        restrict: "ECA",
        terminal: true,
        priority: 400,
        transclude: "element",
        compile: function(element, attr, linker) {
            return function(scope, $element, attr) {
                var currentElement, keepPreviousView;
                var storedElements = {};
                var scrollPosCache = {};

                scope.$on('$routeChangeStart', function() {
                    // store scroll position for the current view
                    if ($route.current) {
                        scrollPosCache[$route.current.loadedTemplateUrl] = [$window.pageXOffset, $window.pageYOffset];
                    }
                });

                scope.$on("$routeChangeSuccess", update);
                update();
                function cleanupLastView() {
                    if (currentElement) {
                        currentElement = null;
                    }
                }
                function update() {
                    if (typeof $route.current == "undefined") return;
                    if (storedElements[$route.current.viewName] && $route.current.hideOnly) {
                        for (attr in storedElements) {
                            if (attr != $route.current.viewName) {
                                storedElements[attr].removeClass("ng-show").addClass("ng-hide");
                                storedElements[attr].scope().$emit("leave");
                            }
                        }
                        storedElements[$route.current.viewName].removeClass("ng-hide").addClass("ng-show");
                        storedElements[$route.current.viewName].scope().$emit("enter");
                        if (currentElement && !keepPreviousView) {
                            currentElement.remove();
                        }
                        keepPreviousView = $route.current.hideOnly;

                        // if hash is specified explicitly, it trumps previously stored scroll position
                        if ($location.hash()) {
                            $anchorScroll();
                        // else get previous scroll position; if none, scroll to the top of the page
                        } else {
                            var prevScrollPos = scrollPosCache[$route.current.loadedTemplateUrl] || [ 0, 0 ];
                            $timeout(function() {
                                $window.scrollTo(prevScrollPos[0], prevScrollPos[1]);
                            }, 0);
                        }
                        return;
                    }
                    if (typeof storedElements[$route.current.viewName] == "undefined" && keepPreviousView) {
                        for (attr in storedElements) {
                            storedElements[attr].removeClass("ng-show").addClass("ng-hide");
                            storedElements[attr].scope().$emit("leave");
                        }
                    }
                    var locals = $route.current && $route.current.locals, template = locals && locals.$template;
                    if (template) {
                        var newScope = scope.$new();
                        linker(newScope, function(clone) {
                            clone.html(template);
                            $element.parent().append(clone);
                            if (currentElement) {
                                if (!$route.current.hideOnly) {
                                    if (!keepPreviousView) {
                                        currentElement.remove();
                                    }
                                } else {
                                    if (!keepPreviousView) {
                                        currentElement.remove();
                                    }
                                }
                            }
                            var link = $compile(clone.contents()), current = $route.current;
                            cleanupLastView();
                            currentElement = clone;
                            if ($route.current.hideOnly) {
                                storedElements[$route.current.viewName] = clone;
                            }
                            current.scope = newScope;
                            if (current.controller) {
                                locals.$scope = newScope;
                                var controller = $controller(current.controller, locals);
                                clone.data("$ngControllerController", controller);
                                clone.children().data("$ngControllerController", controller);
                            }
                            link(newScope);
                            newScope.$emit("$viewContentLoaded");
                            newScope.$emit("enter");
                        });
                    } else {
                        cleanupLastView();
                    }
                    if (typeof $route.current != "undefined") {
                        keepPreviousView = $route.current.hideOnly;
                    }
                }
            };
        }
    };
});
