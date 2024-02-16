"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MAX_LEN = 5;
function generate() {
    const subset = "123456789qwertyuiopasdfghjklzxcvbnm";
    const length = MAX_LEN;
    var id = "";
    for (let i = 0; i <= length; i++)
        id += subset[Math.floor(Math.random() * subset.length)];
    return id;
}
exports.default = generate;
