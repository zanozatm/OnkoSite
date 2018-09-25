'use strict';
const 	gulp    	 = require('gulp'),
		watch  		 = require('gulp-watch'),
		autoprefixer = require('gulp-autoprefixer'),
		sass		 = require('gulp-sass'),
		sourcemap 	 = require('gulp-sourcemaps'),
		minifyCss	 = require('gulp-minify-css'),
		gcmq 		 = require('gulp-group-css-media-queries'),

		rimraf		 = require('rimraf'),
		pug 		 = require('gulp-pug'),
		htmlbeautify = require('gulp-html-beautify'),
		plumber 	 = require('gulp-plumber'),
		notify 		 = require("gulp-notify"),
		imagemin	 = require("gulp-imagemin"),
		rigger		 = require("gulp-rigger"),
		uglify 		 = require('gulp-uglify'),
		cache  		 = require('gulp-cache'),
		del 		 = require('del'),

		browserSync	 = require('browser-sync'),
		reload 		 = browserSync.reload;

const	path 		 = {

		build: {
			html : 'build',
			js	 : 'build/js',
			css  : 'build/css',
			img  : 'build/img/',
			fonts: 'build/fonts/'

		},

		src: {
			html : 'src/*.html',
			pug  : "src/**/*.pug", 
			js	 : 'src/js/main.js',
			css  : 'src/css/template.scss',
			img  : 'src/img/**/*',
			fonts: 'src/fonts/**/*.*'
		},

		watch: {
			html : 'src/**/*.html',
			pug  : "src/**/*.pug", 
			js	 : 'src/js/**/*.js',
			css  : 'src/css/**/*.scss',
			img  : 'src/img/**/*',
			fonts: 'srs/fonts/**/*.*'
		},

		clean:     './build'
	};

gulp.task('webserver', function() {
	browserSync({
		server: {
			baseDir: './build'
		},
		host: 'localhost',
		port: 3000
	});
});

gulp.task('pug:build', function() {
  	gulp.src(path.src.pug)
	  .pipe(plumber({
	          errorHandler: notify.onError()
	   }))
      .pipe(pug({
            pretty: true
        }))
      .pipe(gulp.dest(path.build.html))
      .pipe(htmlbeautify())
      .pipe(browserSync.stream());
});


gulp.task('html:build', function() {
	gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('js:build', function() {
	gulp.src(path.src.js)
	.pipe(plumber({
	          errorHandler: notify.onError()
	   }))
	.pipe(rigger())
	.pipe(sourcemap.init())
	.pipe(uglify())
	.pipe(sourcemap.write())
	.pipe(gulp.dest(path.build.js))
	.pipe(reload({stream: true}));
});

gulp.task('css:build', function() {
	gulp.src(path.src.css)
	.pipe(plumber({
	          errorHandler: notify.onError()
	   }))
	.pipe(sourcemap.init())
	.pipe(sass({
		includePaths: require('node-normalize-scss').includePaths
	}))
	.pipe(autoprefixer(['last 3 versions', '> 1%'], { cascade: true }))
	.pipe(gcmq())
	.pipe(minifyCss())
	.pipe(sourcemap.write())
	.pipe(gulp.dest(path.build.css))
	.pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts));
});

gulp.task('img:build', function() {
    gulp.src(path.src.img)
        .pipe(imagemin([
		    imagemin.gifsicle({interlaced: true}),
		    imagemin.jpegtran({progressive: true}),
		    imagemin.optipng({optimizationLevel: 5}),
		    imagemin.svgo({
		        plugins: [
		            {removeViewBox: true},
		            {cleanupIDs: false}
		        ]
		    })
		]))
        .pipe(gulp.dest(path.build.img))
});

gulp.task('htmlbeautify', function() {
    var options = {
        indentSize: 2,
        unformatted: [
            // https://www.w3.org/TR/html5/dom.html#phrasing-content
             'abbr', 'area', 'b', 'bdi', 'bdo', 'br', 'cite',
            'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'ins', 'kbd', 'keygen', 'map', 'mark', 'math', 'meter', 'noscript',
            'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'small',
             'strong', 'sub', 'sup', 'template', 'time', 'u', 'var', 'wbr', 'text',
            'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt'
        ]

    };
	gulp.src(path.src.html)
	    .pipe(htmlbeautify(options))
	    .pipe(gulp.dest(path.build.html))
});

gulp.task('build', [
	'html:build',
	'js:build',
	'css:build',
	'img:build',
	'pug:build',
	'fonts:build'
]);

gulp.task('watch', function() {
	watch([path.watch.js], function() {
		gulp.start('js:build');
	});
	watch([path.watch.html], function() {
		gulp.start('html:build');
	});
	watch([path.watch.css], function() {
		gulp.start('css:build');
	});
	watch([path.watch.pug], function() {
		gulp.start('pug:build');
	});
	watch([path.watch.img], function() {
		gulp.start('img:build');
	});
	watch([path.watch.fonts], function() {
		gulp.start('fonts:build');
	});
});

gulp.task('clean', function() {
	del.sync(path.clean);
});

gulp.task('cache:clear', function () {
	cache.clearAll();
});


// export default defaultTasks
gulp.task('default', [
	'clean',
    'build',
	'webserver',
	'watch'	
]);