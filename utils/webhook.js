const fetch = require('node-fetch')

const sendDiscordMessage = waifu => {
  const url = process.env.WEB_HOOK_URL

  const embededPost = {
    title: waifu.name,
    type: 'rich',
    url: waifu.bioUrl,
    description: waifu.extract,
  }

  const richData = {
    content: "It's waifu time",
    embeds: [embededPost]
  }

  post(richData, url)

  const simpleData = {
    content: waifu.bioUrl,
  }

  setTimeout(post(simpleData, url), 2000)
  
  const remData = {
    content: "/rem",
  }

  setTimeout(post(remData, url), 4000)
}

const post = (data, url) => {
  fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => console.info('Success:', response));
}

module.exports = { sendDiscordMessage }
