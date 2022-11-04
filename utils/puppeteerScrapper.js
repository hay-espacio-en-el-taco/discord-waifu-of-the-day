const puppeteer = require('puppeteer'); // v13.0.0 or later

const nameSelector = 'h1';
const imageSelector = '#widget-waifu-of-the-day > a > img';
const popularitySelector = '#popularity-rank';
const ageSelector = '#age';
const appearsSelector = '#waifu-core-information > div > div > a';

const waifuURL = "https://mywaifulist.moe/"

const defaultTimeout = 5000;

const intializeScrapper = async () => {
  console.info("Intializing Scrapper...")
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36");
  
  page.setDefaultTimeout(defaultTimeout);

  console.info("Scrapper Initialized Successfully!")
  return [browser, page];
}

const getWaifu = async () => {
  const [browser, page] = await intializeScrapper()
  await page.setViewport({ "width": 1920, "height": 1080 })

  console.info(`Navigating to: ${waifuURL}`)
  await page.goto(waifuURL, {waitUntil: "networkidle2"});

  console.info("Looking for WOTD section...");
  const section = await page.waitForSelector(imageSelector)

  console.info("Loading waifu info");
  await section.click()
  await page.waitForNavigation({waitUntil: "networkidle2"})

  console.info("Collecting waifu data")

  const bioUrl = page.url()
  console.info("URL: OK...")

  const nameElement = await page.$(nameSelector)
  const name = await page.evaluate(el => el.textContent, nameElement)
  console.info("Name: OK...")

  const imgElement = await page.$(`[alt="${name.trim()}"]`)
  const imageUrl = await page.evaluate(el => el.src, imgElement)
  console.info("Image: OK...")

  const appearsInElement = await page.$(appearsSelector)
  const appearsIn = await page.evaluate(el => el.textContent, appearsInElement)
  console.info("Source: OK...")

  const popularityElement = await page.$(popularitySelector)
  const popularity = await page.evaluate(el => el.textContent.split('#')[1], popularityElement)
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
    appearsIn,
    popularity,
    age
  }
};

module.exports = { getWaifu }
