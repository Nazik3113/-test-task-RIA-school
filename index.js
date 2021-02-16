const transform = require('./transformStream')
const fs = require('fs')

const transformStream = new transform()
const readableStream = fs.createReadStream('./input.txt')
const writableStream = fs.createWriteStream('./output.txt')

readableStream.pipe(transformStream).pipe(writableStream)
