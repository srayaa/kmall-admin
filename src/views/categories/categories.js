define(['app'], function(app) {
    app.controller('categoryController', ['$scope', '$http', '$timeout', '$sce', '$uibModal', function($scope, $http, $timeout, $sce, $uibModal) {
        
        loadCategories();

        $scope.getStatusText = function(status) {
            if (status) return $sce.trustAsHtml('<span class="text-success">可用</span>');
            return $sce.trustAsHtml('<span class="text-danger">禁用</span>');
        }

        $scope.create = function() {
            doEdit(true);
        }

        $scope.modify = function(row) {
            doEdit(false, row);
        }

        $scope.delete = function(row) {
            if (!row.id) return alert('操作失败，未知id');
            var verify = window.confirm('确定删除吗？');
            verify && (
                $http.post('../api/admin/category/' + row.id + '/del').then(function(res) {
                    if (res.data.code === 0) {
                        loadCategories();
                    } else {
                        alert('删除失败！');
                    }
                })
            );
        }

        $scope.Enums = {
            status: [
                        {status: true, name: '可用'},
                        {status: false, name: '禁用'}
                    ]            
        };

        $scope.submit = function(uibScope) {
            var isNew = $scope.edit.isNew;//编辑还是新建
            var postData = {
                name: $scope.edit.name,
                description: $scope.edit.description,
                sort: $scope.edit.sort,
                status: $scope.edit._status.status
            }
            var url = isNew ? '../api/admin/category': ('../api/admin/category/' + $scope.edit.id);
            $http.post(url, postData).then(function(res) {
                if (res.data.code === 0) {
                    loadCategories();
                    uibScope.$close();
                } else {
                    window.alert('操作失败！');
                }
            });
        }

        function doEdit(isNew, obj) {
            if (isNew) {
                $scope.edit = {
                                name: '',
                                sort: 0,
                                description:'',
                                status: true,
                                _status: {status: true}
                            };
            } else {
                $scope.edit = angular.copy(obj);
                $scope.edit.id = obj.id;
                $scope.edit._status = {status: obj.status};
            }
            $scope.edit.isNew = isNew;
            $uibModal.open({
                templateUrl:'./views/categories/edit.html',
                title:'编辑分类',
                scope: $scope
            });
        }

        function loadCategories() {
            $scope.loading = true;
            $http.get('../api/admin/categories').then(function(res) {
                if (res.data.code === 0) {
                    $timeout(function() {
                        $scope.loading = false;
                        $scope.categories = res.data.data;                        
                    }, 0);
                } else {
                    $scope.categories = [];
                }
            });
        }

    }]);
});