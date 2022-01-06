var forceDeploy = require('gulp-jsforce-deploy');
var gulp = require('gulp');
var del = require('del');
var zip = require('gulp-zip');
var rename = require("gulp-rename");
var replace = require('gulp-replace');
var file = require('gulp-file');
var dotenv = require('dotenv');
dotenv.config();

// define variables from process.env
const pageName = process.env.PAGE_NAME;
const apiVersion = process.env.API_VERSION;
const resources = process.env.RESOURCE_NAME;
const baseHref = process.env.BASE_HREF;
const devResources = process.env.DEV_RESOURCES_URL;
const distPath = process.env.DIST_PATH || 'dist/Ranger-NXTApp';

let controller = process.env.CONTROLLER;
controller = controller ? `controller="${controller}"` : ``;

let extensions = process.env.EXTENSIONS;
extensions = extensions ? `extensions="${extensions}"` : ``;

const otherPageAttrs = `sidebar="false" standardStylesheets="false" showHeader="false"`;

// Here we describe meta.xml files to package
const pageMetaXML = `<?xml version="1.0" encoding="UTF-8"?>
<ApexPage xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>${apiVersion}</apiVersion>
    <availableInTouch>false</availableInTouch>
    <confirmationTokenRequired>false</confirmationTokenRequired>
    <label>${pageName}</label>
</ApexPage>`;

const resourcesMetaXML = `<?xml version="1.0" encoding="UTF-8"?>
<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
    <cacheControl>Public</cacheControl>
    <contentType>application/x-zip-compressed</contentType>
</StaticResource>`;

const packageXML = `<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types>
        <members>*</members>
        <name>StaticResource</name>
    </types>
    <version>${apiVersion}</version>
</Package>`;

// Task to remove package folder 
gulp.task('rm', function () { return del(['./package']) });
gulp.task('rmmap', function () { return del(['./dist/Ranger-NXTApp/*.js.map']) });

gulp.task('create-package', function () {
  return gulp.src('./package', { allowEmpty: true })
  .pipe(file(`package.xml`, packageXML))
    .pipe(gulp.dest('package/'));
});

gulp.task('page_to_prod', function () {
  gulp.src([distPath+'/index.html'])
    .pipe(replace('<!doctype html>', ''))
    .pipe(replace('<html lang="en">', `<apex:page ${otherPageAttrs} >`))
    .pipe(replace(`<base href="${baseHref}">`, `<base href="${baseHref}"/>`))
    .pipe(replace('<meta charset="utf-8">', `<meta charset="utf-8"/>`))
    .pipe(replace('initial-scale=1">', `initial-scale=1"/>`))
    .pipe(replace('href="favicon.ico">', `href="{!URLFOR($Resource.${resources}, 'favicon.ico')}"/>`))
    .pipe(replace(`<script type="text/javascript" src="`, `<script type="text/javascript" src="{!URLFOR($Resource.${resources}, '`))
    .pipe(replace(`.js"></script>`, `.js')}"></script>`))
    .pipe(replace('</body>', `<script type="text/javascript">
    window._VfResources = '{!URLFOR($Resource.${resources})}';
    </script></body>`))
    .pipe(replace('</html>', `</apex:page>`))
    .pipe(rename(function (path) {
      path.dirname += "/pages";
      path.basename = `${pageName}`;
      path.extname = ".page"
    }))
    .pipe(file(`pages/${pageName}.page-meta.xml`, pageMetaXML))
    .pipe(gulp.dest('package/'));
});
gulp.task('page_to_dev', function () {
  gulp.src([distPath+'/index.html'])
    .pipe(replace('<!doctype html>', ''))
    .pipe(replace('<html lang="en">', `<apex:page ${otherPageAttrs} ${controller} ${extensions}>`))
    .pipe(replace(`<base href="${baseHref}">`, `<base href="${baseHref}"/>`))
    .pipe(replace('<meta charset="utf-8">', `<meta charset="utf-8"/>`))
    .pipe(replace('initial-scale=1">', `initial-scale=1"/>`))
    .pipe(replace('href="favicon.ico">', `href="${devResources}/favicon.ico"/>`))
    .pipe(replace(`<script type="text/javascript" src="`, `<script type="text/javascript" src="${devResources}/`))
    .pipe(replace('</body>', `<script type="text/javascript">
    window._VfResources = '${devResources}';
    </script>
    </body>`))
    .pipe(replace('</html>', `</apex:page>`))
    .pipe(rename(function (path) {
      path.dirname += "/pages";
      path.basename = `${pageName}`;
      path.extname = ".page"
    }))
    .pipe(file(`pages/${pageName}.page-meta.xml`, pageMetaXML))
    .pipe(gulp.dest('package/'));
});

gulp.task('staticresources', function () {
  return gulp.src('./'+distPath+'/**')
    .pipe(zip(`${resources}.resource`))
    .pipe(file(`${resources}.resource-meta.xml`, resourcesMetaXML))
    .pipe(gulp.dest('package/staticresources/'));
});

gulp.task('staging-deploy', function () {
  return gulp.src('./package/**', { base: "." })
    .pipe(zip('package.zip'))
    .pipe(forceDeploy({
      username: process.env.STAGING_USERNAME,
      password: process.env.STAGING_PASSWORD,
      loginUrl: process.env.STAGING_URL
    }))
});

gulp.task('dev-deploy', function () {
  return gulp.src('./package/**', { base: "." })
    .pipe(zip('package.zip'))
    .pipe(forceDeploy({
      username: process.env.DEV_USERNAME,
      password: process.env.DEV_PASSWORD,
      loginUrl: process.env.DEV_URL
    }))
});


gulp.task('dev01-deploy', function () {
  return gulp.src('./package/**', { base: "." })
    .pipe(zip('package.zip'))
    .pipe(forceDeploy({
      username: process.env.DEV01_USERNAME,
      password: process.env.DEV01_PASSWORD,
      loginUrl: process.env.DEV01_URL
    }))
});

gulp.task('dev02-deploy', function () {
  return gulp.src('./package/**', { base: "." })
    .pipe(zip('package.zip'))
    .pipe(forceDeploy({
      username: process.env.DEV02_USERNAME,
      password: process.env.DEV02_PASSWORD,
      loginUrl: process.env.DEV02_URL
    }))
});

gulp.task('partialdev-deploy', function () {
  return gulp.src('./package/**', { base: "." })
    .pipe(zip('package.zip'))
    .pipe(forceDeploy({
      username: process.env.PARTIAL_DEV_USERNAME,
      password: process.env.PARTIAL_DEV_PASSWORD,
      loginUrl: process.env.PARTIAL_DEV_URL
    }))
});

gulp.task('prod-deploy', function () {
  return gulp.src('./package/**', { base: "." })
    .pipe(zip('package.zip'))
    .pipe(forceDeploy({
      username: process.env.PROD_USERNAME,
      password: process.env.PROD_PASSWORD,
      loginUrl: process.env.PROD_URL
    }))
});

gulp.task('deploy', function () {
  gulp.src('./package/**', { base: "." })
    .pipe(zip('package.zip'))
    .pipe(forceDeploy({
      username: process.env.SF_USERNAME,
      password: process.env.SF_PASSWORD,
      //loginUrl: process.env.LOGIN_URL
    }))
});

gulp.task('build-static', gulp.series('create-package', 'staticresources'))
gulp.task('build-package', gulp.series('create-package', 'page_to_prod', 'staticresources'))
gulp.task('build-dev-package', gulp.series('create-package', 'page_to_dev'))