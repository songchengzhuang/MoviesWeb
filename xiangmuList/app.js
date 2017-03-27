/**
 * Created by Administrator on 2017/3/18.
 * 作者：宋呈状
 * 入口文件。nodejs操作
 */

//*********************************************************************************************
//**************************加载 模块，启动 web服务********************************************
//*********************************************************************************************
var express = require('express'); //加载express模块
var path = require('path');
var mongoose = require('mongoose');//mongodb数据库模块

var _ = require('underscore');
var Movie = require('./models/movie');
var bodyParser = require('body-parser');//需要载入body-parser中间件才可以使用req.body
var port = process.env.PORT || 3000; //设置端口号3000
var app = express(); //启动一个web服务器

mongoose.connect('mongodb://localhost/films');//在本地mongodb数据库创建mymovies库

/*
 app.set('views','../../views');
 app.set('views',path.join(__dirname +'./views'));//设置默认视图路径。
 */
app.set('view engine', 'html') //设置默认的模板引擎
app.use(bodyParser.urlencoded({extended: true}))//将表单数据 编码解析
app.use(express.static(path.join(__dirname + '/public')));//设置静态资源的默认位置
app.use(bodyParser.urlencoded({extended: true})) //将表单数据 编码解析
app.use(bodyParser.json());
app.listen(port);

console.log('web服务器已经启动，端口号为：' + port);

//*********************************************************************************************
//******************************链接  路由分层*************************************************
//*********************************************************************************************
//用express设置  电影页路由
app.get('/index', function (req, res, next) {
    console.log("********电影首页 GET 请求********");
    res.sendfile("xiangmuList/index.html");
})

//设置电影详情页路由
app.get('/movie/:id', function (req, res, next) {
    console.log("********电影详情页 GET 请求********");
    res.sendfile("xiangmuList/views/moviehtml/movieDetail.html");
})

//设置后台录入路由
app.get('/film/admin', function (req, res, next) {
    console.log("********后台录入 GET 请求********");
    res.sendfile("xiangmuList/views/moviehtml/movieAdmin.html")
})

//设置电影列表路由
app.get('/film/list', function (req, res, next) {
    console.log("********电影列表 GET 请求********");
    res.sendfile("xiangmuList/views/moviehtml/movieList.html");
})

//列表更新页
app.get('/update/:id', function (req, res, next) {
    console.log("********电影详情页 GET 请求********");
    res.sendfile("xiangmuList/views/moviehtml/movieAdmin.html");
})

//*********************************************************************************************
//******************************数据处理 路由分层**********************************************
//*********************************************************************************************

//后台 电影主页和列表页 数据处理路由页
app.get('/film/index', function (req, res, next) {
    console.log("********后台 电影主页和列表页  数据处理路由页********");

    Movie.fetch(function (err, movies) {
        //通过定义的fetch函数获取 数据库全部的 电影数据
        if (err) {
            console.log(err)
        }
        res.json({
            movies: movies
        })
    })
})

//后台 电影详情页和修改页 数据处理路由页
app.post('/film/movieDetail', function (req, res, next) {
    console.log("********后台 电影详情页和修改页 数据处理 路由页********");
    var id = req.body._id;//获取客户端传来的 _id
    Movie.findById(id, function (err, movie) {
        //通过定义的findById函数获取 数据库指定id的 电影数据
        if (err) {
            console.log(err)
        }
        res.json({
            movie: movie
        })
    })
})

//后台 电影 删除页
app.delete('/film/delete', function (req, res) {
    // var id = req.body._id;//获取客户端传来的 _id
    var id = req.query.id;//获取 ？后面的 参数

    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
            }
            else {
                res.json({success: 1})
            }
        })
    }
})
//*********************************************************************************************
//******************************数据存入 数据库 路由分层***************************************
//*********************************************************************************************

//电影数据的存储(数据库)，加入一个路由.以及更新信息
app.post('/save/film/new', function (req, res, next) {
    console.log("********后台录入数据库 post 请求********");
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if (id !== 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err)
            }
            _movie = _.extend(movie, movieObj)
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err)
                }

                res.redirect('/movie/' + id);//重定向 到详情页
            })
        })
    }
    else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            language: movieObj.language,
            country: movieObj.country,
            summary: movieObj.summary,
            flash: movieObj.flash,
            year: movieObj.year,
            poster: movieObj.poster
        })
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err)
            }

            res.redirect('/film/list');//重定向 到列表页
        })
    }
})