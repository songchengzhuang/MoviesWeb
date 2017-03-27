/**
 * Created by Administrator on 2017/3/19.
 * 电影首页的vue.js用于数据绑定
 */
new Vue({
    el: "#my_index",
    data: {
        movieList: []
    },
    filters: {},
    mounted: function () {
        this.$nextTick(function () {
            this.filmdetail();
        })
    },
    methods: {
        filmsuc: function (data, status) {

            this.movieList = data.movies;
            console.log("测试数据1:" + data.movies._id);
            console.log("测试状态:" + status);
            console.log("测试数据2:" + this.movieList._id);
        },

        filmdetail: function () {

            $.ajax({
                type: 'GET',
                url: "/film/index",//从那个路由获取数据。
                dataType: "json",//服务器返回的数据类型
                success: this.filmsuc,
                error: function (err) {
                    console.log("测试错误：" + err);
                }
            })
        }
    }
});