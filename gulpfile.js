const gulp = require("gulp");
const babel = require("gulp-babel");
const clean = require("gulp-clean");

gulp.task("clean", () => {
    return gulp.src("dist/*")
    .pipe(clean());
});

gulp.task("build", () => {
    return gulp.src(["src/**/*.js", "!src/**/.*.js"])    
    .pipe(babel())    
    .pipe(gulp.dest("dist"));
})

gulp.task('clean-build', ['build']);
gulp.task("default", ['clean-build']);
gulp.task("heroku", ['default']);