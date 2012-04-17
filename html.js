define( [], function( dojo ) {

/*
* Element, attribute, and container functions.
*
* Each function assembles parameters, and returns a function.
* Return functions return resolved objects.
* The parent of each function calls the function with the parent as this.
*
* Attributes and children can validate the parent.
*
*/

function HtmlElementFactory( type ) {
    var func_element = function() {
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
            if( arg_type == 'object' && arg.nodeType == 1 ) {
                _elem.appendChild( arg );
            } else if( arg_type == 'undefined' ) {
            } else { throw new Error(); }
        }

        return _elem;
    }
    return func_element;
}

function HtmlAttributeFactory( type ) {
    var func_attr = function() {
        var values = [];
        var argc = arguments.length;
        for( var i = 0; i < argc; i++ ) {
            var arg = arguments[i];
            var arg_type = typeof(arg);
            if( arg_type == 'function' ) {
                arg = arg.call( arg );
                arg_type = typeof(arg);
            }
            if( arg_type == 'string' ) {
                values[values.length] = arg;
            } else { throw new Error(); }
        }
        var value = values.join(';');
        var func_container = function() {
            this.setAttribute( type, value );
        }
        return func_container;
    }
    return func_attr;
}

function CSSPropertyFactory( type ) {
    var func_property = function() {
        var value;
        var argc = arguments.length;
        for( var i = 0; i < argc; i++ ) {
            var arg = arguments[i];
            var arg_type = typeof(arg);
            if( arg_type == 'function' ) {
                arg = arg.call( arg );
                arg_type = typeof(arg);
            }
            if( arg_type == 'string' ) {
                if( typeof(value) != 'undefined' ) { throw new Error(); }
                value = arg;
            } else { throw new Error(); }
        }
        var func_container = function() {
            return type + ':' + value;
        };
        return func_container;
    };
    return func_property;
}

function ValueFactory( type ) {
    var func_value = function() {
        // validate that parent is display.
        //var name = this.name;
        //if( name != "display" ) { throw new Error(); }
        return type;
    };
    return func_value;
}

var html_div = HtmlElementFactory( 'div' );
var html_style = HtmlAttributeFactory( 'style' );

var css_display = CSSPropertyFactory( 'display' );
var css_color = CSSPropertyFactory( 'color' );

var css_none = ValueFactory( 'none' );
var css_white = ValueFactory( 'white' );

var html_disabled = ValueFactory( 'disabled' );

// Declare Public methods
return {
    'div': html_div,
    'style': html_style,
    'disabled': html_disabled,
    'display': css_display,
    'color': css_color,
    'none': css_none,
    'white': css_white,
};
});
