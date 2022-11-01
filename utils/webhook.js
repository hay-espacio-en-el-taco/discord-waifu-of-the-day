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

const sendDiscordMessage = async waifu => {
  const url = process.env.WEB_HOOK_URL

  const embededPost = {
    title: waifu.name,
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
        value: waifu.age,
        inline: true
      },
    ],
  }

  console.info(embededPost);

  const richData = {
    content: "**It's waifu time**",
    embeds: [embededPost]
  }

  await post(richData, url)

  console.info('Waifu of the day posted!')
}

module.exports = { sendDiscordMessage }
