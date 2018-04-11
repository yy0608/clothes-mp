const substringText = str => { // 没有使用
  return str.length > 20 ? str.substring(0, 20) + '...' : str
}

module.exports = {
  substringText
}
