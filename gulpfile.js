var gulp = require('gulp'),
    browserSync = require('browser-sync');
    wiredep = require('wiredep').stream;

gulp.task('server', function(){
   browserSync({
      port: 9000,
      server: {
         baseDir: 'app'
      }
   });
});

gulp.task('watch', function(){
   gulp.watch([
      'app/*.html',
      'app/js/**/*.js',
      'app/css/**/*.css',
      'app/php/**/*.css'
   ]).on('change', browserSync.reload);
});

gulp.task('wiredep', function(){
   gulp.src('app/*html')
       .pipe(wiredep())
       .pipe(gulp.dest('app/'))
});

gulp.task('default',['server', 'watch']);