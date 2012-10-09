/// <reference path="ambient/underscore.d.ts" />
/// <reference path="ambient/underscore.string.d.ts" />
/// <reference path="ambient/node.d.ts" />

/// <reference path="titanium.d.ts" />


import fs = module("fs");
import  _ = module("underscore");
import _s = module("underscore.string");

var excludeGlobalTypes = [
    "clearInterval", "clearTimeout", "decodeURIComponent", "encodeURIComponent",
    "require", "setInterval", "setTimeout"
];

interface JSCAProperty {
    name : string;
    type : string;
}

interface JSCAReturnType {
    type : string;
}

interface JSCAParameter {
    name   : string;
    type   : string;
    usage? : string;
}

interface JSCAFunction {
    name : string;
    returnTypes : JSCAReturnType[];
    parameters? : JSCAParameter[];
}

interface JSCAType {
    name        : string;
    isInternal? : bool;
    properties? : JSCAProperty[];
    functions?  : JSCAFunction[];
}

interface JSCAAlias {
    name : string;
    type : string;
}

class Type {
    constructor (public name : string, parent? : Type) {
        if (!_.isUndefined(parent)) {
            this.parent = parent;
        }
        this.staticTypename = Type.computeStaticTypename(this.getContext());
    }

    public parent         : Type = null;
    public staticTypename : string = null;
    private subtypes   : any = {};
    private properties : any = {};
    private functions  : any = {};

    static createFromJSCA (base : Type, type : JSCAType) : void {
        var context = type.name.split(".");
        var target : Type;
        if (context.length <= 1) {
            if (base.name != type.name) {
                target = base.getSubtype(type.name);
            }
            else {
                target = base;
            }
        }
        if (_.first(context) == base.name) {
            target = base.getSubtype(_.tail(context));
        }
        else {
            target = base.getSubtype(context);
        }

        target.computeFunctions(type);
        target.computeProperties(type);
    }

    getSubtype (context : string[]) : Type;
    getSubtype (name : string) : Type;
    getSubtype (nameOrContex : any) : Type {
        if (_.isArray(nameOrContex)) {
            return this.getSubtypeFromContext(nameOrContex);
        }
        else {
            return this.getSubtypeFromName(nameOrContex);
        }
    }

    setSubtype (name : string, type : Type) : void {
        this.subtypes.name = type;
    }

    private getContext () : string[] {
        var context = [];
        var current = this;
        while (!_.isNull(current.parent)) {
            context.push(current.name);
            current = current.parent;
        }
        return context;
    }

    private getSubtypeFromName (name : string) : Type {
        if (_.isUndefined(this.subtypes[name])) {
            this.subtypes[name] = new Type(name, this);
        }
        if (!_.isUndefined(this.properties[name])) {
            delete this.properties[name];
        }
        return this.subtypes[name];
    }

    private getSubtypeFromContext (context : string[]) : Type {
        if (context.length == 0) {
            return this;
        }
        else {
            var base = this.getSubtypeFromName(_.head(context));
            if (context.length == 1) {
                return base;
            }
            else {
                return base.getSubtypeFromContext(_.tail(context));
            }
        }
    }

    static private computeStaticTypename (context : string[]) : string {
        context.reverse();
        var str = _.reduce(context, (prefix : string, current : string) => {
            return prefix + _s.capitalize(current);
        }, "");
        return str + "Static";
    }

    static private convertTypename (type : string) : string {
        if (type == "Object") {
            return "any";
        }
        if (type == "Boolean") {
            return "bool";
        }
        if (type == "Array") {
            return "any[]";
        }
        if (type == "String") {
            return "string";
        }
        if (type == "Number") {
            return "number";
        }
        if (type == "Date") {
            return "Date";
        }
        if (type == "Function") {
            return "(...args : any[]) => any";
        }
        return Type.computeStaticTypename(type.split(".").reverse());
    }

    static private computeReturnType (returnTypes : JSCAReturnType[]) {
        if (!_.isArray(returnTypes) || returnTypes.length <= 0) {
            return "void";
        }
        else if (returnTypes.length == 1) {
            return Type.convertTypename(returnTypes[0].type);
        }
        else {
            return "any";
        }
    }

