"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const result_option_1 = require("@robotmayo/result-option");
function wrapPromise(p) {
    return p.then(x => new result_option_1.Ok(x)).catch(err => new result_option_1.Err(err));
}
exports.default = wrapPromise;
//# sourceMappingURL=wrap.js.map