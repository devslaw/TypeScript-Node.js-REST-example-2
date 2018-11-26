const { FuseBox } = require("fuse-box");
const BUILD_DIRECTORY = 'dist';

const fuse = FuseBox.init({
    homeDir: "src",
    output: `${BUILD_DIRECTORY}/$name.js`,
    tsConfig : "tsconfig.json",
    cache: false,
});


fuse.bundle("index")
    .watch("src/**/*.ts")
    .instructions(" > [index.ts]")
    .completed(proc => proc.start());

// fuse.bundle("test")
//     .instructions(` > [tests/**/*.spec.ts]`);
//
// fuse.bundle("seeder")
//     .instructions(` > [tests/seeder/Seeder.ts]`);

fuse.run();