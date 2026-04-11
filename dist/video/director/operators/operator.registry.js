"use strict";
// src/video/director/operators/operator.registry.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOperatorById = exports.getPreferredOperator = void 0;
const krea_operator_1 = require("./krea.operator");
const runway_operator_1 = require("./runway.operator");
const fashn_operator_1 = require("./fashn.operator");
const registry = [
    krea_operator_1.kreaOperator,
    runway_operator_1.runwayOperator,
    fashn_operator_1.fashnOperator,
];
const getPreferredOperator = () => {
    return registry[0];
};
exports.getPreferredOperator = getPreferredOperator;
const getOperatorById = (id) => {
    return registry.find((op) => op.id === id) || null;
};
exports.getOperatorById = getOperatorById;
