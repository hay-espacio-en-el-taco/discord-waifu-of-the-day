const puppeteer = require('puppeteer'); // v13.0.0 or later

const nameSelector = 'h1';
const imageSelector = '#widget-waifu-of-the-day > a > img';
const popularitySelector = '#popularity-rank';
const ageSelector = '#age';
const husbandoSelector = '#waifu-classification';
const appearsSelector = '#waifu-core-information > div > div > a';

const waifuURL = "https://mywaifulist.moe/"
const randomUrl = "https://mywaifulist.moe/random"

const getWaifu = async (retry = false) => {
  const [browser, page] = await intializeScrapper()
  await page.setViewport({ "width": 1920, "height": 1080 })

  const url = retry ? randomUrl : waifuURL
  console.info(`Navigating to: ${url}`)
  await page.goto(url, {waitUntil: "networkidle2"});

  if (!retry) {
    console.info("Looking for WOTD section...");
    const section = await page.waitForSelector(imageSelector)

    console.info("Loading waifu info");
    await section.click()
    await page.waitForNavigation({waitUntil: "networkidle2"})
  }

  console.info("Detecting Husbandos...");
  const isHusbando = await page.$(husbandoSelector)

  if (isHusbando) {
    console.info("Husbando detected, retry a random waifu...")
    await browser.close();
    return await getWaifu(true)
  }

  console.info("Husbandos not detected, collecting waifu data")

  const bioUrl = page.url()
  console.info("URL: OK...")

  const nameElement = await page.$(nameSelector)
  const name = await page.evaluate(el => el.textContent, nameElement)
  console.info("Name: OK...")

  const imgElement = await page.$(`[alt="${name.trim()}"]`)
  const imageUrl = await page.evaluate(el => el.src, imgElement)
  console.info("Image: OK...")

  const whereElement = await page.$(appearsSelector)
  const source = await page.evaluate(el => el.textContent, whereElement)
  console.info("Source: OK...")

  const popElement = await page.$(popularitySelector)
  const popularity = await page.evaluate(el => el.textContent.split('#')[1], popElement)
  console.info("Popularity: OK...")

  const ageElement = await page.$(ageSelector)
  const age = await page.evaluate(el => el.textContent, ageElement)
  console.info("Age: OK...")

  console.info("Scrapping complete, closing the browser...");
  await browser.close();

  return {
    name,
    imageUrl,
    bioUrl,
    source,
    popularity,
    age
  }
};

const intializeScrapper = async () => {
  console.info("Intializing Scrapper...")
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36");
  const timeout = 5000;
  page.setDefaultTimeout(timeout);

  console.info("Scrapper Initialized Successfully!")
  return [browser, page];
}

module.exports = { getWaifu }
