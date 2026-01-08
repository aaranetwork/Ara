const fs = require('fs')
const path = require('path')

const nextDir = path.join(process.cwd(), '.next')

function clearNextCache() {
  try {
    if (fs.existsSync(nextDir)) {
      fs.rmSync(nextDir, { recursive: true, force: true })
    }
  } catch (error) {
  }
}

clearNextCache()


