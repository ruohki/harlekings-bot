import mongoose from 'mongoose';

const Schema = mongoose.Schema;
let MemberInfoSchema = new Schema({
    _id: String,
    online: Date,
    offline: Date,
    lastActive: Date,
    nickname: String,
    words: Number,
    chars: Number,
    games: Schema.Types.Mixed,
});
MemberInfoSchema.virtual('snowflake').get(function() { return this._id; });
export let MemberInfo = mongoose.model('Memberinfo', MemberInfoSchema);
