import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        alias: {
            "@src": "./src",
            "@test": "./test",
        },
        root: "./",
    },
    resolve: {
        alias: {
            "@src": "./src",
            "@test": "./test",
        },
    },
    plugins: [
        // This is required to build the test files with SWC
        swc.vite({
            // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
            module: { type: "es6" },
        }),
    ],
});
