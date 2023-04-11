# [browser-sync][def]
Не забывать в самом конце задачи, после gulp.dest добавлять еще один .pipe(browserSync.stream())
# [del][def2]
Версии пакета >6.1.1 не используют require() синтаксис.
# [gulp][def3]
# [gulp-autoprefixer][def4]
autoprefixer не работает
# [gulp-clean-css][def5]
# [gulp-file-include][def6]
# [gulp-group-css-media-queries][def31]
# [gulp-htmlmin][def22]
# [gulp-imagemin][def15]
- Версии пакета >7.1.0 не используют require() синтаксис.<br>
- Важен порядок запуска при составлении задач в более крупные операции с помощью series()<br>
- Плагин очень слабо сжимает изображения в формате .png. В связи с этим, для компрессии .png в сборке применяется плагин “gulp-tinypng-compress”. В силу обстоятельств связанных с ограничением бесплатных запросов к API tinypng, данный плагин применяется только в итоговой сборке. На этапе разработки “gulp-imagemin” справляется вполне приемлемо, в сущности, просто копируя файлы из папки src в папку public практически не влияя на конечный размер файла.
# [gulp-newer][def16]
# [gulp-fonter ( Отказался от использования )][def7]
Отказался от использования в пользу связки плагинов “gulp-ttf2woff” и “gulp-ttf2woff2”

**В ходе экспериментов:**<br>
**Получил из** .ttf -> .eot, .ttf, .woff (.ttf был просто перемещен)<br>
**Получил из** .svg -> .svg (.svg был просто перемещен)<br>
**Получил из** .eot -> .eot, .ttf, .woff (.eot был просто перемещен)<br>
**Получил из** .woff -> .woff (.woff был просто перемещен)<br>
**Получил из** .woff2 -> .woff2 (.woff2 был просто перемещен)<br>
**Получил из** .otf -> .eot, .ttf, .woff, .otf (.otf был просто перемещен)<br>
# [gulp-notify][def8]
# [gulp-plumber][def20]
# [gulp-rename][def9]
# [gulp-sass][def10]
# [gulp-size][def21]
# [gulp-svg-sprite][def11]
Работа плагина основана на библиотеке [svg-sprite][def23]<br>
Документация библиотеки svg-sprite<br>

- [Стандартный API][def24]<br>
- [Использование командной строки][def25]<br>
- [Конфигурация][def26]<br>
- [Обертки Grunt & Gulp][def27]<br>
- [Внедрение метаданных][def28]<br>
- [Выравнивание и дублирование фигур][def29]<br>
- [Настройка и добавление выходных форматов][def30]<br>

# [gulp-tinypng ( Отказался от использования )][def18]
Отказался от использования в пользу плагина “gulp-tinypng-compress”

# [gulp-tinypng-compress][def17]
В силу обстоятельств связанных с ограничением бесплатных запросов к API tinypng, данный плагин применяется только в итоговой сборке.<br>
На этапе разработки “gulp-imagemin” справляется вполне приемлемо, в сущности, просто копируя файлы из папки src в папку public практически не влияя на конечный размер файла.<br>
**Важно!** Не забыть добавить API_KEY.<br>
**Преимущества** перед gulp-tinypng.<br>
- Активно поддерживаемый и развивающийся форк плагина gulp-tinypng.<br>
- В отличии от своего прародителя, регулярно обновляется.<br>
- В отличии от своего прародителя, не создает временных файлов папок.<br>
- Также как и прародитель, умеет сравнивать существующие подписи md5,<br>
благодаря чему файлы уже прошедшие процесс сжатия не обрабатываться повторно,<br>
это позволяет сохранять лимит API_KEY.

# [gulp-ttf2woff][def13]
# [gulp-ttf2woff2][def14]
# [gulp-webp][def19]

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
[def15]: https://github.com/sindresorhus/gulp-imagemin
[def16]: https://github.com/tschaub/gulp-newer
[def17]: https://github.com/stnvh/gulp-tinypng-compress
[def18]: https://github.com/creativeaura/gulp-tinypng
[def19]: https://github.com/sindresorhus/gulp-webp
[def20]: https://github.com/floatdrop/gulp-plumber
[def21]: https://github.com/sindresorhus/gulp-size
[def23]: https://github.com/svg-sprite/svg-sprite
[def24]: https://github.com/svg-sprite/svg-sprite/blob/main/docs/api.md#svg-sprite
[def25]: https://github.com/svg-sprite/svg-sprite/blob/main/docs/command-line.md#svg-sprite
[def26]: https://github.com/svg-sprite/svg-sprite/blob/main/docs/configuration.md#svg-sprite
[def27]: https://github.com/svg-sprite/svg-sprite/blob/main/docs/grunt-gulp.md#svg-sprite
[def28]: https://github.com/svg-sprite/svg-sprite/blob/main/docs/meta-data.md#svg-sprite
[def29]: https://github.com/svg-sprite/svg-sprite/blob/main/docs/shape-alignment.md#svg-sprite
[def30]: https://github.com/svg-sprite/svg-sprite/blob/main/docs/templating.md#svg-sprite
[def22]: https://github.com/jonschlinkert/gulp-htmlmin
[def31]: https://github.com/avaly/gulp-group-css-media-queries
