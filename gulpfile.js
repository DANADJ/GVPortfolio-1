//Инициализация плагинов
var gulp = require('gulp'),
    browserSync = require('browser-sync'),//модуль запуска сервера
    wiredep = require('wiredep').stream,//модуль слежки за bower
    useref = require('gulp-useref'),//модуль конкатенации css и js
    rimraf = require('gulp-rimraf'),//модуль удаления файлов
    size = require('gulp-size'),//модуль подсчёта размера файлов
    gulpif = require('gulp-if'),//модуль фильтрации
    uglify = require('gulp-uglify'),//модуль минификации js
    csso = require('gulp-csso'),//модуль минификации css
    filter = require('gulp-filter'),//модуль фильтраци
    imagemin = require('gulp-imagemin');//модуль сзатия картинок

//Задача запуска сервера
gulp.task('server', function(){
   browserSync({
      port: 9000,
      server: {
         baseDir: 'app'
      }
   });
});

//Задача наблюдения за файлами проекта
gulp.task('watch', function(){
   gulp.watch([
      'app/*.html',
      'app/js/**/*.js',
      'app/css/**/*.css',
      'app/php/**/*.php'
   ]).on('change', browserSync.reload);
    gulp.watch('bower.json',['wiredep'])
});

//Задача слежки за bower и вставки нужных скриптов в html
gulp.task('wiredep', function(){
   gulp.src('app/*.html')
       .pipe(wiredep())
       .pipe(gulp.dest('app/'))
});

//Задача объединения, минификации css и js файлов, и переноса их вместе с html в директорию dist
gulp.task('useref', function(){
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', csso()))
        .pipe(gulp.dest('dist'))
});

//Задача переноса шрифтов
gulp.task('move_fonts', function(){
    gulp.src('app/fonts/*')
        .pipe(filter(['*.eot', '*.svt', '*.ttf', '*.woff', '*.woff2']))
        .pipe(gulp.dest('dist/fonts'))
});

//Задача минификации картинок
gulp.task('imagemin', function(){
    return gulp.src('app/images/**/*')
        .pipe(imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'))
});

//Задача переноса php файлов
gulp.task('move_php', function(){
    gulp.src('app/**/*.php')
        .pipe(gulp.dest('dist/'))
});

//Задача сборки проекта и вывода размера окончательной директории
gulp.task('create_dist', ['move_fonts', 'useref', 'imagemin', 'move_php'], function(){
    return gulp.src('dist/**/*')
        .pipe(size({title: 'build'}))
});

//Задача удаления папки с проектом
gulp.task('delete_dist', function(){
    return gulp.src('dist', {read: false})
        .pipe(rimraf())
});

//Задача полной сборки проекта
gulp.task('build', ['delete_dist'], function(){
    gulp.start('create_dist')
});

//Задача по умолчанию
gulp.task('default', ['server', 'watch']);
