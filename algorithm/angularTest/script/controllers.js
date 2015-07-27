/**
 * Created by veeking on 2015/7/27.
 */
  testApp.controller('listCtrl',function($scope){

  });
testApp.controller('detailCtrl',function($scope,$routeParams){
    $scope.id = $routeParams.id;
});


 testApp.service('getJson',function($http){

 });