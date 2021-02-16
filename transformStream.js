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

    let indexArr = 0

    splitedArr.forEach((arr) => {
      if (arr.length === 1) {
        indexArr = 0
      } else {
        if (indexArr === 0) {
          groups.set(arr[0].trim(), `${arr[0]}: ${arr[1].trim()} \n`)
          indexArr++
        } else {
          let count = 0

          for (let i = 0; i < arr.length; i++) {
            if (arr.length === 2) {
              groups.set(arr[0].trim(), `${arr[0]}: ${arr[1].trim()} \n`)
            }
            if (arr.length > 2 && indexArr !== 0 && count === 0) {
              groups.set(
                arr[arr.length - 2],
                `${groups.get(arr[arr.length - 2])}${' '.repeat(
                  (arr.length - 1) * 2 - 2
                )}|- ${arr[0].trim()}: ${arr[arr.length - 1].trim()} \n`
              )
              count++
            }
            if (i === arr.length - 1) {
              count = 0
            }
          }
        }
      }
    })

    let string = ''
    for (var value of groups.values()) {
      string += value
    }
    console.log(groups);

    this.push(string)
    done()
  }
}

module.exports = transform
