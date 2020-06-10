const jwt = require("jsonwebtoken");
/***
 *
 */
const findMembers = function(instance, { prefix, specifiedType, filter }) {
  // 递归函数
  function _find(instance) {
    //基线条件（跳出递归）
    if (instance.__proto__ === null) return [];

    let names = Reflect.ownKeys(instance);
    names = names.filter(name => {
      // 过滤掉不满足条件的属性或方法名
      return _shouldKeep(name);
    });

    return [...names, ..._find(instance.__proto__)];
  }

  function _shouldKeep(value) {
    if (filter) {
      if (filter(value)) {
        return true;
      }
    }
    if (prefix) if (value.startsWith(prefix)) return true;
    if (specifiedType)
      if (instance[value] instanceof specifiedType) return true;
  }

  return _find(instance);
};

const generateToken = function(uid, userType) {
  const secretKey = global.config.security.secretKey;
  const expiresIn = global.config.security.expiresIn;
  const token = jwt.sign(
    {
      uid,
      userType
    },
    secretKey,
    {
      expiresIn
    }
  );
  return token;
}

const stampToStr = function (stamp, accuracy = 'second') {
    if (!stamp) {
        return '-'
    }
    stamp = stamp.toString().padEnd(13, '000')
    stamp = parseInt(stamp)
    const d = new Date(stamp)
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const date = d.getDate().toString().padStart(2, '0')
    const hour = d.getHours().toString().padStart(2, '0')
    const minute = d.getMinutes().toString().padStart(2, '0')
    const second = d.getSeconds().toString().padStart(2, '0')
    let str
    if (accuracy === 'second') {
        str = `${year}-${month}-${date} ${hour}:${minute}:${second}`
    } else {
        str = `${year}-${month}-${date}`
    }
    return str
}

module.exports = {
    findMembers,
    generateToken,
    stampToStr
}

// const generateToken = function (uid, scope) {
//     const secretKey = global.config.security.secretKey
//     const expiresIn = global.config.security.expiresIn
//     const token = jwt.sign({
//         uid,
//         scope
//     }, secretKey, {
//         expiresIn: expiresIn
//     })
//     return token
// }
