import gulp from 'gulp';
import del from 'del';
import autoprefixer from 'autoprefixer';
import hb from 'gulp-hb';
import tailwindcss from 'tailwindcss';
import postcss from 'gulp-postcss';
import webpack from 'webpack-stream';
import cssnano from 'cssnano';
import postcssImport from 'postcss-import';
import postCSSMixins from 'postcss-mixins';
import postcssPresetEnv from 'postcss-preset-env';
import browsersync from 'browser-sync';
import hbLayouts from 'handlebars-layouts';
import posthtml from 'gulp-posthtml';
import posthtmlInlineAssets from 'posthtml-inline-assets';
import minifyClassnames from 'posthtml-minify-classnames';
import prettier from 'gulp-prettier';
import cache from 'gulp-cache';
import imagemin from 'gulp-imagemin';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";

// Optimized paths configuration
const paths = {
  dist: "./dist/",
  views: {
    src: "./src/**/*.html",
    layouts: "./src/layouts/",
    partials: "./src/partials/",
    pages: "./src/*.html",
    dist: "./dist/",
    watch: "./src/**/*.{html,hbs}"
  },
  js: {
    src: "./src/js/app.js",
    dist: "./dist/js/",
    watch: "./src/js/**/*.js"
  },
  css: {
    src: "./src/css/*.css",
    dist: "./dist/css/",
    watch: ["./src/css/**/*.css", "./src/**/*.{html,hbs}"]
  },
  fonts: {
    src: "./src/fonts/**/*.{woff,woff2}",
    dist: "./dist/fonts/",
    watch: "./src/fonts/**/*.{woff,woff2}"
  },
  images: {
    src: ["./src/images/**/*.{jpg,jpeg,png,gif,svg,webp}"],
    dist: "./dist/images/",
    watch: "./src/images/**/*.{jpg,jpeg,png,gif,svg,webp}"
  }
};

// Error handling
const errorHandler = function(title) {
  return {
    errorHandler: notify.onError({
      title: title || "Build Error",
      message: "Error: <%= error.message %>"
    })
  };
};

// Clean task with improved error handling
const clean = () => del(paths.dist, { force: true });

// Optimized PostCSS configuration
const CSSplugins = [
  postcssImport,
  postCSSMixins,
  postcssPresetEnv({
    stage: 0,
    features: {
      "nesting-rules": true,
      "custom-media": true
    }
  }),
  tailwindcss,
  autoprefixer,
  cssnano({
    preset: ['default', {
      discardComments: { removeAll: true },
      normalizeWhitespace: false,
      colormin: false,
      zindex: false
    }]
  })
];

// Optimized CSS task
const styles = () => {
  return gulp.src(paths.css.src)
    .pipe(plumber(errorHandler("CSS Error")))
    .pipe(postcss(CSSplugins))
    .pipe(gulp.dest(paths.css.dist))
    .pipe(browsersync.stream());
};

// Optimized JS task
const scripts = async () => {
  const webpackConfig = isProduction ? 
    (await import('./webpack.config.build.js')).default : 
    (await import('./webpack.config.dev.js')).default;

  return gulp.src(paths.js.src)
    .pipe(plumber(errorHandler("JavaScript Error")))
    .pipe(webpack({ config: webpackConfig }))
    .pipe(gulp.dest(paths.js.dist))
    .pipe(browsersync.stream());
};

// Optimized fonts task
const fonts = () => {
  return gulp.src(paths.fonts.src)
    .pipe(plumber(errorHandler("Fonts Error")))
    .pipe(gulp.dest(paths.fonts.dist));
};

// Optimized images task with caching
const images = () => {
  return gulp.src(paths.images.src)
    .pipe(plumber(errorHandler("Image Error")))
    .pipe(cache(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 80, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: false },
          { cleanupIDs: false }
        ]
      })
    ])))
    .pipe(gulp.dest(paths.images.dist))
    .pipe(browsersync.stream());
};

// Optimized views task
const views = () => {
  const hbStream = hb()
    .partials(paths.views.layouts + "**/*.{hbs,html}")
    .partials(paths.views.partials + "**/*.{hbs,html}")
    .helpers(hbLayouts);

  return gulp.src(paths.views.src)
    .pipe(plumber(errorHandler("Template Error")))
    .pipe(hbStream)
    .pipe(prettier({ singleQuote: true }))
    .pipe(gulp.dest(paths.views.dist))
    .pipe(browsersync.stream());
};

// Optimized CSS class mangling for production
const mangleCSS = () => {
  const transforms = {
    style: {
      resolve(node) {
        return node.tag === "link" && node.attrs && node.attrs.rel === "stylesheet" && `${node.attrs.href}`;
      },
      transform(node, data) {
        node.tag = "style";
        node.content = [data.buffer.toString("utf8")];
        delete node.attrs.href;
        delete node.attrs.rel;
      }
    }
  };

  const filter = /^\.(flex|hidden|dark|transition|transform|ease-in|ease-out|duration-|opacity-|scale-|translate-|shadow-)/;
  const plugins = [
    posthtmlInlineAssets({ transforms }),
    minifyClassnames({ filter })
  ];

  return gulp.src(["dist/*.html"])
    .pipe(plumber(errorHandler("Mangle CSS Error")))
    .pipe(posthtml(plugins))
    .pipe(gulp.dest(paths.dist));
};

// Optimized development server
const serve = (done) => {
  browsersync.init({
    server: "./dist/",
    port: 4000,
    notify: false,
    open: false,
    ui: false,
    ghostMode: false,
    reloadOnRestart: true
  });

  // Optimized watch tasks with debounce
  const watchOptions = { usePolling: true, delay: 100 };
  gulp.watch(paths.views.watch, watchOptions, views);
  gulp.watch(paths.css.watch, watchOptions, styles);
  gulp.watch(paths.images.watch, watchOptions, images);
  gulp.watch(paths.js.watch, watchOptions, scripts);

  done();
};

// Export tasks
export {
  clean,
  styles as css,
  scripts as js,
  fonts,
  images,
  views,
  mangleCSS,
  serve
};

// Build task
export const build = gulp.series(
  clean,
  gulp.parallel(styles, scripts, fonts, images, views),
  mangleCSS
);

// Default task
export default gulp.series(
  clean,
  gulp.parallel(styles, scripts, fonts, images, views),
  serve
);
