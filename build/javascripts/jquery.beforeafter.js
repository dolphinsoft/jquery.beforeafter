/* *  Project: Before After *  Description: Parses CSS for pseudo classes before & after, if found divs are injected into the DOM with the respective classes. *  Author: Dustin Fadler *  License: GNU General Public License, version 3 (GPL-3.0) http://opensource.org/licenses/GPL-3.0 */;(function ($, window, undefined) {    // Checkes for a Modernizr test which if undefined will fall back to targeting IE7     if (!Modernizr.generatedcontent || (document.all && !document.querySelector)) {        var beforeAfter = 'beforeAfter',            pseudoPattern = ':before|:after',            contentPattern = "content: '.'",            defaults = {                stylesheet: undefined            };        function BeforeAfter(ele, options) {            this.ele = typeof (ele) === 'object' ? ele : window.document; // This is probably unnecessary            // Should consider extending the plugin with its defaults * Check the patterns document for more information            this.defaults = {                stylesheet: undefined // A stylesheet my be passed to prevent the plugin from parsing every stylesheet            };            this.options = options;            this.configuration = $.extend({}, this.defaults, this.options); // Merges defaults with the passed options            this.init(); // initializes the plugin        }        BeforeAfter.prototype.getStylesheet = function () {            // Need flow control for single and multiple stylesheets            var stylesheets = document.styleSheets,                stylesheetsLength = stylesheets.length,                // Needs to work with an array                stylesheet = this.configuration.stylesheet !== undefined ? this.configuration.stylesheet : undefined,                pattern = new RegExp(stylesheet);            for (var i = 0; i < stylesheetsLength; i++) {                if (pattern.test(stylesheets[i].href)) {                    return stylesheets[i];                }            }        };        BeforeAfter.prototype.parseStylesheet = function (cssFile) {            var stylesheet = cssFile,                rules = stylesheet.rules,                rulesLength = rules.length,                pattern = new RegExp(pseudoPattern),                matchedRules = [];            for (var i = 0; i < rulesLength; i++) {                if (pattern.test(rules[i].selectorText)) {                    matchedRules.push(rules[i]);                }            }            return matchedRules;        };        BeforeAfter.prototype.getSelector = function (selectorText) {            var pattern = new RegExp(pseudoPattern),                pseudoClass = selectorText.match(pseudoPattern),                pseudoClass = pseudoClass[0].slice(1, pseudoClass[0].length),                selectorText = selectorText.replace(pattern, ''),                selectorClassPair = {                    selectorText: selectorText,                    pseudoClass: pseudoClass                };            return selectorClassPair;        };        BeforeAfter.prototype.appendContainer = function (selector, pseudoClass, content) {            var content = content || '.';            if (pseudoClass === 'before') {                $(selector).prepend('<div class="before">' + content + '</div>');            } else {                $(selector).append('<div class="after">' + content + '</div>');            }        };        BeforeAfter.prototype.init = function () {            var stylesheet = this.getStylesheet(),                parsedStylesheet = this.parseStylesheet(stylesheet),                rulesLength = parsedStylesheet.length,                selectors = [],                selectorsLength;            for (var i = 0; i < rulesLength; i++) {                var selectorText = parsedStylesheet[i].selectorText,                    selector = this.getSelector(selectorText),                    pattern = new RegExp(contentPattern),                    cssText = parsedStylesheet[i].cssText,                    contentCharacter = (parsedStylesheet[i].style.content).charAt(1);                this.appendContainer(selector.selectorText, selector.pseudoClass, contentCharacter);            }        }        // A really lightweight plugin wrapper around the constructor        // preventing against multiple instantiations        $.fn[beforeAfter] = function (options) {            return this.each(function () {                var ele = this;                if (!$.data(this, 'plugin_' + beforeAfter)) {                    $.data(this, 'plugin_' + beforeAfter, new BeforeAfter(ele, options));                }            });        }    }})(jQuery, window);$(window).bind('load', function () {    $(document).beforeAfter({        stylesheet: 'site.css'    });});