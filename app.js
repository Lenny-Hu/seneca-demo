const seneca = require('seneca')({
  log: {
    level: 'debug+' // none debug+ info+ warn+
  },
  short: true // 设置为true时，seneca日志功能会encapsulate senecaId,senecaTag,actId等字段后输出（一般为两字符）
});
const Promise = require('bluebird');
const SenecaWeb = require('seneca-web');
const Koa = require('koa');
const Router = require('koa-router');

const userModule = require('./modules/user');

const app = new Koa();

// 初始化用户模块
seneca.use(userModule.init);

// 初始化seneca-web插件，并适配koa
seneca.use(SenecaWeb, {
  context: Router(),
  adapter: require('seneca-web-adapter-koa2'),
  routes: [...userModule.routes]
});

// 将routes导出给koa app
seneca.ready(() => {
  app.use(seneca.export('web/context')().routes());
});

app.listen(3333);

