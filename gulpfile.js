const browserSync = require("browser-sync").create();
const del = require("del");
// Gulp plagins
const gulp = require("gulp");
const autoPrefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");
const fileInclude = require("gulp-file-include");
const imageMin = require("gulp-imagemin");
const newer = require("gulp-newer");
const notify = require("gulp-notify");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const svgSprite = require("gulp-svg-sprite");
const tinyPngCompress = require("gulp-tinypng-compress");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const webp = require("gulp-webp");

////////// Delete build folder //////////

function delPublicDir() {
  return del("./public")
}

///////////////////////////////////////////////////////////////////////////////////////////////////
////////// For HTML ///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


function taskHtml() {
  return gulp.src(["./src/html/*.html"])
    .pipe(fileInclude())
    .pipe(gulp.dest("./public"))
    .pipe(browserSync.stream())
}

///////////////////////////////////////////////////////////////////////////////////////////////////
////////// For Styles /////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

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
///////////////////////////////////////////////////////////////////////////////////////////////////
////////// For Images /////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function taskImageMin() {
  return gulp.src("./src/images/**/*")
    .pipe(newer("./public/images"))
    .pipe(webp())
    .pipe(gulp.dest("./public/images"))
    .pipe(gulp.src("./src/images/**/*"))
    .pipe(newer("./public/images"))
    .pipe(imageMin({ verbose: true }))
    .pipe(gulp.dest("./public/images"))
}

function taskImageMinBuild() {
  return gulp.src("./src/images/*")
    // .pipe(newer("./public/images"))
    .pipe(webp())
    .pipe(gulp.dest("./public/images"))
    .pipe(gulp.src(["./src/images/**/*", "!./src/images/**/*.png"]))
    // .pipe(newer("./public/images"))
    .pipe(imageMin({ verbose: true }))
    .pipe(gulp.dest("./public/images"))
}

function tackTinyPng() {
  return gulp.src("src/**/*.png")
    .pipe(tinyPngCompress({
      key: "",
      sigFile: "images/.tinypng-sigs",
      log: true,
      summarise: true
    }))
    .pipe(gulp.dest("./public"));
}

///////////////////////////////////////////////////////////////////////////////////////////////////
////////// For SVG ////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


// function taskSvgSprite() {
//   return gulp.src("./src/images/for-svg-sprite/**/*.svg")
//     .pipe(svgSprite({
//       mode: {
//         stack: {
//           sprite: "../sprite.svg"
//         }
//       },
//     }))
//     .pipe(gulp.dest("./public/images"))
//     .pipe(browserSync.stream())
// }

///////////////////////////////////////////////////////////////////////////////////////////////////
////////// For Fonts //////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function taskFonts() {
  gulp.src("./src/fonts/*.ttf")
    // .pipe(fonter({ formats: ["ttf", "woff", "eot", "svg", "otf"] }))
    // .pipe(gulp.dest("./public/fonts"))
    .pipe(ttf2woff())
    .pipe(gulp.dest("./public/fonts/"))
  return gulp.src("./src/fonts/*.ttf")
    .pipe(ttf2woff2())
    .pipe(gulp.dest("./public/fonts/"))
}

///////////////////////////////////////////////////////////////////////////////////////////////////
////////// Local Server ///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function taskBrSync() {
  browserSync.init({ server: { baseDir: "./public" } });
  gulp.watch("./src/html/**/*.html", taskHtml);
  gulp.watch("./src/scss/**/*.scss", taskStyles);
  gulp.watch("./src/images/*", taskImageMin);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
////////// Exports ////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

exports.del = delPublicDir
exports.html = taskHtml
exports.stl = taskStyles
exports.images = taskImageMin
exports.imagesb = taskImageMinBuild
exports.tiny = tackTinyPng
// exports.svg = taskSvgSprite
exports.font = taskFonts
exports.bs = taskBrSync

exports.dev = gulp.series(delPublicDir, taskFonts, taskHtml, taskStyles, taskImageMin, taskBrSync)

exports.build = gulp.series(delPublicDir, taskFonts, taskHtml, taskStyles, tackTinyPng, taskImageMinBuild)
