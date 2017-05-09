var gulp = require('gulp');
var sass = require('gulp-sass');


// sass文件编译
gulp.task('sass', function () {
  return gulp.src('./css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});
// sass文件编译自动化
gulp.task('biultSass', ['sass'], function() {
    gulp.watch('./css/*.scss', ['sass']);
})

/*执行命令
cmd1 : 自动监视，browser-sync只要全局安装一次就可以了,打开wamp,监听3000端口，
       打开360免费wifi,浏览器输入电脑ipv4地址，转到3000端口，就可以同步测试手机，测试的时候手机屏幕要设置常亮，没网也能进行测试
browser-sync start --server --files "./*.html,./css_debug/*.css,./js_debug/*.js"
cmd2 : 自动编译sass文件
gulp biultSass
cmd3 : 自动合并seajs文件，压缩js,css
gulp zip
*/