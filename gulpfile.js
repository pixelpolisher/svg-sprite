const { src, dest, parallel } = require('gulp');
const watch       = require('gulp-watch');
const sass        = require('gulp-sass');
const sourcemaps  = require('gulp-sourcemaps');
const sassGlob 		= require('gulp-sass-glob');
const svgSprite 	= require('gulp-svg-sprite');
const plumber     = require('gulp-plumber');
const notify      = require('gulp-notify');

const basePath = './includes/';

const paths = {
	scss  : `${basePath}sass/`,
	icons	: `${basePath}img/icons/`,
  css   : `${basePath}build/css/`,
  img   : `${basePath}build/img/`,
  backgroundImage: {
		src: `${basePath}img/flags`,
		scss: '../../sass/sprite/_spritesheet.scss',
    template: `${basePath}sass/sprite/_sprite-template.scss`
	},
};

function styles () {
	return src(`${paths.scss}/*.scss`)
    .pipe(plumber({ errorHandler: function(err) {
      notify.onError({
        title: "Gulp error in " + err.plugin
      })(err);
    }}))
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(dest(`${paths.css}`))
    .pipe(notify('compiled css'));

}

function watchStyles() {
  return styles()
    .pipe(watch(`${paths.scss}**/*.scss`, styles));
}

function sprite () {
	return src(`${paths.icons}**/*.svg`)
	.pipe(svgSprite({
		mode: {
			symbol: {
				render: {
					css: false,
					scss: false,
				},
				dest: `${paths.img}`,
				sprite: 'icons.svg',
	      example: true // sweet! automatically generete demo html page
			}
		}
	}))
	.pipe(dest('./'))
	.pipe(notify('compiled svg sprite'));
}

function watchSprite() {
  return sprite()
    .pipe(watch(`${paths.icons}**/.svg`, sprite));
}

function bgImg() {
	return src(`${paths.backgroundImage.src}**/*.svg`)
	.pipe(svgSprite({
		shape: {
			spacing: {
				padding: 5
			}
		},
		mode: {
			css: {
        dest: `${paths.img}`,
				sprite: 'flags.svg',
				bust: false,
				render: {
					scss: {
						dest: `${paths.backgroundImage.scss}`,
						template: `${paths.backgroundImage.template}`,
					}
				}
			}
		}
	}))
	.pipe(dest('./'))
  .pipe(notify('compiled svg background-image'))
}

function watchBgImg() {
  return bgImg()
    .pipe(watch(`${paths.backgroundImage.src}**/.svg`, sprite));
}

exports.styles        = styles;
exports.watchStyles   = watchStyles;
exports.sprite        = sprite;
exports.watchSprite   = watchSprite;
exports.bgImg         = bgImg;
exports.watchBgImg    = watchBgImg;
exports.watch         = parallel(watchStyles, watchSprite, watchBgImg);
exports.default       = parallel(styles, sprite, bgImg);
