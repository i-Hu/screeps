const mountCreep = require('./mount.creep');

// 挂载所有的额外属性和方法
module.exports = function () {
    // 检查挂载失效
    if (!global.hasExtension) {
        console.log('[mount] 重新挂载拓展');
        global.hasExtension = true;

        mountCreep()
    }
};