    static private computeParameter (param : JSCAParameter, optional? : bool) {
        var required = "";
        var vararg = "";
        var varargext = "";
        var type = Type.convertTypename(param.type);
        var name = param.name == "default" ? "def" : param.name;
        if (!_.isUndefined(param.usage)) {
            if (param.usage == "optional") {
                required = "?";
            } else if (param.usage != "required") {
                vararg = "...";
                varargext = "[]";
            }
        }
        var required = (optional) ? "?" : required;
        return vararg + name + required + " : " + type + varargext;
    }

    private computeProperties (type : JSCAType) {
        if (_.isArray(type.properties) && type.properties.length > 0) {
            _.each(type.properties, (p : JSCAProperty, name : string) {
                if (_.isUndefined(this.subtypes[p.name]) && _.isUndefined(this.functions[p.name])) {
                    this.properties[p.name] = Type.convertTypename(p.type);
                }
            });
        }
    }

    private computeFunctions (type : JSCAType) {
        if (_.isArray(type.functions) && type.functions.length > 0) {
            _.each(type.functions, (f : JSCAFunction, name : string) => {
                var params = "()";
                if (_.isArray(f.parameters)) {
                    var optional = false;
                    var ps = _.map(f.parameters, (p : JSCAParameter) => {
                        if (!optional) {
                            optional = p.usage == "optional";
                        }
                        return Type.computeParameter(p, optional);
                    });
                    var join = _.bind(_s.join, null, ', ');
                    params = "(" + join.apply(null, ps) + ")";
                }
                this.functions[f.name] = params + " : " + Type.computeReturnType(f.returnTypes);
            });
        }
    }

    public render () : string {
        var vars = "";
        var defs = "";
        var props = this.renderProperties();
        var funcs = this.renderFunctions();
        _.each(this.subtypes, (type : Type, name : string) => {
            vars += "declare var " + name + " : " + type.staticTypename + ";\n"
            defs += type.renderInterface();
        });
        return defs + vars + props + funcs;
    }

    public renderInterface () : string {
        var ifaces = "";
        var defs = "";
        _.each(this.subtypes, (type : Type, name : string) => {
            ifaces += type.renderInterface();
            defs += "    " + name + " : " + type.staticTypename + ";\n";
        });
        var inner = defs + this.renderInterfaceProperties() + this.renderInterfaceFunctions();
        return ifaces + "declare interface " + this.staticTypename + " {\n" + inner + "}\n";
    }

    private renderProperties () : string {
        var ps = "";
        _.each(this.properties, (type : string, name : string) => {
            ps += "declare var " + name + " : " + type + ";\n";
        });
        return ps;
    }

    private renderInterfaceProperties () : string {
        var ps = "";
        _.each(this.properties, (type : string, name : string) => {
            ps += "    " + name + " : " + type + ";\n";
        });
        return ps;
    }

    private renderInterfaceFunctions () : string {
        return _.reduce(this.functions, (fs : string, type : string, name : string) => {
            return fs + "    " + name + " " + type + ";\n"
        }, "");
    }

    private renderFunctions () : string {
        return _.reduce(this.functions, (fs : string, type : string, name : string) => {
            if (_.contains(excludeGlobalTypes, name)) {
                return fs;
            }
            else {
                return fs + "declare function " + name + " " + type + ";\n"
            }
        }, "");
    }
}

class Alias {
    public name : string;
    public type : string;

    constructor (a : JSCAAlias) {
        this.name = a.name;
        this.type = Type.convertTypename(a.type);
    }

    public render () : string {
        return "declare var " + this.name + " : " + this.type + ";\n";
    }
}

var path = process.argv[process.argv.length - 1];
fs.readFile(path, (err, data) => {
    if (err) {
        console.error("Error opening file \"" + path + "\"");
    }
    else {
        var jsca = JSON.parse(data.toString("utf-8"));
        if (_.isUndefined(jsca.types) || !_.isArray(jsca.types)) {
            console.error("JSCA format not recognized");
        }
        else {
            var global = new Type("Global");
            _.each(jsca.types, (type : JSCAType) => {
                Type.createFromJSCA(global, type);
            });

            var aliases = "";
            if (_.isArray(jsca.aliases)) {
                aliases = _.reduce(jsca.aliases, (m : string, a : JSCAAlias) => {
                    return m + (new Alias(a)).render();
                }, "");
            }
            console.log(global.render() + aliases);
        }
    }
});

