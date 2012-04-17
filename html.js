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

/*
function __setAttributes( elem, args ) {
    for( var i = 0; i < args.length; i++ ) {
        var attr = args[i];
        var attr_type = typeof(attr);
        if( attr_type == 'function' ) {
            attr = attr.call( elem );
            attr_type = typeof(attr);
        }
        if( attr_type == 'object' ) {
            for( var k in attr ) {
                var v = attr[k];
                elem.setAttribute( k, v );
            }
        } else if( attr_type == 'undefined' ) {
        } else { throw new Error(); }
    }
};

function __appendChildren( elem, args ) {
    for( var i = 0; i < args.length; i++ ) {
        var child = args[i];
        var child_type = typeof(child);
        if( child_type == 'function' ) {
            child = child.call( elem );
            child_type = typeof(child);
        }
        if( child_type == 'object' ) {
            elem.appendChild( child );
        } else if( child_type == 'undefined' ) {
        } else { throw new Error(); }
    }
}

function __createElement( type ) {
    var func_elem = function() {
        var _elem = document.createElement( type );
        __setAttributes( _elem, arguments );
        var func_container = function() {
            __appendChildren( _elem, arguments );
            return _elem;
        };
        return func_container;
    };
    return func_elem;
}

function __createAttribute( name, default_value ) {
    var func_attr = function() {
        // save the arguments to the attribute
        var args = arguments;
        var func_container = function() {
            // the element is passed as this to the container
            var elem = this;
            var attr = default_value;
            // process each argument, passing the element and attribute reference
            for( var i = 0; i < args.length; i++ ) {
                var arg = args[i];
                var arg_type = typeof(arg);
                if( arg_type == 'function' ) {
                    arg = arg.call( elem, attr );
                    arg_type = typeof(arg);
                }
                if( arg_type == 'object' ) {
                } else if( arg_type == 'string' ) {
                } else if( arg_type == 'undefined' ) {
                } else { throw new Error(); }
            }
        };
        return func_container;
    };
    return func_attr;
}
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
            if( arg_type == 'object' && arg.nodeType == 1 ) { /* How do we know if this is an HTML Element? */
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
var html = {
    'div': html_div,
    'style': html_style,
    'disabled': html_disabled,
};

var css = {
    'display': css_display,
    'color': css_color,
    'none': css_none,
    'white': css_white,
};

return {
    'html': html,
    'css': css,
};
});
