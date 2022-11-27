'use strict'

const { getWaifu } = require('./utils/puppeteerScrapper')
const weebhook = require('./utils/webhook')
const url = process.env.WEB_HOOK_URL

async function main() {
  const waifuObj = await getWaifu()
  await weebhook.sendDiscordMessage(waifuObj, url)
}

main()
