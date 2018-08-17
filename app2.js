const seneca = require('seneca')();

// 定义加法服务1
seneca.add({role: 'math', cmd: 'sum', integer: true}, (msg, reply) => {
  let sum = Math.floor(msg.left) + Math.floor(msg.right);
  console.log('使用加法服务1');
  reply(null, {answer: sum});
});

// 定义加法服务2
seneca.add({role: 'math', cmd: 'sum'}, (msg, reply) => {
  let sum = Math.floor(msg.left) + Math.floor(msg.right);
  console.log('使用加法服务2-----');
  reply(null, {answer: sum});
});

// 定义乘法服务
seneca.add('role:math, cmd:product', (msg, reply) => {
  reply(null, {answer: (msg.left * msg.right)});
});

// 如果有两个相同的模式，那么 Seneca 最终会将消息匹配至哪条模式呢？原则是：更多匹配项目被匹配到的优先，被匹配到的属性越多，则优先级越高。
//此处匹配的是加法服务1
seneca.act({role: 'math', cmd: 'sum', left: 10.2, right: 2.8, integer: true}, console.log);
// 匹配加法服务2
seneca.act({role: 'math', cmd: 'sum', left: 10.2, right: 2.8}, console.log);


seneca.act({role: 'math', cmd: 'product', left: 3, right: 5}, console.log);


// 复用代码
seneca.add({role: 'math', cmd: 'sum2', integer: true}, function (msg, reply) {
  // 在该代码内，调用了加法服务2，达到了复用的目的，this指向seneca实例，而不是调用方seneca.act
  console.log('复用代码将要调用加法服务2');
  this.act({
    role: 'math',
    cmd: 'sum',
    left: Math.floor(msg.left),
    right: Math.floor(msg.right)
  }, reply);
});
seneca.act({role: 'math', cmd: 'sum2', left: 19, right: 2, integer: true}, console.log);
