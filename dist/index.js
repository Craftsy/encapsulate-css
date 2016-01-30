'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = encapsulateCss;

var _css = require('css');

var _css2 = _interopRequireDefault(_css);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var excludedSelectors = ['>', '+', '~'];

function encapsulateCss(cssString, className) {
    var cssAst = _css2.default.parse(cssString);
    var transformedAst = transformCssNode(cssAst, className);
    return _css2.default.stringify(transformedAst, { indent: '    ' });
}

function transformCssNode(astNode, className) {
    return Object.keys(astNode).reduce(function (newNode, key) {
        if (key === 'selectors') {
            var selectors = astNode[key];
            newNode[key] = selectors.map(function (selector) {
                var selectors = selector.split(/\s+/);
                return selectors.map(function (selector) {
                    var transformedSelector = undefined;
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