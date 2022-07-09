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
    description: waifu.extract,
    image: { url: waifu.imageUrl },
    author: {
      name: 'Appears In: ' + waifu.appearsIn.text,
      url: waifu.appearsIn.url
    }
  }

  const richData = {
    content: "**It's waifu time**",
    embeds: [embededPost]
  }

  await post(richData, url)

}

module.exports = { sendDiscordMessage }
