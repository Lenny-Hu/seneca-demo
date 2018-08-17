const $module = 'module:user';
let userCount = 3;

const REST_Routes = [
  {
    prefix: '/user',
    pin: `${$module},if:*`,
    map: {
      list: {
        GET: true,
        name: ''
      },
      load: {
        GET: true,
        name: '',
        suffix: '/:id'
      },
      edit: {
        PUT: true,
        name: '',
        suffix: '/:id'
      },
      create: {
        POST: true,
        name: ''
      },
      delete: {
        DELETE: true,
        name: '',
        suffix: '/:id'
      }
    }
  }
];

const db = {
  users: [
    {
      id: 1,
      name: '甲'
    },
    {
      id: 2,
      name: '乙'
    },
    {
      id: 3,
      name: '丙'
    }
  ]
};

let user = function () {
  this.add(`${$module},if:list`, (msg, done) => {
    done(null, db.users);
  });

  this.add(`${$module},if:load`, (msg, done) => {
    let {id} = msg.args.params;
    done(null, db,users.find(v => Number(id) === v.id));
  });

  this.add(`${$module},if:edit`, (msg, done) => {
    let {id} = msg.args.params;
    id = +id;
    let {name} = msg.args.body;
    let index = db.users.findIndex(v => v.id === id);
    if (index !== -1) {
      db.users.splice(index, 1, {
        id,
        name
      });
      done(null, db.users);
    } else {
      done(null, {sucess: false});
    }
  });

  this.add(`${$module},if:create`, (msg, done) => {
    let {name} = msg.args.body;
    db.users.push({
      id: ++userCount,
      name
    });
    done(null, db.users);
  });

  this.add(`${$module},if:delete`, (msg, done) => {
    let {id} = msg.args.params;
    id = +id;
    let index = db.users.findIndex(v => v.id === id);
    if (index !== -1) {
      db.users.splice(index, 1);
      done(null, db.users);
    } else {
      done(null, {success: false});
    }
  });
};

module.exports = {
  init: user,
  routes: REST_Routes
};

