// This file fixes the estree-walker exports issue
const estreeWalker = require("estree-walker");

module.exports = estreeWalker;
module.exports.walk = estreeWalker.walk;
module.exports.asyncWalk = estreeWalker.asyncWalk;
module.exports.sync = estreeWalker.sync;
module.exports.enter = estreeWalker.enter;
module.exports.leave = estreeWalker.leave;
module.exports.traverse = estreeWalker.traverse;
module.exports.asyncTraverse = estreeWalker.asyncTraverse;
module.exports.Walker = estreeWalker.Walker;
module.exports.AsyncWalker = estreeWalker.AsyncWalker;
