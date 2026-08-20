(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/clamp.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clamp",
    ()=>clamp
]);
const clamp = (min, max, v)=>{
    if (v > max) return max;
    if (v < min) return min;
    return v;
};
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/format-error-message.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatErrorMessage",
    ()=>formatErrorMessage
]);
function formatErrorMessage(message, errorCode) {
    return errorCode ? `${message}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${errorCode}` : message;
}
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/errors.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "invariant",
    ()=>invariant,
    "warning",
    ()=>warning
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$format$2d$error$2d$message$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/format-error-message.mjs [app-client] (ecmascript)");
;
let warning = ()=>{};
let invariant = ()=>{};
if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" && ("TURBOPACK compile-time value", "development") !== "production") {
    warning = (check, message, errorCode)=>{
        if (!check && typeof console !== "undefined") {
            console.warn((0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$format$2d$error$2d$message$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatErrorMessage"])(message, errorCode));
        }
    };
    invariant = (check, message, errorCode)=>{
        if (!check) {
            throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$format$2d$error$2d$message$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatErrorMessage"])(message, errorCode));
        }
    };
}
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/is-numerical-string.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isNumericalString",
    ()=>isNumericalString
]);
/**
 * Check if value is a numerical string, ie a string that is purely a number eg "100" or "-100.1"
 */ const isNumericalString = (v)=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/noop.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "noop",
    ()=>noop
]);
/*#__NO_SIDE_EFFECTS__*/ const noop = (any)=>any;
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/global-config.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MotionGlobalConfig",
    ()=>MotionGlobalConfig
]);
const MotionGlobalConfig = {};
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/is-zero-value-string.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isZeroValueString",
    ()=>isZeroValueString
]);
/**
 * Check if the value is a zero value string like "0px" or "0%"
 */ const isZeroValueString = (v)=>/^0[^.\s]+$/u.test(v);
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/warn-once.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasWarned",
    ()=>hasWarned,
    "warnOnce",
    ()=>warnOnce
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$format$2d$error$2d$message$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/format-error-message.mjs [app-client] (ecmascript)");
;
const warned = new Set();
function hasWarned(message) {
    return warned.has(message);
}
function warnOnce(condition, message, errorCode) {
    if (condition || warned.has(message)) return;
    console.warn((0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$format$2d$error$2d$message$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatErrorMessage"])(message, errorCode));
    warned.add(message);
}
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/time-conversion.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "millisecondsToSeconds",
    ()=>millisecondsToSeconds,
    "secondsToMilliseconds",
    ()=>secondsToMilliseconds
]);
/**
 * Converts seconds to milliseconds
 *
 * @param seconds - Time in seconds.
 * @return milliseconds - Converted time in milliseconds.
 */ /*#__NO_SIDE_EFFECTS__*/ const secondsToMilliseconds = (seconds)=>seconds * 1000;
/*#__NO_SIDE_EFFECTS__*/ const millisecondsToSeconds = (milliseconds)=>milliseconds / 1000;
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/array.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addUniqueItem",
    ()=>addUniqueItem,
    "moveItem",
    ()=>moveItem,
    "removeItem",
    ()=>removeItem
]);
function addUniqueItem(arr, item) {
    if (arr.indexOf(item) === -1) arr.push(item);
}
function removeItem(arr, item) {
    const index = arr.indexOf(item);
    if (index > -1) arr.splice(index, 1);
}
// Adapted from array-move
function moveItem([...arr], fromIndex, toIndex) {
    const startIndex = fromIndex < 0 ? arr.length + fromIndex : fromIndex;
    if (startIndex >= 0 && startIndex < arr.length) {
        const endIndex = toIndex < 0 ? arr.length + toIndex : toIndex;
        const [item] = arr.splice(fromIndex, 1);
        arr.splice(endIndex, 0, item);
    }
    return arr;
}
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/subscription-manager.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SubscriptionManager",
    ()=>SubscriptionManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$array$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/array.mjs [app-client] (ecmascript)");
;
class SubscriptionManager {
    constructor(){
        this.subscriptions = [];
    }
    add(handler) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$array$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addUniqueItem"])(this.subscriptions, handler);
        return ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$array$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeItem"])(this.subscriptions, handler);
    }
    notify(a, b, c) {
        const numSubscriptions = this.subscriptions.length;
        if (!numSubscriptions) return;
        if (numSubscriptions === 1) {
            /**
             * If there's only a single handler we can just call it without invoking a loop.
             */ this.subscriptions[0](a, b, c);
        } else {
            for(let i = 0; i < numSubscriptions; i++){
                /**
                 * Check whether the handler exists before firing as it's possible
                 * the subscriptions were modified during this loop running.
                 */ const handler = this.subscriptions[i];
                handler && handler(a, b, c);
            }
        }
    }
    getSize() {
        return this.subscriptions.length;
    }
    clear() {
        this.subscriptions.length = 0;
    }
}
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/memo.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "memo",
    ()=>memo
]);
/*#__NO_SIDE_EFFECTS__*/ function memo(callback) {
    let result;
    return ()=>{
        if (result === undefined) result = callback();
        return result;
    };
}
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/utils/is-bezier-definition.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isBezierDefinition",
    ()=>isBezierDefinition
]);
/*#__NO_SIDE_EFFECTS__*/ const isBezierDefinition = (easing)=>Array.isArray(easing) && typeof easing[0] === "number";
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/velocity-per-second.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "velocityPerSecond",
    ()=>velocityPerSecond
]);
/*
  Convert velocity into velocity per second
*/ /*#__NO_SIDE_EFFECTS__*/ const velocityPerSecond = (velocity, frameDuration)=>frameDuration ? velocity * (1000 / frameDuration) : 0;
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/pipe.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pipe",
    ()=>pipe
]);
/**
 * Pipe
 * Compose other transformers to run linearily
 * pipe(min(20), max(40))
 * @param  {...functions} transformers
 * @return {function}
 */ const pipe = (...transformers)=>transformers.reduce((a, b)=>(v)=>b(a(v)));
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/cubic-bezier.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cubicBezier",
    ()=>cubicBezier
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$noop$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/noop.mjs [app-client] (ecmascript)");
;
/*
  Bezier function generator
  This has been modified from Gaëtan Renaudeau's BezierEasing
  https://github.com/gre/bezier-easing/blob/master/src/index.js
  https://github.com/gre/bezier-easing/blob/master/LICENSE
  
  I've removed the newtonRaphsonIterate algo because in benchmarking it
  wasn't noticeably faster than binarySubdivision, indeed removing it
  usually improved times, depending on the curve.
  I also removed the lookup table, as for the added bundle size and loop we're
  only cutting ~4 or so subdivision iterations. I bumped the max iterations up
  to 12 to compensate and this still tended to be faster for no perceivable
  loss in accuracy.
  Usage
    const easeOut = cubicBezier(.17,.67,.83,.67);
    const x = easeOut(0.5); // returns 0.627...
*/ // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
const calcBezier = (t, a1, a2)=>(((1.0 - 3.0 * a2 + 3.0 * a1) * t + (3.0 * a2 - 6.0 * a1)) * t + 3.0 * a1) * t;
const subdivisionPrecision = 0.0000001;
const subdivisionMaxIterations = 12;
function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
    let currentX;
    let currentT;
    let i = 0;
    do {
        currentT = lowerBound + (upperBound - lowerBound) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - x;
        if (currentX > 0.0) {
            upperBound = currentT;
        } else {
            lowerBound = currentT;
        }
    }while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations)
    return currentT;
}
/*#__NO_SIDE_EFFECTS__*/ function cubicBezier(mX1, mY1, mX2, mY2) {
    // If this is a linear gradient, return linear easing
    if (mX1 === mY1 && mX2 === mY2) return __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$noop$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"];
    const getTForX = (aX)=>binarySubdivide(aX, 0, 1, mX1, mX2);
    // If animation is at start/end, return t without easing
    return (t)=>t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/ease.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "easeIn",
    ()=>easeIn,
    "easeInOut",
    ()=>easeInOut,
    "easeOut",
    ()=>easeOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/cubic-bezier.mjs [app-client] (ecmascript)");
;
const easeIn = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cubicBezier"])(0.42, 0, 1, 1);
const easeOut = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cubicBezier"])(0, 0, 0.58, 1);
const easeInOut = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cubicBezier"])(0.42, 0, 0.58, 1);
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/utils/is-easing-array.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isEasingArray",
    ()=>isEasingArray
]);
/*#__NO_SIDE_EFFECTS__*/ const isEasingArray = (ease)=>{
    return Array.isArray(ease) && typeof ease[0] !== "number";
};
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mirrorEasing",
    ()=>mirrorEasing
]);
// Accepts an easing function and returns a new one that outputs mirrored values for
// the second half of the animation. Turns easeIn into easeInOut.
/*#__NO_SIDE_EFFECTS__*/ const mirrorEasing = (easing)=>(p)=>p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/modifiers/reverse.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reverseEasing",
    ()=>reverseEasing
]);
// Accepts an easing function and returns a new one that outputs reversed values.
// Turns easeIn into easeOut.
/*#__NO_SIDE_EFFECTS__*/ const reverseEasing = (easing)=>(p)=>1 - easing(1 - p);
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/back.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "backIn",
    ()=>backIn,
    "backInOut",
    ()=>backInOut,
    "backOut",
    ()=>backOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/cubic-bezier.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$mirror$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$reverse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/modifiers/reverse.mjs [app-client] (ecmascript)");
