const browserSync = require("browser-sync").create();
const del = require("del");
// Gulp plagins
const gulp = require("gulp");
const autoPrefixer = require("gulp-autoprefixer");
const cheerio = require("gulp-cheerio")
const cleanCss = require("gulp-clean-css");
const fileInclude = require("gulp-file-include");
const imageMin = require("gulp-imagemin");
const newer = require("gulp-newer");
const notify = require("gulp-notify");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const size = require("gulp-size")
const svgSprite = require("gulp-svg-sprite")
const tinyPngCompress = require("gulp-tinypng-compress");
const ttf2woff = require("gulp-ttf2woff");
const ttf2woff2 = require("gulp-ttf2woff2");
const webp = require("gulp-webp");

////////// Delete build folder //////////

function cleanDir() {
  return del("./public")
}

////////// For HTML ///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function devHtml() {
  return gulp.src(['./src/*.html'])
    .pipe(fileInclude().on("error", notify.onError(error => ({ title: "devHtml", message: error.message }))))
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.stream())
};

////////// For Styles /////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function devStyles() {
  return gulp.src("./src/scss/**/*.scss", { sourcemaps: true })
    .pipe(sass({ outputStyle: "expanded" }).on("error", notify.onError(error => ({ title: "devStyles", message: error.message }))))
    .pipe(autoPrefixer())
    .pipe(size({ title: "before compression", showFiles: true, }))
    .pipe(gulp.dest("./public/css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(cleanCss({ level: 2 }))
    .pipe(size({ title: " after compression", showFiles: true, }))
    .pipe(gulp.dest("./public/css", { sourcemaps: true }))
    .pipe(browserSync.stream())
  /*  Описание:
  1 - Забирает все файлы с расширением scss, во всех вложенных директориях, внутри директории scss (чаще всего это main и libs)
  2 - Компилирует SASS в нативный CSS
  3 - Добавляет вендорные префиксы основываясь на значении ключа "browserslist" указанного в package.json
  4 - Выводит в консоль текущий размер всех файлов по отдельности и общий размер до сжатия
  5 - Записывает промежуточный результат результат в директорию public (Без исходных карт!)
  6 - Добавляет в имени файла суффикс .min
  7 - Применяе алгоритм компрессии на основе параметра переданного в функцию cleanCss()
  8 - Выводит в консоль текущий размер всех файлов по отдельности и общий размер после сжатия
  9 - Записывает сжатый результат в директорию public (Добавляет исходные карты!)
  */
}

////////// For Images /////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function devImageMin() {
  return gulp.src(["./src/images/**/*.jpg", "./src/images/**/*.jpeg", "./src/images/**/*.png", "./src/images/*.svg"])
    .pipe(newer("./public/images"))
    .pipe(webp())
    .pipe(gulp.dest("./public/images"))
    .pipe(gulp.src(["./src/images/**/*.jpg", "./src/images/**/*.jpeg", "./src/images/**/*.png", "./src/images/*.svg"]))
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
  return gulp.src(["./src/images/**/*.jpg", "./src/images/**/*.jpeg", "./src/images/**/*.png", "./src/images/*.svg",])
    .pipe(webp())
    .pipe(gulp.dest("./public/images"))
    .pipe(gulp.src(["./src/images/**/*", "!./src/images/**/*.png", "!./src/images/**/*.svg", "!./src/images/__sprite"]))
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
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
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
  gulp.src("./src/fonts/*.ttf")
    .pipe(ttf2woff())
    .pipe(gulp.dest("./public/fonts/"))
  return gulp.src("./src/fonts/*.ttf")
    .pipe(ttf2woff2())
    .pipe(gulp.dest("./public/fonts/"))
}

////////// Local Server ///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function watchFiles() {
  browserSync.init({ server: { baseDir: "./public" } });
  gulp.watch("./src/html/**/*.html", devHtml);
  gulp.watch("./src/scss/**/*.scss", devStyles);
  gulp.watch(["./src/images/**/*.jpg", "./src/images/**/*.jpeg", "./src/images/**/*.png", "./src/images/*.svg"], devImageMin);
  gulp.watch("./src/images/__sprite/*.svg", devSvgSprite);
}

////////// Exports ////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

exports.del = cleanDir
exports.d_html = devHtml
exports.d_stl = devStyles
exports.d_images = devImageMin
exports.p_images = prodImageMin
exports.p_tiny = prodTinyPng
exports.d_svg = devSvgSprite
exports.d_font = devFonts
exports.bs = watchFiles



exports.dev = gulp.series(cleanDir, devFonts, devHtml, devStyles, devImageMin, devSvgSprite, watchFiles)

exports.prod = gulp.series(cleanDir, devFonts, devHtml, devStyles, prodTinyPng, devSvgSprite, prodImageMin)
