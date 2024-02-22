const gulp = require('gulp');
const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');      //ts
// const tsPaths = require('tsconfig-paths');  //路徑映射
const clean = require('gulp-clean');        //刪除

const tsProject = ts.createProject('tsconfig.json');    //引用ts設定檔



// 刪除資料夾
gulp.task('clean', () => {
    return gulp.src('dist', { read: true })
        .pipe(clean());
})

//引入ts設定檔
gulp.task('compile-ts', () => {


    const tsResult = tsProject.src()    //選擇ts文件
        .pipe(tsProject());             //編譯ts程式

    return tsResult.js.pipe(gulp.dest('dist'));
})



// 定義一個名為 'compress' 的 Gulp 任務來壓縮 JavaScript 文件
gulp.task('compress', async function () {
    return [
        //編譯ts檔
        // await gulp.src('src/**/*.ts') //選擇要壓縮的來源檔案路徑
        await gulp.src('dist/**/*.js')
            .pipe(uglify())           //執行壓縮
            .pipe(gulp.dest('dist')), // 輸出壓縮後的檔案到指定目錄

        //複製圖片
        await gulp.src('src/public/**/*')
            .pipe(gulp.dest('dist/public'))
    ]
});

// 預設任務，執行 'gulp' 時執行 'compress' 任務
gulp.task('default', gulp.series('clean', 'compile-ts', 'compress'));
