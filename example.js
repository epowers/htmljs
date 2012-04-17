/*
require(['html','css'],function(){
function(html, css){

var div = html.div;
var style = html.style;
var display = css.display;
var color = css.color;
var none = css.none;
var white = css.white;
var disabled = html.disabled;
*/

/*require(['html.div','html.style','css.display','css.color','css.none','css.white','html.disabled'],function(){
function(div, style, display, color, none, white, disabled){

div( style( display( none ), color( white )), disabled );

});*/

(function(){
    function none() {
        var func_none = function() {
            // validate that parent is display.
            var name = this.name;
            if( name != "display" ) { throw new Error(); }
            return "none";
        };
        return func_none;
    }
    function display() {
        var type = 'display';
        var value;
        var argc = arguments.length;
        for( var i = 0; i < argc; i++ ) {
            var arg = arguments[i];
            var arg_type = typeof(arg);
            if( arg_type == 'function' ) {
                arg = arg.call( display );
                arg_type = typeof(arg);
            }
            if( arg_type == 'string' ) {
                if( typeof(value) != 'undefined' ) { throw new Error(); }
                value = arg;
            } else { throw new Error(); }
        }
        var func_display = function() {
            return type + ':' + value;
        };
        return func_display;
    }
    function style() {
        var type = 'style';
        var values = [];
        var argc = arguments.length;
        for( var i = 0; i < argc; i++ ) {
            var arg = arguments[i];
            var arg_type = typeof(arg);
            if( arg_type == 'function' ) {
                arg = arg.call( style );
                arg_type = typeof(arg);
            }
            if( arg_type == 'string' ) {
                values[values.length] = arg;
            } else { throw new Error(); }
        }
        var value = values.join(';');
        var func_style = function() {
            this.setAttribute( type, value );
        }
        return func_style;
    }
    function div() {
        var type = 'div';
        function F() {}
        F.prototype = document.createElement( type );
        F.prototype.constructor = F;
        var _elem = new F();

        var argc = arguments.length;
        for( var i = 0; i < argc; i++ ) {
            var arg = arguments[i];
            var arg_type = typeof(arg);
            if( arg_type == 'function' ) {
                arg = arg.call( _elem );
                arg_type = typeof(arg);
            }
            if( arg_type == 'object' && arg.nodeType == 1 ) { /* How do we know if this is an HTML Element? */
                _elem.appendChild( arg );
            } else { throw new Error(); }
        }

        return _elem;
    }

    window.html = {
        div: div,
        style: style,
        display: display,
        none: none
    };
})();
