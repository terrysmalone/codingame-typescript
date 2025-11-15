This is a repository to keep track off my Typescript solutions to CodinGame problems. 

Due to the way the built in CodinGame IDE works, none of the solutions are meant to be built and run here.  

## Multi file workflow

### Create a global for readline

`readline` is provided by the CodinGame runtime so create a global in `src` so the code can compile `global.t.ts`

```
declare function readline(): string;

```

### Add rollup

To bundle the Typescript install rollup with `npm install --save-dev rollup @rollup/plugin-typescript typescript`.

Create a rollup config (`rollup.config.js`) like:

```
import typescript from "rollup-plugin-typescript2";

export default {
    input: "src/player.ts",
    output: {
        file: "dist/combined.js",
    },
    plugins: [typescript()]
};
```

In `package.json` scripts add `"combine": "rollup -c"`


