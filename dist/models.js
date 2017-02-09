'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MemberInfo = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose2.default.Schema;
let MemberInfoSchema = new Schema({
    _id: String,
    online: Date,
    offline: Date,
    nickname: String,
    words: Number,
    chars: Number
});
MemberInfoSchema.virtual('snowflake').get(function () {
    return this._id;
});
let MemberInfo = exports.MemberInfo = _mongoose2.default.model('Memberinfo', MemberInfoSchema);