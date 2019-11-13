module.exports= function(array) {
    let result = []
    for (let i = 0; i < array.length; i++) result[i] = array[i]
    for (let i = 0; i < result.length; i++) {
      let random = Math.floor(Math.random() * result.length)
      let value = result[i]
      result[i] = result[random]
      result[random] = value
    }
    return result
  }
