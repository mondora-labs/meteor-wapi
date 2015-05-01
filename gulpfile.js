var bs      = require("browser-sync");
var sh      = require("child_process").execSync;
var fs      = require("fs");
var gulp    = require("gulp");
var ghPages = require("gulp-gh-pages");
var mocha   = require("gulp-spawn-mocha");
var mkdirp  = require("mkdirp");

/*
*   Task to run unit tests
*/
gulp.task("test", function () {
    var stream = gulp.src(["./test/unit/**/*.js", "./test/integration/**/*.js"])
        .pipe(mocha({
            reporter: "mochawesome",
            istanbul: {
                dir: "./builds/coverage/"
            },
            env: {
                NODE_PATH: "./src/",
                MOCHAWESOME_REPORTDIR: "./builds/tests/",
                MOCHAWESOME_REPORTNAME: "index"
            }
        }))
        .on("error", function (ignore) {
            /*
            *   Failing tests are counted as errors and therefore break the
            *   stream. Catch and ignore them. Also, terminate the stream,
            *   otherwise we might have problems with gulp.watch
            */
            bs.reload();
            stream.end();
        })
        .pipe(bs.reload({stream: true}));
    return stream;
});

/*
*   Task to lint source code using jscs
*/
gulp.task("jscs", function () {
    /*
    *   Generate the report
    */
    mkdirp.sync("./builds/jscs/");
    try {
        sh("../../node_modules/.bin/jscs ../../src/ --reporter ../../node_modules/jscs-html-reporter/jscs-html-reporter.js", {
            cwd: "./builds/jscs/"
        });
    } catch (ignore) {
        // Prevent exiting the process on jscs errors
    }
    /*
    *   Copy resources needed by the html reporter over to ./builds/jscs/
    */
    sh("cp ./node_modules/jscs-html-reporter/jscs-html-reporter.css ./builds/jscs/");
    sh("cp ./node_modules/jscs-html-reporter/toggle.js ./builds/jscs/");
    /*
    *   Replace resources paths, since we copy those resources over to
    *   ./builds/jscs/
    */
    var htmlReport = fs.readFileSync("./builds/jscs/jscs-html-report.html", "utf8");
    htmlReport = htmlReport.replace(
        new RegExp("../../node_modules/jscs-html-reporter/", "g"),
        ""
    );
    fs.writeFileSync("./builds/jscs/index.html", htmlReport, "utf8");
    sh("rm ./builds/jscs/jscs-html-report.html");
    /*
    *   BrowserSync reload
    */
    bs.reload();
});

/*
*   Setup the development server
*/
gulp.task("server", function() {
    bs({
        server: {
            baseDir: "./builds/",
            directory: true
        },
        port: 8080,
        ghostMode: false,
        injectChanges: false,
        notify: false
    });
});

/*
*   Task to rerun tests and linting on file change
*/
gulp.task("dev", ["server"], function () {
    return gulp.watch([
        "src/**/*.js",
        "test/**/*.js"
    ], ["jscs", "test"]);
});

/*
*   Task to deploy to github pages
*/
gulp.task("gh-pages", ["test", "jscs"], function() {
    return gulp.src("./builds/**/*").pipe(ghPages());
});

/*
*   Default task
*/
gulp.task("default", [
    "jscs",
    "test",
    "dev"
]);
