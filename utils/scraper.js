const cheerio = require('cheerio')
const fetch = require('node-fetch')
const url = 'https://mywaifulist.moe/dash'

const waifu = {
  name: '',
  imageUrl: '',
  bioUrl: '',
  extract: '',
}

const getWaifu = async () => {
  return fetch(url)
    .then( res => res.text() )
    .then( body =>  cheerio.load(body) )
    .then ( $ => {
      const bio = $('#widget-waifu-of-the-day').find('.w-full').children().attr().href
      const image = null;
    
      waifu.imageUrl = image
      waifu.bioUrl = `https://mywaifulist.moe${bio}`
    
      return waifu;
    } )
}


module.exports = { getWaifu }