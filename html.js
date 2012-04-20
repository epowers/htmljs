(function() {

//////////////////
// Private context

///////
// init

function init() {

/*
* Element, attribute, and container functions.
*
* Some functions assemble parameters and return a function.
* Return functions return resolved objects or values, or set values on parents.
* The caller of some functions pass the parent as this.
*
* Attributes and children can validate the parent.
*
* Html elements instantiated with new create new elements.
* Html elements called without new use the first argument as an existing element to modify.
*
*/

////
// Resolve arguments by calling function arguments and returning an array of resolved values.

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

////
// Resolve one value from the argument list, throw an error if there is more than one.

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

////
// Resolve arguments for html elements as one of:
// * A child html element appended to the parent element.
// * A string representing HTML to be appended to the parent innerHTML.
// * An html attribute function that resolves itself on the element and returns undefined.

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
        } else if( arg_type == 'string' ) {
            elem.innerHTML += arg;
        } else if( arg_type == 'undefined' ) {
        } else { throw new Error(); }
    }
}

////
// Create an html element function for certain types.
// If a string is specified, create that type.
// If an object is specified, derive from that object as a prototype.
// If no arguments, create a null function.

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

////
// Instantiate an html element function that sets attributes and appends children.

function HtmlElementFactory( type ) {
    function func_element() {
        var _elem;
        if( typeof(type) != 'string' || this instanceof func_element ) {
            _elem = __createElement( type );
            __appendChildren( _elem, arguments );
        } else {
            var args = Array.prototype.slice.call( arguments );
            _elem = __createElement( args[0] );
            args = args.slice(1);
            __appendChildren( _elem, args );
        }
        return _elem;
    }
    return func_element;
}

////
// Instantiate an html attribute function for css that combines values into a single css string.

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

////
// Instantiate an html attribute function for simple value types.

function HtmlAttributeFactory( type ) {
    function func_attr() {
        var value = __resolveSingleValue( arguments );
        var func_container = function() {
            this.setAttribute( type, value );
        }
        return func_container;
    }
    return func_attr;
}

////
// Instantiate an html attribute function for bool.

function HtmlBoolAttributeFactory( type ) {
    function func_attr() {
        var value = __resolveSingleValue( arguments );
        var func_container = function() {
            if( typeof(value) == 'undefined' || value ) {
                this.setAttribute( type, true );
            } else {
                this.removeAttribute( type );
            }
        }
        return func_container;
    }
    return func_attr;
}

////
// Instantiate a CSS property function that generates syntax for a single CSS key/value.

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

////
// Instantiate a value function.

function ValueFactory( type ) {
    function func_value() {
        // validate that parent is display.
        //var name = this.name;
        //if( name != "display" ) { throw new Error(); }
        return type;
    };
    return func_value;
}

/////////////////////////
// Declare Public methods

// lists of HTML element types, attribute types, etc.
var ELEMENTS = [
    'div',
    'a',
    'span',
    'input',
    'img',
    'video',
    'script',
    'style',
    'ul',
    'ol',
    'li',
    'select',
    'option',
    'button',
    'form',
    'iframe',
    ];
var ATTRIBUTES = [
    'src',
    'href',
    'type',
    'id',
    'name',
    'value',
    'class',
    'action',
    'target',
    ];
var CSSATTRIBUTES = [
    'style',
    ];
var BOOLATTRIBUTES = [
    'disabled',
    ];
var CSSPROPERTIES = [
    'display',
    'color',
    ];
var VALUES = [
    'none',
    'white',
    'black',
    ];

// function for generating key/value results from a list and a function object.
var result = {};
function __register( list, func ) {
    for( var i in list ) {
        var e = list[i];
        result[e] = func( e );
    }
}

// register all of the types above in the result object dictionary.
__register( ELEMENTS, HtmlElementFactory );
__register( ATTRIBUTES, HtmlAttributeFactory );
__register( BOOLATTRIBUTES, HtmlBoolAttributeFactory );
__register( CSSATTRIBUTES, HtmlCssAttributeFactory );
__register( CSSPROPERTIES, CSSPropertyFactory );
__register( VALUES, ValueFactory );

// Special case objects that do not initialize the function with a string argument.
result['html'] = HtmlElementFactory();
result['head'] = HtmlElementFactory();
result['body'] = HtmlElementFactory( document.body );

return result;
}

// end init
///////////

// Use this variable to initialize once.
var _init_html;

try{
    //
    // Register with require if possible.
    // If we use dojo, init will need dojo as an argument,
    // hence why this convoluted init/try/catch logic.
    //

    define([],function(){
        _init_html = false;
        _init_html = init();
        return _init_html;
    });
}
catch(e){
    //
    // Otherwise expose public methods on a global html object
    //

    // if init fails, re-throw the exception.
    if(_init_html==false) { throw e; }
    // if define fails and init never ran, try re-running init without define.
    if(typeof _init_html=='undefined'){ _init_html = init(); }
    // if init was successful and no global html exists, set it.
    if(typeof html=='undefined'){ html = _init_html; }
}

// END private context
//////////////////////

})();
