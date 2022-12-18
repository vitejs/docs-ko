const fs = require('fs')
const matter = require('gray-matter')

module.exports = {
  open(filePath) {
    this.filePath = filePath
    this.file = fs.readFileSync(filePath)
    this.matter = matter(this.file.toString())

    return this
  },

  set(key, value) {
    this.matter.data[key] = value
    return this
  },

  save() {
    const matterStringifyData = this.matter.stringify()

    fs.writeFile(this.filePath, matterStringifyData, (err) => {
      if (err) {
        console.warn(`${this.filePath} - Saving file with matter failed`)
      }
    })
  },
}
