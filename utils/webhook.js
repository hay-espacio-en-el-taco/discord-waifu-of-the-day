'use strict'

const fetch = require('node-fetch')

const post = (data, url) => {
  return fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => console.info('Success:', response));
}

const sendDiscordMessage = async (waifu, url) => {
  const characterType = waifu.isHusbando ? 'husbando' : 'waifu'

  const embededPost = {
    title: waifu.name,
    description: waifu.description,
    type: 'rich',
    url: waifu.bioUrl,
    image: { url: waifu.imageUrl },
    fields: [
      {
        name: 'Appears in:',
        value: waifu.appearsIn,
      },
      {
        name: 'Rank:',
        value: waifu.popularity,
        inline: true
      },
      {
        name: 'Age:',
        value: waifu.age.trim() || 'N/A',
        inline: true
      },
    ],
  }

  console.info(embededPost);

  const richData = {
    content: `**It's ${characterType} time**`,
    embeds: [embededPost]
  }

  await post(richData, url)

  const capitalizedType = `${characterType.charAt(0).toUpperCase()}${characterType.slice(1)}`
  console.info(`${capitalizedType} of the day posted!`)
}

module.exports = { sendDiscordMessage }
