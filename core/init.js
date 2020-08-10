const requierDirectory = require("require-directory");
const Router = require("koa-router");
const { scheduleStatistics } = require('./schedule')

class InitManager {
  static initCore(app) {
    InitManager.app = app;
    InitManager.ininLoadRouter();
    InitManager.loadErrors()
    InitManager.loadConfig()
    InitManager.schedule()
  }

  // 添加config到全局变量
  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/config.js'
    const config = require(configPath)
    global.config = config
  }

  // 自动加载注册路由
  static ininLoadRouter() {
    const apiDirectory = `${process.cwd()}/app/api`;

    requierDirectory(module, apiDirectory, {
      visit: whenLoadModule
    });

    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes());
      }
    }
  }

  // 将错误类添加到全局变量
  static loadErrors() {
    const errors = require("./http-exception")
    global.errs = errors
  }

  static schedule() {
    scheduleStatistics()
  }
}

module.exports = InitManager;
