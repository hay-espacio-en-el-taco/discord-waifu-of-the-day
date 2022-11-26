const { getWaifu } = require('./utils/puppeteerScrapper')
const weebhook = require('./utils/webhook')

async function main() {
  const waifuObj = await getWaifu()
  await weebhook.sendDiscordMessage(waifuObj)
}

main()
