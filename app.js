const scraper = require('./utils/scraper')
const weebhook = require('./utils/webhook')

scraper.getWaifu().then(waifu => {
  console.log(waifu)
  weebhook.sendDiscordMessage(waifu)
})