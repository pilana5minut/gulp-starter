const browserSync = require("browser-sync").create();
const del = require("del");
const webpackStream = require("webpack-stream");
// Gulp plagins
const gulp = require("gulp");
const autoPrefixer = require("gulp-autoprefixer");
const babel = require("gulp-babel");
const cheerio = require("gulp-cheerio");
const cleanCss = require("gulp-clean-css");
const fileInclude = require("gulp-file-include");
const groupCssMediaQueries = require("gulp-group-css-media-queries");
const htmlMin = require("gulp-htmlmin");
const imageMin = require("gulp-imagemin");
const newer = require("gulp-newer");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const size = require("gulp-size");
const svgSprite = require("gulp-svg-sprite");
const tinyPngCompress = require("gulp-tinypng-compress");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const uglify = require("gulp-uglify");
const webp = require("gulp-webp");

////////// For HTML ///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function devHtml() {
  return gulp.src(["./src/*.html"])
    .pipe(plumber(
      notify.onError({
        title: "devHtml",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(fileInclude())
    .pipe(gulp.dest("./public"))
    .pipe(browserSync.stream())
}

function prodHtml() {
  return gulp.src(["./src/*.html"])
    .pipe(fileInclude())
    .pipe(size({
      title: "  before  compression HTML",
      // showFiles: true,
    }))
    .pipe(htmlMin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(size({
      title: "   after  compression HTML",
      // showFiles: true,
    }))
    .pipe(gulp.dest("./public"))
}

////////// For Styles /////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function devStyles() {
  return gulp.src("./src/scss/**/*.scss", { sourcemaps: true })
    .pipe(plumber(
      notify.onError({
        title: "devStyles",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(autoPrefixer())
    .pipe(groupCssMediaQueries())
    .pipe(size({
      title: "  before  compression CSS",
      // showFiles: true,
    }))
    .pipe(gulp.dest("./public/css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleanCss({ level: 2 }))
    .pipe(size({
      title: "   after  compression CSS",
      // showFiles: true,
    }))
    .pipe(gulp.dest("./public/css", { sourcemaps: true }))
    .pipe(browserSync.stream())
  /*  Описание:
  01 - Забирает все файлы с расширением scss, во всех вложенных директориях, внутри директории scss (чаще всего это main и libs)
  02 - Компилирует SASS в нативный CSS
  03 - Добавляет вендорные префиксы основываясь на значении ключа "browserslist" указанного в package.json
  04   Группирует все @meida выражения в конце файла, сортируя их основываясь на заданном условии
  05 - Выводит в консоль текущий размер всех файлов по отдельности и общий размер до сжатия
  06 - Записывает промежуточный результат результат в директорию public ( Без исходных карт )
  07 - Добавляет в имени файла суффикс .min
  08 - Применяе алгоритм компрессии на основе параметра переданного в функцию cleanCss()
  09 - Выводит в консоль текущий размер всех файлов по отдельности и общий размер после сжатия
  10 - Записывает сжатый результат в директорию public ( Добавляет исходные карты )
  */
}

function prodStyles() {
  return gulp.src("./src/scss/**/*.scss")
    .pipe(plumber(
      notify.onError({
        title: "prodStyles",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(autoPrefixer())
    .pipe(groupCssMediaQueries())
    .pipe(size({
      title: "  before  compression CSS",
      // showFiles: true,
    }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleanCss({ level: 2 }))
    .pipe(size({
      title: "   after  compression CSS",
      // showFiles: true,
    }))
    .pipe(gulp.dest("./public/css"))
  /*  Описание:
    - production версия отличается от develop только лишь отсутствием исходных карт и не сохраняет промежуточный вариант
  */
}

////////// For JavaScript /////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function devJsProcess() {
  return gulp.src("./src/js/*.js", { sourcemaps: true })
    .pipe(plumber(
      notify.onError({
        title: "devJsProcess",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(babel())
    .pipe(webpackStream({
      mode: "development"
    }))
    .pipe(uglify())
    .pipe(gulp.dest("./public/js", { sourcemaps: true }))
    .pipe(browserSync.stream())
  /*  Описание:
  1 - src() забирает все файлы с расширением js, во всех вложенных директориях, внутри директории js
  2   plumber() перехватывает ошибки в потоке
  3 - babel() конвертирует современный синтаксис в синтаксис доступный для старых браузеров,
      основываясь на значении ключа "browserslist" указанного в package.json
  4 - webpackStream() объединяет все модули в режиме development
  5 - uglify() применяет алгоритм компрессии кода для уменьшения итогового размера
  6 - dest() складывает результат в директорию назначения ( Добавляет исходные карты )
  */
}

////////// For Images /////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function devImageMin() {
  return gulp.src([
    "./src/images/**/*.jpg",
    "./src/images/**/*.jpeg",
    "./src/images/**/*.png",
    "./src/images/*.svg"
  ])
    .pipe(newer("./public/images"))
    .pipe(webp())
    .pipe(gulp.dest("./public/images"))
    .pipe(gulp.src([
      "./src/images/**/*.jpg",
      "./src/images/**/*.jpeg",
      "./src/images/**/*.png",
      "./src/images/*.svg"
    ]))
    .pipe(newer("./public/images"))
    .pipe(imageMin({ verbose: true }))
    .pipe(gulp.dest("./public/images"))
  /*  Описание:
  1 - Забирает файлы всех форматов, во всех вложенных директориях, внутри директории images
  2 - Конвертирует все найденные файлы в формат webP
  3 - Складывает их в директорию public
  4 - Повторяет шаг №1
  5 - Сжимает все найденные файлы
  6 - Складывает их в директорию public
      .pipe(newer()) проверяет директорию назначения при каждом запуске, благодаря чему файлы уже прошедшие конвертацию пропускаются.
  */
}

function prodImageMin() {
  return gulp.src([
    "./src/images/**/*.jpg",
    "./src/images/**/*.jpeg",
    "./src/images/**/*.png",
    "./src/images/*.svg",
  ])
    .pipe(webp())
    .pipe(gulp.dest("./public/images"))
    .pipe(gulp.src([
      "./src/images/**/*",
      "!./src/images/**/*.png",
      "!./src/images/**/*.svg",
      "!./src/images/__sprite"
    ]))
    .pipe(imageMin({ verbose: true }))
    .pipe(gulp.dest("./public/images"))
  /*  Описаеие:
  1 - Забирает файлы всех форматов, во всех вложенных директориях, внутри директории images
  2 - Конвертирует все найденные файлы в формат webP
  3 - Складывает их в директорию public
  4 - Забирает файлы всех форматов кроме .png и .svg. Так как .png отдельно обрабатывается задачей prodTinyPng
      а .svg уже обработаны на предыдущем шаге
  5 - Сжимает все найденные файлы. (все кроме файлов в формате .png)
  6 - Складывает их в директорию public
  */
}

function prodTinyPng() {
  return gulp.src("src/**/*.png")
    .pipe(tinyPngCompress({
      key: "",
      sigFile: "images/.tinypng-sigs",
      log: true,
      summarise: true
    }))
    .pipe(gulp.dest("./public"));
  /*  Описание:
    - Данная задача выполняется только в production сборке, ввиду ограничения бесплатных запросов к API tinypng
    - Для использования необходимо указать ключ, в качестве значения, для свойства key, объекта конфигурации
  */
}

////////// For SVG //////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function devSvgSprite() {
  return gulp.src("./src/images/__sprite/*.svg")
    .pipe(cheerio({
      run: function ($) {
        $("[fill]").removeAttr("fill");
        $("[stroke]").removeAttr("stroke");
        $("[style]").removeAttr("style");
      },
      parserOptions: {
        xmlMode: true
      },
    })
    )
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "../__sprite"
        },
      },
    }))
    .pipe(gulp.dest("./public/images"))
  /*  Описание:
  1 - Забирает все файлы формата .svg, только из директории __sprite
  2 - Удаляет из каждого .svg файла атрибуты fill, stroke, style,
      предоставляя тем самым, возможность управлять данными параметрами из CSS
  3 - Упаковывает все .svg файлы в спрайт применяя режиме symbol
  4 - Записывает итоговый файл спрайта в директория images
  */
}

////////// For Fonts //////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function devFonts() {
  // gulp.src("./src/fonts/*.ttf")
  //   .pipe(ttf2woff())
  //   .pipe(gulp.dest("./public/fonts/"))
  return gulp.src("./src/fonts/*.ttf")
    .pipe(ttf2woff2())
    .pipe(gulp.dest("./public/fonts/"))
  /*  Описание:
      Для получения в итогой сборке шрифтов в формате woff,
      необходимо раскомментировать строку src: url() в _font-face.scss
  */
}

////////// Delete build folder ////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function cleanDir() {
  return del("./public")
}

////////// Moving other assets ////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function movingAssets() {
  return gulp.src("./src/assets/**")
    .pipe(gulp.dest("./public/assets"))
}

////////// Local server ///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function watchFiles() {
  browserSync.init({
    server: { baseDir: "./public", },
    // notify: false,
    // open: false,
  });
  gulp.watch("./src/**/*.html", devHtml);
  gulp.watch("./src/scss/**/*.scss", devStyles);
  gulp.watch("./src/js/*.js", devJsProcess);
  gulp.watch("./src/images/__sprite/*.svg", devSvgSprite);
  gulp.watch("./src/assets/**", movingAssets);
  gulp.watch("./src/fonts/*.ttf", devFonts);
  gulp.watch([
    "./src/images/**/*.jpg",
    "./src/images/**/*.jpeg",
    "./src/images/**/*.png",
    "./src/images/*.svg"
  ], devImageMin);
}

////////// Exports ////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

exports.clean = cleanDir
exports.d_html = devHtml
exports.p_html = prodHtml
exports.d_stl = devStyles
exports.d_js = devJsProcess
exports.p_stl = prodStyles
exports.d_images = devImageMin
exports.p_images = prodImageMin
exports.p_tiny = prodTinyPng
exports.d_svg = devSvgSprite
exports.d_font = devFonts
exports.other = movingAssets
exports.bs = watchFiles

exports.dev = gulp.series(
  cleanDir,
  movingAssets,
  devFonts,
  devSvgSprite,
  devImageMin,
  devHtml,
  devJsProcess,
  devStyles,
  watchFiles
)

exports.prod = gulp.series(
  cleanDir,
  movingAssets,
  devFonts,
  devSvgSprite,
  prodImageMin,
  prodHtml,
  devJsProcess,
  prodStyles,
  prodTinyPng,
)
