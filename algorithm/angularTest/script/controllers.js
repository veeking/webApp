/**
 * Created by veeking on 2015/7/27.
 */
  testApp.controller('listCtrl',function($scope,$http){
      $http.get('json/list.json').success(function(data){
          $scope.newObjs = data;
      });

  });
 testApp.controller('detailCtrl',function($scope,$routeParams){
     $scope.newList = {};
     $scope.newList.id = $routeParams.id;
 });


// testApp.factory('getJson',function($http){
//      return {
//          newsData : function(){
//              var oData = {};
//              $http.get('json/list.json').success(function(data){
//                  oData = data;
//                  console.log("se")
//                  return oData;
//              });
//          }
//      }
//
// });