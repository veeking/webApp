/**
 * Created by veeking on 2015/7/27.
 */
var testApp = angular.module('testApp',['ngRoute']);
testApp.config(['$routeProvider',function($routeProvider){
    $routeProvider.when('/list',{
        templateUrl : 'views/list.html',
        controller : 'listCtrl'
    }).when('/list/:id',{
        templateUrl : 'views/details.html',
        controller : 'detailCtrl'
    }).otherwise({
        redirectTo : '/list'
    });
}]);