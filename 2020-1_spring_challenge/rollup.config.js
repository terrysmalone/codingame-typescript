import typescript from "rollup-plugin-typescript2";

export default {
    input: "src/player.ts",
    output: {
        file: "dist/combined.js",
    },
    plugins: [typescript()]
};