;
;
;
const backOut = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cubicBezier"])(0.33, 1.53, 0.69, 0.99);
const backIn = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$reverse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reverseEasing"])(backOut);
const backInOut = /*@__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$mirror$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mirrorEasing"])(backIn);
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/anticipate.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "anticipate",
    ()=>anticipate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$back$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/back.mjs [app-client] (ecmascript)");
;
const anticipate = (p)=>p >= 1 ? 1 : (p *= 2) < 1 ? 0.5 * (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$back$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["backIn"])(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/circ.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "circIn",
    ()=>circIn,
    "circInOut",
    ()=>circInOut,
    "circOut",
    ()=>circOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$mirror$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/modifiers/mirror.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$reverse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/modifiers/reverse.mjs [app-client] (ecmascript)");
;
;
const circIn = (p)=>1 - Math.sin(Math.acos(p));
const circOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$reverse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reverseEasing"])(circIn);
const circInOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$modifiers$2f$mirror$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mirrorEasing"])(circIn);
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/utils/map.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "easingDefinitionToFunction",
    ()=>easingDefinitionToFunction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/errors.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$noop$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/noop.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$anticipate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/anticipate.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$back$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/back.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$circ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/circ.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/cubic-bezier.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$ease$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/ease.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$utils$2f$is$2d$bezier$2d$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/easing/utils/is-bezier-definition.mjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
const easingLookup = {
    linear: __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$noop$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"],
    easeIn: __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$ease$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["easeIn"],
    easeInOut: __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$ease$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["easeInOut"],
    easeOut: __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$ease$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["easeOut"],
    circIn: __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$circ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["circIn"],
    circInOut: __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$circ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["circInOut"],
    circOut: __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$circ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["circOut"],
    backIn: __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$back$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["backIn"],
    backInOut: __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$back$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["backInOut"],
    backOut: __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$back$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["backOut"],
    anticipate: __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$anticipate$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["anticipate"]
};
const isValidEasing = (easing)=>{
    return typeof easing === "string";
};
const easingDefinitionToFunction = (definition)=>{
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$utils$2f$is$2d$bezier$2d$definition$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBezierDefinition"])(definition)) {
        // If cubic bezier definition, create bezier curve
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invariant"])(definition.length === 4, `Cubic bezier arrays must contain four numerical values.`, "cubic-bezier-length");
        const [x1, y1, x2, y2] = definition;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$easing$2f$cubic$2d$bezier$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cubicBezier"])(x1, y1, x2, y2);
    } else if (isValidEasing(definition)) {
        // Else lookup from table
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$motion$2d$utils$2f$dist$2f$es$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["invariant"])(easingLookup[definition] !== undefined, `Invalid easing type '${definition}'`, "invalid-easing-type");
        return easingLookup[definition];
    }
    return definition;
};
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/progress.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "progress",
    ()=>progress
]);
/*
  Progress within given range

  Given a lower limit and an upper limit, we return the progress
  (expressed as a number 0-1) represented by the given value, and
  limit that progress to within 0-1.
*/ /*#__NO_SIDE_EFFECTS__*/ const progress = (from, to, value)=>{
    const range = to - from;
    return range ? (value - from) / range : 1;
};
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/motion-utils/dist/es/is-object.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isObject",
    ()=>isObject
]);
const isObject = (value)=>typeof value === "object" && value !== null;
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/dequal/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dequal",
    ()=>dequal
]);
var has = Object.prototype.hasOwnProperty;
function find(iter, tar, key) {
    for (key of iter.keys()){
        if (dequal(key, tar)) return key;
    }
}
function dequal(foo, bar) {
    var ctor, len, tmp;
    if (foo === bar) return true;
    if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
        if (ctor === Date) return foo.getTime() === bar.getTime();
        if (ctor === RegExp) return foo.toString() === bar.toString();
        if (ctor === Array) {
            if ((len = foo.length) === bar.length) {
                while(len-- && dequal(foo[len], bar[len]));
            }
            return len === -1;
        }
        if (ctor === Set) {
            if (foo.size !== bar.size) {
                return false;
            }
            for (len of foo){
                tmp = len;
                if (tmp && typeof tmp === 'object') {
                    tmp = find(bar, tmp);
                    if (!tmp) return false;
                }
                if (!bar.has(tmp)) return false;
            }
            return true;
        }
        if (ctor === Map) {
            if (foo.size !== bar.size) {
                return false;
            }
            for (len of foo){
                tmp = len[0];
                if (tmp && typeof tmp === 'object') {
                    tmp = find(bar, tmp);
                    if (!tmp) return false;
                }
                if (!dequal(len[1], bar.get(tmp))) {
                    return false;
                }
            }
            return true;
        }
        if (ctor === ArrayBuffer) {
            foo = new Uint8Array(foo);
            bar = new Uint8Array(bar);
        } else if (ctor === DataView) {
            if ((len = foo.byteLength) === bar.byteLength) {
                while(len-- && foo.getInt8(len) === bar.getInt8(len));
            }
            return len === -1;
        }
        if (ArrayBuffer.isView(foo)) {
            if ((len = foo.byteLength) === bar.byteLength) {
                while(len-- && foo[len] === bar[len]);
            }
            return len === -1;
        }
        if (!ctor || typeof foo === 'object') {
            len = 0;
            for(ctor in foo){
                if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
                if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
            }
            return Object.keys(bar).length === len;
        }
    }
    return foo !== foo && bar !== bar;
}
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mergeClasses",
    ()=>mergeClasses
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const mergeClasses = (...classes)=>classes.filter((className, index, array)=>{
        return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toKebabCase",
    ()=>toKebabCase
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toKebabCase = (string)=>string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toCamelCase",
    ()=>toCamelCase
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toCamelCase = (string)=>string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2)=>p2 ? p2.toUpperCase() : p1.toLowerCase());
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toPascalCase",
    ()=>toPascalCase
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toCamelCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs [app-client] (ecmascript)");
;
const toPascalCase = (string)=>{
    const camelCase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toCamelCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toCamelCase"])(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/defaultAttributes.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>defaultAttributes
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasA11yProp",
    ()=>hasA11yProp
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const hasA11yProp = (props)=>{
    for(const prop in props){
        if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
            return true;
        }
    }
    return false;
};
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/context.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LucideProvider",
    ()=>LucideProvider,
    "useLucideContext",
    ()=>useLucideContext
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use strict";
"use client";
;
const LucideContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({});
function LucideProvider({ children, size, color, strokeWidth, absoluteStrokeWidth, className }) {
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LucideProvider.useMemo[value]": ()=>({
                size,
                color,
                strokeWidth,
                absoluteStrokeWidth,
                className
            })
    }["LucideProvider.useMemo[value]"], [
        size,
        color,
        strokeWidth,
        absoluteStrokeWidth,
        className
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(LucideContext.Provider, {
        value
    }, children);
}
const useLucideContext = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(LucideContext);
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/Icon.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Icon
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/defaultAttributes.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$hasA11yProp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$context$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/context.mjs [app-client] (ecmascript)");
"use strict";
"use client";
;
;
;
;
;
const Icon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ color, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref)=>{
    const { size: contextSize = 24, strokeWidth: contextStrokeWidth = 2, absoluteStrokeWidth: contextAbsoluteStrokeWidth = false, color: contextColor = "currentColor", className: contextClass = "" } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$context$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLucideContext"])() ?? {};
    const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("svg", {
        ref,
        ...__TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        width: size ?? contextSize ?? __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].width,
        height: size ?? contextSize ?? __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].height,
        stroke: color ?? contextColor,
        strokeWidth: calculatedStrokeWidth,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])("lucide", contextClass, className),
        ...!children && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$hasA11yProp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasA11yProp"])(rest) && {
            "aria-hidden": "true"
        },
        ...rest
    }, [
        ...iconNode.map(([tag, attrs])=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(tag, attrs)),
        ...Array.isArray(children) ? children : [
            children
        ]
    ]);
});
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>createLucideIcon
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toKebabCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toPascalCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/Icon.mjs [app-client] (ecmascript)");
;
;
;
;
;
const createLucideIcon = (iconName, iconNode)=>{
    const Component = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(__TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            ref,
            iconNode,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])(`lucide-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toKebabCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toKebabCase"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toPascalCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName))}`, `lucide-${iconName}`, className),
            ...props
        }));
    Component.displayName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toPascalCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName);
    return Component;
};
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Menu
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M4 5h16",
            key: "1tepv9"
        }
    ],
    [
        "path",
        {
            d: "M4 12h16",
            key: "1lakjw"
        }
    ],
    [
        "path",
        {
            d: "M4 19h16",
            key: "1djgab"
        }
    ]
];
const Menu = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("menu", __iconNode);
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-client] (ecmascript) <export default as Menu>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Menu",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-client] (ecmascript)");
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>X
]);
/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M18 6 6 18",
            key: "1bl5f8"
        }
    ],
    [
        "path",
        {
            d: "m6 6 12 12",
            key: "d8bk6v"
        }
    ]
];
const X = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("x", __iconNode);
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "X",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript)");
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/@studio-freight/tempus/dist/tempus.modern.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>a
]);
var a = "undefined" != typeof window && new class {
    constructor(){
        this.raf = (a)=>{
            requestAnimationFrame(this.raf);
            const t = a - this.now;
            this.now = a;
            for(let s = 0; s < this.callbacks.length; s++)this.callbacks[s].callback(a, t);
        }, this.callbacks = [], this.now = performance.now(), requestAnimationFrame(this.raf);
    }
    add(a, t = 0) {
        return this.callbacks.push({
            callback: a,
            priority: t
        }), this.callbacks.sort((a, t)=>a.priority - t.priority), ()=>this.remove(a);
    }
    remove(a) {
        this.callbacks = this.callbacks.filter(({ callback: t })=>a !== t);
    }
};
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/just-debounce-it/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>functionDebounce
]);
var functionDebounce = debounce;
function debounce(fn, wait, callFirst) {
    var timeout = null;
    var debouncedFn = null;
    var clear = function() {
        if (timeout) {
            clearTimeout(timeout);
            debouncedFn = null;
            timeout = null;
        }
    };
    var flush = function() {
        var call = debouncedFn;
        clear();
        if (call) {
            call();
        }
    };
    var debounceWrapper = function() {
        if (!wait) {
            return fn.apply(this, arguments);
        }
        var context = this;
        var args = arguments;
        var callNow = callFirst && !timeout;
        clear();
        debouncedFn = function() {
            fn.apply(context, args);
        };
        timeout = setTimeout(function() {
            timeout = null;
            if (!callNow) {
                var call = debouncedFn;
                debouncedFn = null;
                return call();
            }
        }, wait);
        if (callNow) {
            return debouncedFn();
        }
    };
    debounceWrapper.cancel = clear;
    debounceWrapper.flush = flush;
    return debounceWrapper;
}
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/nanoevents/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createNanoEvents",
    ()=>createNanoEvents
]);
let createNanoEvents = ()=>({
        emit (event, ...args) {
            for(let callbacks = this.events[event] || [], i = 0, length = callbacks.length; i < length; i++){
                callbacks[i](...args);
            }
        },
        events: {},
        on (event, cb) {
            ;
            (this.events[event] ||= []).push(cb);
            return ()=>{
                this.events[event] = this.events[event]?.filter((i)=>cb !== i);
            };
        }
    });
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/@studio-freight/hamo/dist/hamo.modern.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDebug",
    ()=>d,
    "useDocumentReadyState",
    ()=>l,
    "useFrame",
    ()=>f,
    "useIntersectionObserver",
    ()=>h,
    "useInterval",
    ()=>m,
    "useIsClient",
    ()=>a,
    "useIsTouchDevice",
    ()=>v,
    "useMediaQuery",
    ()=>w,
    "useOutsideClickEvent",
    ()=>s,
    "useRect",
    ()=>k,
    "useResizeObserver",
    ()=>x,
    "useSlots",
    ()=>O,
    "useWindowSize",
    ()=>S
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f40$studio$2d$freight$2f$tempus$2f$dist$2f$tempus$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/@studio-freight/tempus/dist/tempus.modern.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$just$2d$debounce$2d$it$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/just-debounce-it/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$nanoevents$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/nanoevents/index.js [app-client] (ecmascript)");
;
;
;
;
function s(n, r) {
    const o = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        n.current && !n.current.contains(e.target) && r();
    }, [
        n,
        r
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (n.current) return document.addEventListener("mousedown", o), ()=>{
            document.removeEventListener("mousedown", o);
        };
    }, [
        o,
        n
    ]);
}
function a() {
    const [e, r] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(!1);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        r(!0);
    }, []), e;
}
function d() {
    const e = a();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!e) return;
        const t = window.location, n = t.href, r = new URLSearchParams(t.search), o = n.includes("#debug") || n.includes("/_debug") || r.has("debug") || "development" === ("TURBOPACK compile-time value", "development"), c = n.includes("#production") || r.has("production");
        return o && !c;
    }, [
        e
    ]);
}
function l() {
    const [e, r] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function e() {
            r(document.readyState);
        }
        return document.addEventListener("readystatechange", e, !1), e(), ()=>document.removeEventListener("readystatechange", e, !1);
    }, []), e;
}
function f(e, n = 0) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (e) return __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f40$studio$2d$freight$2f$tempus$2f$dist$2f$tempus$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].add(e, n), ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f40$studio$2d$freight$2f$tempus$2f$dist$2f$tempus$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].remove(e);
    }, [
        e,
        n
    ]);
}
function h({ root: r = null, rootMargin: c = "0px", threshold: i = 0, once: u = !1, lazy: s = !1, callback: a = ()=>{} } = {}, d = []) {
    const l = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({}), [f, h1] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({}), [m, v] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!m) return;
        const e = new IntersectionObserver(([t])=>{
            s ? l.current = t : h1(t), a(t), u && t.isIntersecting && e.disconnect();
        }, {
            root: r,
            rootMargin: c,
            threshold: i
        });
        return e.observe(m), ()=>{
            e.disconnect();
        };
    }, [
        m,
        r,
        c,
        i,
        s,
        u,
        ...d
    ]);
    const w = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(()=>l.current, []);
    return [
        v,
        s ? w : f
    ];
}
function m(e, n = 1e3, r = []) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const t = setInterval(e, n);
        return ()=>clearInterval(t);
    }, [
        n,
        ...r
    ]);
}
function v() {
    const [e, r] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function e() {
            r("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);
        }
        return window.addEventListener("resize", e, !1), e(), ()=>{
            window.removeEventListener("resize", e, !1);
        };
    }, []), e;
}
function w(e) {
    const [r, o] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const t = window.matchMedia(e);
        function n() {
            o(t.matches);
        }
        return t.addEventListener("change", n, !1), n(), ()=>t.removeEventListener("change", n, !1);
    }, [
        e
    ]), r;
}
function g() {
    return g = ("TURBOPACK compile-time truthy", 1) ? Object.assign.bind() : "TURBOPACK unreachable", g.apply(this, arguments);
}
function p(e) {
    "sticky" === getComputedStyle(e).position && (e.style.setProperty("position", "static"), e.dataset.sticky = "true"), e.offsetParent && p(e.offsetParent);
}
function b(e) {
    var t;
    "true" === (null == e || null == (t = e.dataset) ? void 0 : t.sticky) && (e.style.removeProperty("position"), e.dataset.sticky = "true", delete e.dataset.sticky), e.parentNode && b(e.parentNode);
}
function y(e, t = 0) {
    const n = t + e.offsetTop;
    return e.offsetParent ? y(e.offsetParent, n) : n;
}
function z(e, t = 0) {
    const n = t + e.offsetLeft;
    return e.offsetParent ? z(e.offsetParent, n) : n;
}
function P(e, t = 0) {
    const n = t + e.scrollTop;
    return e.offsetParent ? P(e.offsetParent, n) : n + window.scrollY;
}
function E(e, t = 0) {
    const n = t + e.scrollLeft;
    return e.offsetParent ? E(e.offsetParent, n) : n + window.scrollX;
}
const L = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$nanoevents$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createNanoEvents"])();
function k({ ignoreTransform: r = !1, ignoreSticky: c = !0, debounce: u = 500, lazy: s = !1, callback: a } = {}) {
    const [d, l] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(), f = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({}), [h, m] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({}), v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(({ top: e, left: t, width: n, height: r, element: o })=>{
        var c, i, u, d, l;
        e = null != (c = e) ? c : f.current.top, t = null != (i = t) ? i : f.current.left, n = null != (u = n) ? u : f.current.width, r = null != (d = r) ? d : f.current.height, o = null != (l = o) ? l : f.current.element, e === f.current.top && t === f.current.left && n === f.current.width && r === f.current.height && o === f.current.element || (f.current.top = e, f.current.y = e, f.current.width = n, f.current.height = r, f.current.left = t, f.current.x = t, f.current.bottom = e + r, f.current.right = t + n, f.current.element = o, null == a || a(f.current), s || m(g({}, f.current)));
    }, [
        s
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!d) return;
        const e = d.getBoundingClientRect();
        v({
            width: e.width,
            height: e.height
        });
        const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$just$2d$debounce$2d$it$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(([e])=>{
            v({
                width: e.borderBoxSize[0].inlineSize,
                height: e.borderBoxSize[0].blockSize
            });
        }, u), n = new ResizeObserver(t);
        return n.observe(d), ()=>{
            n.disconnect(), t.cancel();
        };
    }, [
        d,
        u,
        v
    ]);
    const [w, k1] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(), x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!d) return;
        let e, t;
        if (c && p(d), r) e = y(d), t = z(d);
        else {
            const n = d.getBoundingClientRect();
            e = n.top + P(d), t = n.left + E(d);
        }
        c && b(d), v({
            top: e,
            left: t,
            element: d
        });
    }, [
        r,
        c,
        d,
        v
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        x();
        const e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$just$2d$debounce$2d$it$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(x, u), t = new ResizeObserver(e);
        return t.observe(null != w ? w : document.body), ()=>{
            t.disconnect(), e.cancel();
        };
    }, [
        w,
        u,
        x
    ]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>L.on("resize", function() {
            if (!d) return;
            const e = d.getBoundingClientRect();
            v({
                width: e.width,
                height: e.height
            }), x();
        }), [
        d,
        x,
        v
    ]);
    const O = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(()=>f.current, []);
    return [
        l,
        s ? O : h,
        k1
    ];
}
function x({ lazy: r = !1, debounce: c = 500, box: u = "border-box", callback: s = ()=>{} } = {}) {
    const a = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({}), [d, l] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({}), [f, h] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!f) return;
        const e = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$just$2d$debounce$2d$it$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(([e])=>{
            a.current = e, s(e), r || l(e);
        }, c, !0), t = new ResizeObserver(e);
        return t.observe(f, {
            box: u
        }), ()=>{
            t.disconnect(), e.cancel();
        };
    }, [
        f,
        r,
        c,
        u
    ]);
    const m = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(()=>a.current, []);
    return [
        h,
        r ? m : d
    ];
}
function O(e = [], t = []) {
    const n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>t && [
            t
        ].flat(), [
        t
    ]), o = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>e && [
            e
        ].flat(), [
        e
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!n || !o) return;
        const t = o.map((e)=>{
            var t;
            return null == (t = n.find((t)=>t.type === e)) ? void 0 : t.props.children;
        });
        return e[0] ? t : t[0];
    }, [
        n,
        o
    ]);
}
function S(e = 500) {
    const [r, o] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(), [c, u] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$just$2d$debounce$2d$it$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>{
            o(Math.min(window.innerWidth, document.documentElement.clientWidth)), u(Math.min(window.innerHeight, document.documentElement.clientHeight));
        }, e);
        return window.addEventListener("resize", t, !1), t(), ()=>window.removeEventListener("resize", t, !1);
    }, [
        e
    ]), {
        width: r,
        height: c
    };
}
k.resize = ()=>{
    L.emit("resize");
};
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/@studio-freight/lenis/dist/lenis.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Lenis
]);
function t(t, e, i) {
    return Math.max(t, Math.min(e, i));
}
class Animate {
    advance(e) {
        if (!this.isRunning) return;
        let i = !1;
        if (this.lerp) this.value = (s = this.value, o = this.to, n = 60 * this.lerp, r = e, function(t, e, i) {
            return (1 - i) * t + i * e;
        }(s, o, 1 - Math.exp(-n * r))), Math.round(this.value) === this.to && (this.value = this.to, i = !0);
        else {
            this.currentTime += e;
            const s = t(0, this.currentTime / this.duration, 1);
            i = s >= 1;
            const o = i ? 1 : this.easing(s);
            this.value = this.from + (this.to - this.from) * o;
        }
        var s, o, n, r;
        this.onUpdate?.(this.value, i), i && this.stop();
    }
    stop() {
        this.isRunning = !1;
    }
    fromTo(t, e, { lerp: i = .1, duration: s = 1, easing: o = (t)=>t, onStart: n, onUpdate: r }) {
        this.from = this.value = t, this.to = e, this.lerp = i, this.duration = s, this.easing = o, this.currentTime = 0, this.isRunning = !0, n?.(), this.onUpdate = r;
    }
}
class Dimensions {
    constructor({ wrapper: t, content: e, autoResize: i = !0, debounce: s = 250 } = {}){
        this.wrapper = t, this.content = e, i && (this.debouncedResize = function(t, e) {
            let i;
            return function() {
                let s = arguments, o = this;
                clearTimeout(i), i = setTimeout(function() {
                    t.apply(o, s);
                }, e);
            };
        }(this.resize, s), this.wrapper === window ? window.addEventListener("resize", this.debouncedResize, !1) : (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content)), this.resize();
    }
    destroy() {
        this.wrapperResizeObserver?.disconnect(), this.contentResizeObserver?.disconnect(), window.removeEventListener("resize", this.debouncedResize, !1);
    }
    resize = ()=>{
        this.onWrapperResize(), this.onContentResize();
    };
    onWrapperResize = ()=>{
        this.wrapper === window ? (this.width = window.innerWidth, this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight);
    };
    onContentResize = ()=>{
        this.wrapper === window ? (this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth) : (this.scrollHeight = this.wrapper.scrollHeight, this.scrollWidth = this.wrapper.scrollWidth);
    };
    get limit() {
        return {
            x: this.scrollWidth - this.width,
            y: this.scrollHeight - this.height
        };
    }
}
class Emitter {
    constructor(){
        this.events = {};
    }
    emit(t, ...e) {
        let i = this.events[t] || [];
        for(let t = 0, s = i.length; t < s; t++)i[t](...e);
    }
    on(t, e) {
        return this.events[t]?.push(e) || (this.events[t] = [
            e
        ]), ()=>{
            this.events[t] = this.events[t]?.filter((t)=>e !== t);
        };
    }
    off(t, e) {
        this.events[t] = this.events[t]?.filter((t)=>e !== t);
    }
    destroy() {
        this.events = {};
    }
}
const e = 100 / 6;
class VirtualScroll {
    constructor(t, { wheelMultiplier: e = 1, touchMultiplier: i = 1 }){
        this.element = t, this.wheelMultiplier = e, this.touchMultiplier = i, this.touchStart = {
            x: null,
            y: null
        }, this.emitter = new Emitter, window.addEventListener("resize", this.onWindowResize, !1), this.onWindowResize(), this.element.addEventListener("wheel", this.onWheel, {
            passive: !1
        }), this.element.addEventListener("touchstart", this.onTouchStart, {
            passive: !1
        }), this.element.addEventListener("touchmove", this.onTouchMove, {
            passive: !1
        }), this.element.addEventListener("touchend", this.onTouchEnd, {
            passive: !1
        });
    }
    on(t, e) {
        return this.emitter.on(t, e);
    }
    destroy() {
        this.emitter.destroy(), window.removeEventListener("resize", this.onWindowResize, !1), this.element.removeEventListener("wheel", this.onWheel, {
            passive: !1
        }), this.element.removeEventListener("touchstart", this.onTouchStart, {
            passive: !1
        }), this.element.removeEventListener("touchmove", this.onTouchMove, {
            passive: !1
        }), this.element.removeEventListener("touchend", this.onTouchEnd, {
            passive: !1
        });
    }
    onTouchStart = (t)=>{
        const { clientX: e, clientY: i } = t.targetTouches ? t.targetTouches[0] : t;
        this.touchStart.x = e, this.touchStart.y = i, this.lastDelta = {
            x: 0,
            y: 0
        }, this.emitter.emit("scroll", {
            deltaX: 0,
            deltaY: 0,
            event: t
        });
    };
    onTouchMove = (t)=>{
        const { clientX: e, clientY: i } = t.targetTouches ? t.targetTouches[0] : t, s = -(e - this.touchStart.x) * this.touchMultiplier, o = -(i - this.touchStart.y) * this.touchMultiplier;
        this.touchStart.x = e, this.touchStart.y = i, this.lastDelta = {
            x: s,
            y: o
        }, this.emitter.emit("scroll", {
            deltaX: s,
            deltaY: o,
            event: t
        });
    };
    onTouchEnd = (t)=>{
        this.emitter.emit("scroll", {
            deltaX: this.lastDelta.x,
            deltaY: this.lastDelta.y,
            event: t
        });
    };
    onWheel = (t)=>{
        let { deltaX: i, deltaY: s, deltaMode: o } = t;
        i *= 1 === o ? e : 2 === o ? this.windowWidth : 1, s *= 1 === o ? e : 2 === o ? this.windowHeight : 1, i *= this.wheelMultiplier, s *= this.wheelMultiplier, this.emitter.emit("scroll", {
            deltaX: i,
            deltaY: s,
            event: t
        });
    };
    onWindowResize = ()=>{
        this.windowWidth = window.innerWidth, this.windowHeight = window.innerHeight;
    };
}
class Lenis {
    constructor({ wrapper: t = window, content: e = document.documentElement, wheelEventsTarget: i = t, eventsTarget: s = i, smoothWheel: o = !0, syncTouch: n = !1, syncTouchLerp: r = .075, touchInertiaMultiplier: l = 35, duration: h, easing: a = (t)=>Math.min(1, 1.001 - Math.pow(2, -10 * t)), lerp: c = !h && .1, infinite: d = !1, orientation: p = "vertical", gestureOrientation: u = "vertical", touchMultiplier: m = 1, wheelMultiplier: v = 1, autoResize: g = !0, __experimental__naiveDimensions: S = !1 } = {}){
        this.__isSmooth = !1, this.__isScrolling = !1, this.__isStopped = !1, this.__isLocked = !1, this.onVirtualScroll = ({ deltaX: t, deltaY: e, event: i })=>{
            if (i.ctrlKey) return;
            const s = i.type.includes("touch"), o = i.type.includes("wheel");
            if (this.options.syncTouch && s && "touchstart" === i.type && !this.isStopped && !this.isLocked) return void this.reset();
            const n = 0 === t && 0 === e, r = "vertical" === this.options.gestureOrientation && 0 === e || "horizontal" === this.options.gestureOrientation && 0 === t;
            if (n || r) return;
            let l = i.composedPath();
            if (l = l.slice(0, l.indexOf(this.rootElement)), l.find((t)=>{
                var e, i, n, r, l;
                return (null === (e = t.hasAttribute) || void 0 === e ? void 0 : e.call(t, "data-lenis-prevent")) || s && (null === (i = t.hasAttribute) || void 0 === i ? void 0 : i.call(t, "data-lenis-prevent-touch")) || o && (null === (n = t.hasAttribute) || void 0 === n ? void 0 : n.call(t, "data-lenis-prevent-wheel")) || (null === (r = t.classList) || void 0 === r ? void 0 : r.contains("lenis")) && !(null === (l = t.classList) || void 0 === l ? void 0 : l.contains("lenis-stopped"));
            })) return;
            if (this.isStopped || this.isLocked) return void i.preventDefault();
            if (this.isSmooth = this.options.syncTouch && s || this.options.smoothWheel && o, !this.isSmooth) return this.isScrolling = !1, void this.animate.stop();
            i.preventDefault();
            let h = e;
            "both" === this.options.gestureOrientation ? h = Math.abs(e) > Math.abs(t) ? e : t : "horizontal" === this.options.gestureOrientation && (h = t);
            const a = s && this.options.syncTouch, c = s && "touchend" === i.type && Math.abs(h) > 5;
            c && (h = this.velocity * this.options.touchInertiaMultiplier), this.scrollTo(this.targetScroll + h, Object.assign({
                programmatic: !1
            }, a ? {
                lerp: c ? this.options.syncTouchLerp : 1
            } : {
                lerp: this.options.lerp,
                duration: this.options.duration,
                easing: this.options.easing
            }));
        }, this.onNativeScroll = ()=>{
            if (!this.__preventNextScrollEvent && !this.isScrolling) {
                const t = this.animatedScroll;
                this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, this.direction = Math.sign(this.animatedScroll - t), this.emit();
            }
        }, window.lenisVersion = "1.0.42", t !== document.documentElement && t !== document.body || (t = window), this.options = {
            wrapper: t,
            content: e,
            wheelEventsTarget: i,
            eventsTarget: s,
            smoothWheel: o,
            syncTouch: n,
            syncTouchLerp: r,
            touchInertiaMultiplier: l,
            duration: h,
            easing: a,
            lerp: c,
            infinite: d,
            gestureOrientation: u,
            orientation: p,
            touchMultiplier: m,
            wheelMultiplier: v,
            autoResize: g,
            __experimental__naiveDimensions: S
        }, this.animate = new Animate, this.emitter = new Emitter, this.dimensions = new Dimensions({
            wrapper: t,
            content: e,
            autoResize: g
        }), this.toggleClassName("lenis", !0), this.velocity = 0, this.isLocked = !1, this.isStopped = !1, this.isSmooth = n || o, this.isScrolling = !1, this.targetScroll = this.animatedScroll = this.actualScroll, this.options.wrapper.addEventListener("scroll", this.onNativeScroll, !1), this.virtualScroll = new VirtualScroll(s, {
            touchMultiplier: m,
            wheelMultiplier: v
        }), this.virtualScroll.on("scroll", this.onVirtualScroll);
    }
    destroy() {
        this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, !1), this.virtualScroll.destroy(), this.dimensions.destroy(), this.toggleClassName("lenis", !1), this.toggleClassName("lenis-smooth", !1), this.toggleClassName("lenis-scrolling", !1), this.toggleClassName("lenis-stopped", !1), this.toggleClassName("lenis-locked", !1);
    }
    on(t, e) {
        return this.emitter.on(t, e);
    }
    off(t, e) {
        return this.emitter.off(t, e);
    }
    setScroll(t) {
        this.isHorizontal ? this.rootElement.scrollLeft = t : this.rootElement.scrollTop = t;
    }
    resize() {
        this.dimensions.resize();
    }
    emit() {
        this.emitter.emit("scroll", this);
    }
    reset() {
        this.isLocked = !1, this.isScrolling = !1, this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, this.animate.stop();
    }
    start() {
        this.isStopped && (this.isStopped = !1, this.reset());
    }
    stop() {
        this.isStopped || (this.isStopped = !0, this.animate.stop(), this.reset());
    }
    raf(t) {
        const e = t - (this.time || t);
        this.time = t, this.animate.advance(.001 * e);
    }
    scrollTo(e, { offset: i = 0, immediate: s = !1, lock: o = !1, duration: n = this.options.duration, easing: r = this.options.easing, lerp: l = !n && this.options.lerp, onComplete: h, force: a = !1, programmatic: c = !0 } = {}) {
        if (!this.isStopped && !this.isLocked || a) {
            if ([
                "top",
                "left",
                "start"
            ].includes(e)) e = 0;
            else if ([
                "bottom",
                "right",
                "end"
            ].includes(e)) e = this.limit;
            else {
                let t;
                if ("string" == typeof e ? t = document.querySelector(e) : (null == e ? void 0 : e.nodeType) && (t = e), t) {
                    if (this.options.wrapper !== window) {
                        const t = this.options.wrapper.getBoundingClientRect();
                        i -= this.isHorizontal ? t.left : t.top;
                    }
                    const s = t.getBoundingClientRect();
                    e = (this.isHorizontal ? s.left : s.top) + this.animatedScroll;
                }
            }
            if ("number" == typeof e) {
                if (e += i, e = Math.round(e), this.options.infinite ? c && (this.targetScroll = this.animatedScroll = this.scroll) : e = t(0, e, this.limit), s) return this.animatedScroll = this.targetScroll = e, this.setScroll(this.scroll), this.reset(), void (null == h || h(this));
                if (!c) {
                    if (e === this.targetScroll) return;
                    this.targetScroll = e;
                }
                this.animate.fromTo(this.animatedScroll, e, {
                    duration: n,
                    easing: r,
                    lerp: l,
                    onStart: ()=>{
                        o && (this.isLocked = !0), this.isScrolling = !0;
                    },
                    onUpdate: (t, e)=>{
                        this.isScrolling = !0, this.velocity = t - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = t, this.setScroll(this.scroll), c && (this.targetScroll = t), e || this.emit(), e && (this.reset(), this.emit(), null == h || h(this), this.__preventNextScrollEvent = !0, requestAnimationFrame(()=>{
                            delete this.__preventNextScrollEvent;
                        }));
                    }
                });
            }
        }
    }
    get rootElement() {
        return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
    }
    get limit() {
        return this.options.__experimental__naiveDimensions ? this.isHorizontal ? this.rootElement.scrollWidth - this.rootElement.clientWidth : this.rootElement.scrollHeight - this.rootElement.clientHeight : this.dimensions.limit[this.isHorizontal ? "x" : "y"];
    }
    get isHorizontal() {
        return "horizontal" === this.options.orientation;
    }
    get actualScroll() {
        return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
    }
    get scroll() {
        return this.options.infinite ? (t = this.animatedScroll, e = this.limit, (t % e + e) % e) : this.animatedScroll;
        //TURBOPACK unreachable
        ;
        var t, e;
    }
    get progress() {
        return 0 === this.limit ? 1 : this.scroll / this.limit;
    }
    get isSmooth() {
        return this.__isSmooth;
    }
    set isSmooth(t) {
        this.__isSmooth !== t && (this.__isSmooth = t, this.toggleClassName("lenis-smooth", t));
    }
    get isScrolling() {
        return this.__isScrolling;
    }
    set isScrolling(t) {
        this.__isScrolling !== t && (this.__isScrolling = t, this.toggleClassName("lenis-scrolling", t));
    }
    get isStopped() {
        return this.__isStopped;
    }
    set isStopped(t) {
        this.__isStopped !== t && (this.__isStopped = t, this.toggleClassName("lenis-stopped", t));
    }
    get isLocked() {
        return this.__isLocked;
    }
    set isLocked(t) {
        this.__isLocked !== t && (this.__isLocked = t, this.toggleClassName("lenis-locked", t));
    }
    get className() {
        let t = "lenis";
        return this.isStopped && (t += " lenis-stopped"), this.isLocked && (t += " lenis-locked"), this.isScrolling && (t += " lenis-scrolling"), this.isSmooth && (t += " lenis-smooth"), t;
    }
    toggleClassName(t, e) {
        this.rootElement.classList.toggle(t, e), this.emitter.emit("className change", this);
    }
}
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clsx",
    ()=>clsx,
    "default",
    ()=>__TURBOPACK__default__export__
]);
function r(e) {
    var t, f, n = "";
    if ("string" == typeof e || "number" == typeof e) n += e;
    else if ("object" == typeof e) if (Array.isArray(e)) {
        var o = e.length;
        for(t = 0; t < o; t++)e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
    } else for(f in e)e[f] && (n && (n += " "), n += f);
    return n;
}
function clsx() {
    for(var e, t, f = 0, n = "", o = arguments.length; f < o; f++)(e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
    return n;
}
const __TURBOPACK__default__export__ = clsx;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/@studio-freight/react-lenis/node_modules/zustand/esm/vanilla.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createStore",
    ()=>createStore,
    "default",
    ()=>vanilla
]);
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/@studio-freight/react-lenis/node_modules/zustand/esm/vanilla.mjs")}`;
    },
    get turbopackHot () {
        return __turbopack_context__.m.hot;
    }
};
const createStoreImpl = (createState)=>{
    let state;
    const listeners = /* @__PURE__ */ new Set();
    const setState = (partial, replace)=>{
        const nextState = typeof partial === "function" ? partial(state) : partial;
        if (!Object.is(nextState, state)) {
            const previousState = state;
            state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
            listeners.forEach((listener)=>listener(state, previousState));
        }
    };
    const getState = ()=>state;
    const getInitialState = ()=>initialState;
    const subscribe = (listener)=>{
        listeners.add(listener);
        return ()=>listeners.delete(listener);
    };
    const destroy = ()=>{
        if ((__TURBOPACK__import$2e$meta__.env ? __TURBOPACK__import$2e$meta__.env.MODE : void 0) !== "production") {
            console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected.");
        }
        listeners.clear();
    };
    const api = {
        setState,
        getState,
        getInitialState,
        subscribe,
        destroy
    };
    const initialState = state = createState(setState, getState, api);
    return api;
};
const createStore = (createState)=>createState ? createStoreImpl(createState) : createStoreImpl;
var vanilla = (createState)=>{
    if ((__TURBOPACK__import$2e$meta__.env ? __TURBOPACK__import$2e$meta__.env.MODE : void 0) !== "production") {
        console.warn("[DEPRECATED] Default export is deprecated. Instead use import { createStore } from 'zustand/vanilla'.");
    }
    return createStore(createState);
};
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/@studio-freight/react-lenis/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "create",
    ()=>create,
    "default",
    ()=>react,
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f40$studio$2d$freight$2f$react$2d$lenis$2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/@studio-freight/react-lenis/node_modules/zustand/esm/vanilla.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$with$2d$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/use-sync-external-store/shim/with-selector.js [app-client] (ecmascript)");
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/@studio-freight/react-lenis/node_modules/zustand/esm/index.mjs")}`;
    },
    get turbopackHot () {
        return __turbopack_context__.m.hot;
    }
};
;
;
;
;
const { useDebugValue } = __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
const { useSyncExternalStoreWithSelector } = __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$use$2d$sync$2d$external$2d$store$2f$shim$2f$with$2d$selector$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
let didWarnAboutEqualityFn = false;
const identity = (arg)=>arg;
function useStore(api, selector = identity, equalityFn) {
    if ((__TURBOPACK__import$2e$meta__.env ? __TURBOPACK__import$2e$meta__.env.MODE : void 0) !== "production" && equalityFn && !didWarnAboutEqualityFn) {
        console.warn("[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937");
        didWarnAboutEqualityFn = true;
    }
    const slice = useSyncExternalStoreWithSelector(api.subscribe, api.getState, api.getServerState || api.getInitialState, selector, equalityFn);
    useDebugValue(slice);
    return slice;
}
const createImpl = (createState)=>{
    if ((__TURBOPACK__import$2e$meta__.env ? __TURBOPACK__import$2e$meta__.env.MODE : void 0) !== "production" && typeof createState !== "function") {
        console.warn("[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`.");
    }
    const api = typeof createState === "function" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f40$studio$2d$freight$2f$react$2d$lenis$2f$node_modules$2f$zustand$2f$esm$2f$vanilla$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createStore"])(createState) : createState;
    const useBoundStore = (selector, equalityFn)=>useStore(api, selector, equalityFn);
    Object.assign(useBoundStore, api);
    return useBoundStore;
};
const create = (createState)=>createState ? createImpl(createState) : createImpl;
var react = (createState)=>{
    if ((__TURBOPACK__import$2e$meta__.env ? __TURBOPACK__import$2e$meta__.env.MODE : void 0) !== "production") {
        console.warn("[DEPRECATED] Default export is deprecated. Instead use `import { create } from 'zustand'`.");
    }
    return create(createState);
};
;
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function is(x, y) {
        return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    function useSyncExternalStore$2(subscribe, getSnapshot) {
        didWarnOld18Alpha || void 0 === React.startTransition || (didWarnOld18Alpha = !0, console.error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."));
        var value = getSnapshot();
        if (!didWarnUncachedGetSnapshot) {
            var cachedValue = getSnapshot();
            objectIs(value, cachedValue) || (console.error("The result of getSnapshot should be cached to avoid an infinite loop"), didWarnUncachedGetSnapshot = !0);
        }
        cachedValue = useState({
            inst: {
                value: value,
                getSnapshot: getSnapshot
            }
        });
        var inst = cachedValue[0].inst, forceUpdate = cachedValue[1];
        useLayoutEffect({
            "useSyncExternalStore$2.useLayoutEffect": function() {
                inst.value = value;
                inst.getSnapshot = getSnapshot;
                checkIfSnapshotChanged(inst) && forceUpdate({
                    inst: inst
                });
            }
        }["useSyncExternalStore$2.useLayoutEffect"], [
            subscribe,
            value,
            getSnapshot
        ]);
        useEffect({
            "useSyncExternalStore$2.useEffect": function() {
                checkIfSnapshotChanged(inst) && forceUpdate({
                    inst: inst
                });
                return subscribe({
                    "useSyncExternalStore$2.useEffect": function() {
                        checkIfSnapshotChanged(inst) && forceUpdate({
                            inst: inst
                        });
                    }
                }["useSyncExternalStore$2.useEffect"]);
            }
        }["useSyncExternalStore$2.useEffect"], [
            subscribe
        ]);
        useDebugValue(value);
        return value;
    }
    function checkIfSnapshotChanged(inst) {
        var latestGetSnapshot = inst.getSnapshot;
        inst = inst.value;
        try {
            var nextValue = latestGetSnapshot();
            return !objectIs(inst, nextValue);
        } catch (error) {
            return !0;
        }
    }
    function useSyncExternalStore$1(subscribe, getSnapshot) {
        return getSnapshot();
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = __turbopack_context__.r("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), objectIs = "function" === typeof Object.is ? Object.is : is, useState = React.useState, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue = React.useDebugValue, didWarnOld18Alpha = !1, didWarnUncachedGetSnapshot = !1, shim = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
    exports.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
}();
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/use-sync-external-store/shim/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js [app-client] (ecmascript)");
}
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function is(x, y) {
        return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = __turbopack_context__.r("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), shim = __turbopack_context__.r("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/use-sync-external-store/shim/index.js [app-client] (ecmascript)"), objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue = React.useDebugValue;
    exports.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
        var instRef = useRef(null);
        if (null === instRef.current) {
            var inst = {
                hasValue: !1,
                value: null
            };
            instRef.current = inst;
        } else inst = instRef.current;
        instRef = useMemo(function() {
            function memoizedSelector(nextSnapshot) {
                if (!hasMemo) {
                    hasMemo = !0;
                    memoizedSnapshot = nextSnapshot;
                    nextSnapshot = selector(nextSnapshot);
                    if (void 0 !== isEqual && inst.hasValue) {
                        var currentSelection = inst.value;
                        if (isEqual(currentSelection, nextSnapshot)) return memoizedSelection = currentSelection;
                    }
                    return memoizedSelection = nextSnapshot;
                }
                currentSelection = memoizedSelection;
                if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
                var nextSelection = selector(nextSnapshot);
                if (void 0 !== isEqual && isEqual(currentSelection, nextSelection)) return memoizedSnapshot = nextSnapshot, currentSelection;
                memoizedSnapshot = nextSnapshot;
                return memoizedSelection = nextSelection;
            }
            var hasMemo = !1, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
            return [
                function() {
                    return memoizedSelector(getSnapshot());
                },
                null === maybeGetServerSnapshot ? void 0 : function() {
                    return memoizedSelector(maybeGetServerSnapshot());
                }
            ];
        }, [
            getSnapshot,
            getServerSnapshot,
            selector,
            isEqual
        ]);
        var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
        useEffect(function() {
            inst.hasValue = !0;
            inst.value = value;
        }, [
            value
        ]);
        useDebugValue(value);
        return value;
    };
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
}();
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/use-sync-external-store/shim/with-selector.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js [app-client] (ecmascript)");
}
}),
"[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/@studio-freight/react-lenis/dist/react-lenis.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Lenis",
    ()=>y,
    "LenisContext",
    ()=>d,
    "ReactLenis",
    ()=>y,
    "default",
    ()=>y,
    "useLenis",
    ()=>b
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f40$studio$2d$freight$2f$hamo$2f$dist$2f$hamo$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/@studio-freight/hamo/dist/hamo.modern.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f40$studio$2d$freight$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/@studio-freight/lenis/dist/lenis.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f40$studio$2d$freight$2f$react$2d$lenis$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Wildlife-Population-Intelligence-System-Group-1/frontend/wildlife-frontend/node_modules/@studio-freight/react-lenis/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
;
;
;
;
;
"function" == typeof SuppressedError && SuppressedError;
"undefined" != typeof window && (window.reactLenisVersion = "0.0.47");
const d = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null), m = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f40$studio$2d$freight$2f$react$2d$lenis$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])(()=>({}));
function b(r, e = [], t = 0) {
    const { lenis: n, addCallback: o, removeCallback: a } = function() {
        const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(d), e = m();
        return null != r ? r : e;
    }();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (r && o && a && n) return o(r, t), r(n), ()=>{
            a(r);
        };
    }, [
        n,
        o,
        a,
        t,
        ...e
    ]), n;
}
const y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((o, a)=>{
    var { children: f, root: p = !1, options: b = {}, autoRaf: y = !0, rafPriority: v = 0, className: O } = o, g = function(r, e) {
        var t = {};
        for(var n in r)Object.prototype.hasOwnProperty.call(r, n) && e.indexOf(n) < 0 && (t[n] = r[n]);
        if (null != r && "function" == typeof Object.getOwnPropertySymbols) {
            var o = 0;
            for(n = Object.getOwnPropertySymbols(r); o < n.length; o++)e.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(r, n[o]) && (t[n[o]] = r[n[o]]);
        }
        return t;
    }(o, [
        "children",
        "root",
        "options",
        "autoRaf",
        "rafPriority",
        "className"
    ]);
    const h = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null), w = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null), [k, N] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(void 0), j = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]), C = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])((r, e)=>{
        j.current.push({
            callback: r,
            priority: e
        }), j.current.sort((r, e)=>r.priority - e.priority);
    }, []), E = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])((r)=>{
        j.current = j.current.filter((e)=>e.callback !== r);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImperativeHandle"])(a, ()=>({
            wrapper: h.current,
            content: w.current,
            lenis: k
        }), [
        k
    ]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const r = new __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f40$studio$2d$freight$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](Object.assign(Object.assign({}, b), !p && {
            wrapper: h.current,
            content: w.current
        }));
        return N(r), ()=>{
            r.destroy(), N(void 0);
        };
    }, [
        p,
        JSON.stringify(b)
    ]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f40$studio$2d$freight$2f$hamo$2f$dist$2f$hamo$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFrame"])((r)=>{
        y && (null == k || k.raf(r));
    }, v), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        p && k && m.setState({
            lenis: k,
            addCallback: C,
            removeCallback: E
        });
    }, [
        p,
        k,
        C,
        E
    ]);
    const P = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])((r)=>{
        for(let e = 0; e < j.current.length; e++)j.current[e].callback(r);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>(null == k || k.on("scroll", P), ()=>{
            null == k || k.off("scroll", P);
        }), [
        k,
        P
    ]);
    const S = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        h.current && (h.current.className = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(null == k ? void 0 : k.className, O));
    }, [
        k,
        O
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>(S(), null == k || k.on("className change", S), ()=>{
            null == k || k.off("className change", S);
        }), [
        k,
        S
    ]), __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(d.Provider, {
        value: {
            lenis: k,
            addCallback: C,
            removeCallback: E
        }
    }, p ? f : __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", Object.assign({
        ref: h,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(null == k ? void 0 : k.className, O)
    }, g), __TURBOPACK__imported__module__$5b$project$5d2f$Wildlife$2d$Population$2d$Intelligence$2d$System$2d$Group$2d$1$2f$frontend$2f$wildlife$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", {
        ref: w
    }, f)));
});
;
}),
]);

//# sourceMappingURL=08ze_0xcusch._.js.map