[![Build Status](https://travis-ci.org/hay-espacio-en-el-taco/discord-waifu-of-the-day.svg?branch=master)](https://travis-ci.org/hay-espacio-en-el-taco/discord-waifu-of-the-day)

# discord-waifu-of-the-day

Little app for scrap https://mywaifulist.moe/dash and get the Waifu of the day section and publish in a discord text channel.

## How to run

1. Create a web hook in your discord server.

- Go in a channel properties (Alternatively, Server Settings, Webhooks works too)
- Click Webhooks
- Click Create Webhook
- Type in a name
- Copy the Webhook URL (you can use the Copy button)
- Click Save

2. Copy .env template and rename it as .env paste the webhook url here.
 * if you want to run in a CI or something like that set a env variable *WEB_HOOK_URL* with your Webhook URL as a value

3. run ```npm run dev```
