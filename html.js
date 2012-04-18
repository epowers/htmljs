define( [], function() {

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

function __resolveValues( args ) {
    var values = [];
    var argc = args.length;
    for( var i = 0; i < argc; i++ ) {
        var arg = args[i];
        var arg_type = typeof(arg);
        if( arg_type == 'function' ) {
            arg = arg.call( arg );
            arg_type = typeof(arg);
        }
        if( arg_type == 'string' ) {
            values[values.length] = arg;
        } else { throw new Error(); }
    }
    return values;
}

function __resolveSingleValue( args ) {
    var value;
    var argc = args.length;
    for( var i = 0; i < argc; i++ ) {
        var arg = args[i];
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
    return value;
}

function __appendChildren( elem, args ) {
    var argc = args.length;
    for( var i = 0; i < argc; i++ ) {
        var arg = args[i];
        var arg_type = typeof(arg);
        if( arg_type == 'function' ) {
            arg = arg.call( elem );
            arg_type = typeof(arg);
        }
        if( arg_type == 'object' && arg.nodeType == 1 ) {
            elem.appendChild( arg );
        } else if( arg_type == 'undefined' ) {
        } else { throw new Error(); }
    }
}

function __createElement( type ) {
    function func_container() { }
    var typeof_type = typeof(type);
    if( typeof_type == 'string' ) {
        func_container.prototype = document.createElement( type );
    } else if( typeof_type == 'object' ) {
        func_container.prototype = type;
    } else if( typeof_type == 'undefined' ) {
        func_container.prototype.appendChild = function() {};
    } else { throw new Error(); }
    func_container.prototype.constructor = func_container;
    var _elem = new func_container;
    return _elem;
}

function HtmlElementFactory( type ) {
    function func_element() {
        var _elem;
        if( typeof(type) != 'string' || this instanceof func_element ) {
            _elem = __createElement( type );
            __appendChildren( _elem, arguments );
        } else {
            var args = Array.prototype.slice.call( arguments );
            _elem = args[0];
            args = args.slice(1);
            __appendChildren( _elem, args );
        }
        return _elem;
    }
    return func_element;
}

function HtmlCssAttributeFactory( type ) {
    function func_attr() {
        var values = __resolveValues( arguments );
        var value = values.join(';');
        var func_container = function() {
            this.setAttribute( type, value );
        }
        return func_container;
    }
    return func_attr;
}

function CSSPropertyFactory( type ) {
    function func_property() {
        var value = __resolveSingleValue( arguments );
        function func_container() {
            return type + ':' + value;
        };
        return func_container;
    };
    return func_property;
}

function ValueFactory( type ) {
    function func_value() {
        // validate that parent is display.
        //var name = this.name;
        //if( name != "display" ) { throw new Error(); }
        return type;
    };
    return func_value;
}

var html_html = HtmlElementFactory();
var html_head = HtmlElementFactory();
var html_body = HtmlElementFactory( document.body );
var html_div = HtmlElementFactory( 'div' );
var html_style = HtmlCssAttributeFactory( 'style' );

var css_display = CSSPropertyFactory( 'display' );
var css_color = CSSPropertyFactory( 'color' );

var css_none = ValueFactory( 'none' );
var css_white = ValueFactory( 'white' );
var css_black = ValueFactory( 'black' );

var html_disabled = ValueFactory( 'disabled' );

// Declare Public methods
return {
    'html': html_html,
    'head': html_head,
    'body': html_body,
    'div': html_div,
    'style': html_style,
    'disabled': html_disabled,
    'display': css_display,
    'color': css_color,
    'none': css_none,
    'white': css_white,
    'black': css_black,
};
});
