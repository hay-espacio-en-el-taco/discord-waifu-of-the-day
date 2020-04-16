const fetch = require('node-fetch')

const sendDiscordMessage = waifu => {
  const url = process.env.WEB_HOOK_URL
  const data = {
    content: "Pancho yamete kudasai"
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