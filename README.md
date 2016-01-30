encapsulate-css
============================

TLDR; A utility function to namespace your css. There is an [associated jsx plugin](https://github.com/craftsy/babel-plugin-encapsulate-jsx).

why
---

At Craftsy, we use a [monorepo](http://danluu.com/monorepo/): each React component is in it's own npm package.

`src/example/package.json`:
```json
{
  "name": "@craftsy/example",
  "version": "1.0.0"
}
```

`src/example/yay.css`:
```css
.example {
    background: #00ff00 no-repeat fixed center;
}

.awesomeness {
    border: 1px solid black;
}
```

`src/example/index.js`:
```javascript
import React from 'react';

export default Example({text, url, background, imgUrl, imgAlt}) {
    return (
        <div className="example" style={{backgroundImage: `url(${background})`}}>
            <h2>{text}</h2>
            <a href={url}>
                <div className="awesomeness">
                    <img src={imgUrl} alt={imgAlt}/>
                </div>
            </a>
        </div>
    );
}
```

We realized that to maximize component reuse, we'd have to make sure that css is scoped to just that component AND it's version (so we could potentially have 2 versions of one component on a page). We could just use BEM or a namespacing pattern, but then we'd have to change the CSS and JSX EVERY time we pushed a new version. We also knew we'd make a lot of mistakes.

**So we automated namespacing.**

This utility function takes a className and namespaces css so all selectors use that className.

Use
---

example use:
```javascript
import encapsulateCss from 'encapsulate-css';
import fs from 'fs';

console.log(encapsulateCss(
  fs.readfileSync('src/example/yay.css', '_craftsy_example_1_0_0')));

```

output:
```css
.example._craftsy_example_1_0_0 {
    background: #00ff00 no-repeat fixed center;
}

.awesomeness._craftsy_example_1_0_0 {
    border: 1px solid black;
}
```

Building
--------
`npm run test` runs the tests against the ES6 src code.

`npm run build` transpiles the ES6 code to ES5 and puts it in the `dist` directory.

