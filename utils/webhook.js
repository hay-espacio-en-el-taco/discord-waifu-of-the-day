const sendDiscordMessage = waifu => {
  const id = process.env.WEB_HOOK_ID
  const token = process.env.WEB_HOOK_TOKEN

  console.log(id)
  console.log(token)
  // const webhookClient = new Discord.WebhookClient(id, token);

  // const embed = new Discord.MessageEmbed()
  //   .setTitle('Some Title')
  //   .setColor('#0099ff')
  //   .setImage('https://i.imgur.com/wSTFkRM.png')
  //   .setURL(waifu.bioUrl)

  // webhookClient.send('Webhook test', {
  //   embeds: [embed],
  // })
}

module.exports = { sendDiscordMessage }