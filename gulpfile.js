const browserSync = require("browser-sync").create();
const del = require("del");
// Gulp plagins
const gulp = require("gulp");
const autoPrefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");
const fileInclude = require("gulp-file-include");
const fonter = require("gulp-fonter");
const notify = require("gulp-notify");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const svgSprite = require("gulp-svg-sprite");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");

////////// Delete build folder //////////

function deleteBuildDirectory() {
  return del("./public")
}

////////// For HTML //////////

function taskHtml() {
  return gulp.src(["./src/html/*.html"])
    .pipe(fileInclude())
    .pipe(gulp.dest("./public"))
    .pipe(browserSync.stream())
}

////////// For Styles //////////

function taskStyles() {
  return gulp.src("./src/scss/**/*.scss", { sourcemaps: true })
    // .pipe(sass().on("error", sass.logError))
    .pipe(sass({ outputStyle: "expanded" }).on("error", notify.onError()))
    .pipe(rename({ suffix: ".min" }))
    .pipe(autoPrefixer({ cascade: false }))
    // .pipe(cleanCss({ level: 2 }))
    .pipe(gulp.dest("./public/css", { sourcemaps: true }))
    .pipe(browserSync.stream())
}

////////// For SVG //////////

// function taskSvgSprite() {
//   return gulp.src("./src/images/svg/**/*.svg")
//     .pipe(svgSprite({
//       mode: {
//         stack: {
//           sprite: "../sprite.svg"
//         }
//       },
//     }))
//     .pipe(gulp.dest("./public/images/svg"))
//     .pipe(browserSync.stream())
// }

////////// For Fonts //////////

function taskConvertFonts() {
  gulp.src("./src/fonts/*.ttf")
    // .pipe(fonter({ formats: ["ttf", "woff", "eot", "svg", "otf"] }))
    // .pipe(gulp.dest("./public/fonts"))
    .pipe(ttf2woff())
    .pipe(gulp.dest("./public/fonts/"))
  return gulp.src("./src/fonts/*.ttf")
    .pipe(ttf2woff2())
    .pipe(gulp.dest("./public/fonts/"))
}

////////// Local Server //////////

function taskBrSync() {
  browserSync.init({ server: { baseDir: "./public" } });
  gulp.watch("./src/html/**/*.html", taskHtml);
  gulp.watch("./src/scss/**/*.scss", taskStyles);
}

////////// Exports ////////////////////////////////////////////////////////////////////////////////

exports.del = deleteBuildDirectory
exports.html = taskHtml
exports.stl = taskStyles
exports.bs = taskBrSync
// exports.svg = taskSvgSprite
exports.font = taskConvertFonts

// exports.default = gulp.series(deleteBuildDirectory, taskHtml, taskStyles, taskConvertFonts, taskBrSync)
exports.default = gulp.series(deleteBuildDirectory, taskConvertFonts)
