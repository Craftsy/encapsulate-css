import css from 'css';

const excludedSelectors = ['>', '+', '~'];

export default function encapsulateCss(cssString, className) {
    const cssAst = css.parse(cssString);
    const transformedAst = transformCssNode(cssAst, className);
    return css.stringify(transformedAst, {indent: '    '});
}

function transformCssNode(astNode, className) {
    return Object.keys(astNode).reduce(function(newNode, key) {
        if (key === 'selectors') {
            const selectors = astNode[key];
            newNode[key] = selectors.map(function(selector) {
                const selectors = selector.split(/\s+/);
                return selectors.map(function(selector) {
                    let transformedSelector;
                    if (excludedSelectors.indexOf(selector) === -1) {
                        transformedSelector = selector.replace(/^(.*?)(:|$)(.*)?/, '$1.' + className + '$2$3');
                    } else {
                        transformedSelector = selector;
                    }
                    return transformedSelector;
                }).join(' ');
            });
        } else if (Array.isArray(astNode[key])) {
            newNode[key] = transformCssNode(astNode[key], className);
        } else if (astNode[key] instanceof Object) {
            newNode[key] = transformCssNode(astNode[key], className);
        } else {
            newNode[key] = astNode[key];
        }
        return newNode;
    }, Array.isArray(astNode) ? [] : {});
}
