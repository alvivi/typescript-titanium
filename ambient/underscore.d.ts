/*
   Typescipt Underscore 1.4.1-0.1
   (c) 2012 Álvaro Vilanova Vidal
   Typescipt-Underscore may be freely distributed under the MIT license.
 */

declare module "underscore" {

    // Collection Functions (Arrays or Objects)

    export function each (list : any, iterator : (elementOrValue : any, indexOrKey : any, list? : any) => void, context? : any) : void;
    export function forEach (list : any, iterator : (elementOrValue : any, indexOrKey : any, list? : any) => void, context? : any) : void;

    export function map (list : any, iterator : (value : any, key? : any, list? : any) => any, context? : any) : any[];
    export function collect (list : any, iterator : (value : any, key? : any, list? : any) => any, context? : any) : any[];

    export function reduce (list : any, iterator : (memo : any, value : any, indexOrKey? : any, context? : any) => any, memo : any, context? : any);
    export function inject (list : any, iterator : (memo : any, value : any, indexOrKey? : any, context? : any) => any, memo : any, context? : any);
    export function foldl (list : any, iterator : (memo : any, value : any, indexOrKey? : any, context? : any) => any, memo : any, context? : any);

    export function reduceRight (list : any, iterator : (memo : any, value : any, indexOrKey? : any, context? : any) => any, memo : any, context? : any) : any;
    export function foldr (list : any, iterator : (memo : any, value : any, indexOrKey? : any, context? : any) => any, memo : any, context? : any) : any;

    export function find (list : any, iterator : (value : any) => bool, context? : any) : any;
    export function detect (list : any, iterator : (value : any) => bool, context? : any) : any;

    export function filter (list : any, iterator : (value : any) => bool, context? : any) : any;
    export function select (list : any, iterator : (value : any) => bool, context? : any) : any;

    export function where (list : any, properties : any) : any;

    export function reject (list : any, iterator : (value : any) => bool, context? : any) : any;

    export function all (list : any, iterator : (value : any) => bool, context? : any) : any;
    export function every (list : any, iterator : (value : any) => bool, context? : any) : any;

    export function any (list : any, iterator? : (value : any) => bool, context? : any) : any;
    export function some (list : any, iterator? : (value : any) => bool, context? : any) : any;

    export function contains (list : any, value : any) : bool;
    export function include (list : any, value : any) : bool;

    export function invoke (list : any, methodName : string, ...arguments: any[]) : any;

    export function pluck (list : any, propertyName : string) : any;

    export function max (list : any, iterator? : (value : any) => any, context? : any) : any;

    export function min (list : any, iterator? : (value : any) => any, context? : any) : any;

    export function sortBy (list : any, iterator? : any, context? : any) : any;

    export function groupBy (list : any, iterator : (value : any) => any) : any;

    export function countBy (list : any, iterator : (value : any) => any) : any;

    export function shuffle (list : any) : any;

    export function toArray (list : any) : any[];

    export function size (list : any) : number;


    // Array Functions

    export function first (array : any[], n? : number) : any;
    export function head (array : any[], n? : number) : any;
    export function take (array : any[], n? : number) : any;

    export function initial (array : any[], n? : number) : any[];

    export function last (array : any[], n? : number) : any;

    export function rest (array : any[], index? : number) : any[];
    export function tail (array : any[], index? : number) : any[];
    export function drop (array : any[], index? : number) : any[];

    export function compact (array : any[]) : any[];

    export function flatten (array : any[], shallow? : bool) : any[];

    export function without (array : any[], ...values : any[]) : any[];

    export function union (...arrays : any[][]) : any[];

    export function intersection (...arrays : any[][]) : any[];

    export function difference (...arrays : any[][]) : any[];

    export function uniq (array : any[], isSorted? : bool, iterator? : (any) => any) : any[];
    export function unique (array : any[], isSorted? : bool, iterator? : (any) => any) : any[];

    export function zip (...arrays : any[][]) : any[];

    export function object (list : any, value? : any) : any;

    export function indexOf (array : any[], value : any, isSorted? : bool) : number;

    export function lastIndexOf (array : any[], value : any, fromIndex? : number) : number;

    export function sortedIndex (list : any, value : any, iterator? : (value : any) => any) : any;

    export function range (startOrStop : number, stop? : number, step? : number) : number[];


    // Function (uh, ahem) Functions

    export function bind (fn : (...as : any[]) => any, object : any, ...arguments : any[]) : (...as : any[]) => any;

    export function bindAll (object : any, ...methodNames : string[]) : void;

    export function memoize (fn : (...as : any[]) => any, hashFunction? : (value : any) => any) : (...as : any[]) => any;

    export function delay (fn : (...as : any[]) => any, wait : number, ...arguments : any[]) : void;

    export function defer (fn : (...as : any[]) => any, ...arguments : any[]) : void;

    export function throttle (fn : (...as : any[]) => any, wait : number) : (...as : any[]) => any;

    export function debounce (fn : (...as : any[]) => any, wait : number, immediate? : bool) : (...as : any[]) => any;

    export function once (fn : (...as : any[]) => any) : (...as : any[]) => any;

    export function after (count : number, fn : (...as : any[]) => any) : (...as : any[]) => any;

    export function wrap (fn : (...as : any[]) => any, wrapper : (...as : any[]) => any) : (...as : any[]) => any;

    export function compose (...fns : any[]) : (...as : any[]) => any;


    // Object Functions

    export function keys (object : any) : string[];

    export function values (object : any) : any[];

    export function pairs (object : any) : any[];

    export function invert (object : any) : any;

    export function functions (object : any) : string[];
    export function methods (object : any) : string[];

    export function extend (destination : any, ...sources : any[]) : any;

    export function pick (object : any, ...keys : string[]) : any;

    export function omit (object : any, ...keys : string[]) : any;

    export function defaults (object : any, ...defaults : any[]) : any;

    export function clone (object : any) : any;

    export function tap (object : any, interceptor : (...as : any[]) => any) : any;

    export function has (object : any, key : any) : bool;

    export function isEmpty (object : any) : bool;

    export function isElement (object : any) : bool;

    export function isArray (object : any) : bool;

    export function isObject (value : any) : bool;

    export function isArguments (object : any) : bool;

    export function isFunction (object : any) : bool;

    export function isString (object : any) : bool;

    export function isNumber (object : any) : bool;

    export function isFinite (object : any) : bool;

    export function isBoolean (object : any) : bool;

    export function isDate (object : any) : bool;

    export function isRegExp (object : any) : bool;

    export function isNaN (object : any) : bool;

    export function isNull (object : any) : bool;

    export function isUndefined (object : any) : bool;


    // Utility Functions

    export function noConflict () : any;

    export function identity (value : any) : any;

    export function times (n : number, iterator : (index : number) => void, context? : any) : void;

    export function random (min : number, max : number) : number;

    export function mixin (object : any) : void;

    export function uniqueId (prefix? : string) : any;

    export function escape (str : string) : string;

    export function result (object : any, property : string) : any;

    export function template (templateString : string, data? : any, settings? : any) : (...as : any[]) => string;

    export interface UnderscoreWrappedObject {
        value () : any;
    }

    export function chain (object : any) : UnderscoreWrappedObject;

}
