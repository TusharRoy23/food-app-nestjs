const madge = require('madge');

madge('src/app.module.ts')
    .then(res => {
        console.log(res.circular());
        return res;
    })
    .then((res) => res.image('./graph.gv', true))
    .then((writtenImagePath) => {
        console.log('Image written to ' + writtenImagePath);
    });