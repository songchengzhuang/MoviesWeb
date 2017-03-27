/**
 * Created by Administrator on 2017/3/21.
 */
/**
 * Created by Administrator on 2017/3/19.
 * 电影首页的vue.js用于数据绑定
 */
new Vue({
    el: "#my_movie",
    data: {
        movie: {
            //格式化表单
            _id:'undefined',
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    },
    filters: {},
    mounted: function () {
        this.$nextTick(function () {
            this.filmdetail();
        })
    },
    methods: {
        filmsuc: function (data, status) {

            this.movie = data.movie;
            console.log("测试状态:" + status);
            //console.log("测试数据2:" + this.movie._id);
        },

        filmdetail: function () {

            var _id;
            var url = window.location.href;//获取当前页面的 地址栏url
            var id = url.substring(url.lastIndexOf('/') + 1)//用substring找到url最后一个'/'的位置,substring取+1 位置 到url字符串末尾 的 值

            if (id !== 'admin') {
                $.ajax({
                    type: 'POST',
                    url: '/film/movieDetail',
                    data: {_id: id},//向服务器发送的数据
                    dataType: "json",//服务器返回的数据类型
                    success: this.filmsuc,
                    error: function (err) {
                        console.log("测试错误：" + err);
                    }
                })
            }
        }
    }
})

