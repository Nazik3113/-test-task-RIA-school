const { Transform } = require('stream')

class transform extends Transform {
  constructor(options = { objectMode: true }) {
    super(options)
  }

  _transform(chunk, encoding, done) {
    const groups = new Map()

    const splitedArr = chunk.toString().split('\n')
    splitedArr.forEach((arr, index) => {
      splitedArr[index] = arr.split(':')
    })

    splitedArr.forEach(array => {
      const arr = array.slice(0, -1).reverse()
      if (arr.length === 1) {
        groups.set(arr.shift().trim(), {message: `${array[0]}: ${array[array.length - 1].trim()}`, comments: new Map()})
      } else {
        (function setComment(map, space) {
          if (arr.length === 1) {
            map.set(arr.shift().trim(), {message: `${space}|-${array[0]}: ${array[array.length - 1].trim()}`, comments: new Map()})
          } else {
            setComment(map.get(arr.shift()).comments, ' '.repeat((array.length - 1) * 2 - 2))
          }
        })(groups.get(arr.shift()).comments, '  ')
      }
    })

    let string = ''

    function setString(map) {
      for (var [key, value] of map) {
        if (map.get(key).comments.size === 0) {
          string += `${map.get(key).message}\n`
        } else {
          string += `${map.get(key).message}\n`
          setString(map.get(key).comments)
        }
      } 
    }
    setString(groups)

    
    this.push(string)
    done()
  }
}

module.exports = transform
