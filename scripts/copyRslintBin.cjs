const os = require("node:os")
const fs = require("node:fs")
const path = require("node:path")

const platformKey = `${process.platform}-${os.arch()}`
const nodeModulesPath = path.join(process.cwd(), './node_modules')

const platformBinPath = path.join(nodeModulesPath, `./@rslint/${platformKey}`)
const targetBinPath = path.join(process.cwd(), `./@rslint/${platformKey}`)

console.log(`Copying RSLint binary from ${platformBinPath} to ${targetBinPath}`)

if (!fs.existsSync(platformBinPath)) {
  console.error(`Platform binary path does not exist: ${platformBinPath}`)
  process.exit(1)
}
if (fs.existsSync(targetBinPath)) {
  console.log(`Target binary path already exists: ${targetBinPath}`)
  console.log("Removing existing target binary path...")
  fs.rmSync(targetBinPath, { recursive: true, force: true })
  console.log("Existing target binary path removed.")
}
console.log("Creating target binary path...")
fs.mkdirSync(targetBinPath, { recursive: true })
fs.readdirSync(platformBinPath).forEach(file => {
  const sourceFile = path.join(platformBinPath, file)
  const targetFile = path.join(targetBinPath, file)
  fs.copyFileSync(sourceFile, targetFile)
  console.log(`Copied ${file} to ${targetBinPath}`)
})
