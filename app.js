const { getWaifu } = require('./utils/puppeteerScrapper')
const weebhook = require('./utils/webhook')

getWaifu()
  .then(waifu => weebhook.sendDiscordMessage(waifu))
  .then(() => process.exit())
