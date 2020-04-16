const fetch = require('node-fetch')

const sendDiscordMessage = waifu => {
  const url = process.env.WEB_HOOK_URL

  const embededPost = {
    title: waifu.name,
    type: 'rich',
    url: waifu.bioUrl,
    description: waifu.extract,
  }

  const data = {
    content: "It's waifu time",
    embeds: [embededPost]
  }

  fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => console.log('Success:', response));
}

module.exports = { sendDiscordMessage }