# [browser-sync][def]
Не забывать в самом конце задачи, после gulp.dest добавлять еще один .pipe(browserSync.stream())
# [del][def2]
Версия пакета >6.1.1 не использует require() синтаксис.
# [gulp][def3]
# [gulp-autoprefixer][def4]
autoprefixer не работает
# [gulp-clean-css][def5]
# [gulp-file-include][def6]
# [gulp-fonter][def7]
**Получил из** .ttf -> .eot, .ttf, .woff (.ttf был просто перемещен)<br>
**Получил из** .svg -> .svg (.svg был просто перемещен)<br>
**Получил из** .eot -> .eot, .ttf, .woff (.eot был просто перемещен)<br>
**Получил из** .woff -> .woff (.woff был просто перемещен)<br>
**Получил из** .woff2 -> .woff2 (.woff2 был просто перемещен)<br>
**Получил из** .otf -> .eot, .ttf, .woff, .otf (.otf был просто перемещен)<br>
# [gulp-notify][def8]
# [gulp-rename][def9]
# [gulp-sass][def10]
# [gulp-svg-sprite][def11]
Полную документацию по конфигурации svg-sprite [можно найти здесь][def12]
# [gulp-ttf2woff][def13]
# [gulp-ttf2woff2][def14]
**Получил из** .ttf -> .woff2<br>
**Получил из** .svg -> .svg (судя по размеру .svg был просто перемещен)<br>
**Получил из** .eot -> .eot (судя по размеру .eot был просто перемещен)<br>
**Получил из** .woff -> .woff (судя по размеру .woff был просто перемещен)<br>
**Получил из** .woff2 -> .woff2 (судя по размеру .woff2 был просто перемещен)<br>
**Получил из** .otf -> .otf (судя по размеру .otf был просто перемещен)<br>

[def]: https://github.com/BrowserSync/browser-sync
[def2]: https://github.com/sindresorhus/del
[def3]: https://github.com/gulpjs/gulp
[def4]: https://github.com/sindresorhus/gulp-autoprefixer
[def5]: https://github.com/scniro/gulp-clean-css
[def6]: https://github.com/haoxins/gulp-file-include
[def7]: https://github.com/Mazgrze/gulp-fonter
[def8]: https://github.com/mikaelbr/gulp-notify
[def9]: https://github.com/hparra/gulp-rename
[def10]: https://github.com/dlmanning/gulp-sass
[def11]: https://github.com/svg-sprite/gulp-svg-sprite
[def12]: https://github.com/svg-sprite/svg-sprite/blob/main/docs/configuration.md
[def13]: https://github.com/nfroidure/gulp-ttf2woff
[def14]: https://github.com/nfroidure/gulp-ttf2woff2