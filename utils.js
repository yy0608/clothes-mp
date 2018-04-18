const substringText = str => { // 没有使用
  return str.length > 20 ? str.substring(0, 20) + '...' : str
}

const generateGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const filterEmptyValue = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && (obj[key] == null || obj[key] == undefined || obj[key] == '')) {
      delete obj[key];
    }
  }
  return obj
}

module.exports = {
  substringText,
  generateGuid,
  filterEmptyValue
}
