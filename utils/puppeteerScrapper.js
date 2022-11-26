'use strict'

const puppeteer = require('puppeteer') // v13.0.0 or later

/**
 * Selectors
 */
const nameSelector = 'h1'
const typeOfCharacterSelector = 'h1 #waifu-classification'
const imageWOTDLinkSelector = '#widget-waifu-of-the-day > a'
const popularitySelector = '#popularity-rank'
const ageSelector = '#age'
const appearsSelector = '#waifu-core-information > div > div > a'
const descriptionSelector = '#description'

/**
 * Constants
 */
const MAX_DESCRIPTION_LIMIT = 300
const HUSBANDO = 'husbando'
const MY_WAIFU_LIST_URL = "https://mywaifulist.moe/"
const DEFAULT_TIMEOUT = 5000

const getValidStringOrThrowError = (str, fieldName) => {
  if (typeof str !== 'string') {
    throw new Error(`The "${fieldName}" value is not a string, got "${str}" instead.`)
  }

  str = str.trim()
  if (str.length === 0) {
    throw new Error(`The "${fieldName}" value is an empty string.`)
  }

  return str
}

const getValidStringOrNone = (str) => {
  if (typeof str !== 'string') {
    return "none"
  }

  str = str.trim()
  if (str.length === 0) {
    return "none"
  }

  return str
}

const getNameAndExtractHusbando = (characterName, type) => {
  type = ( String(type) ).trim()
  const name = characterName.replace(type, '')

  return [ name.trim(), type.toLowerCase().includes(HUSBANDO) ]
}

const getOnlyFirstParagraph = (description) => {
  const result = description.split('\n')

  if (!result.length) {
    return null
  }
  const firstParagraph = result[0];

  return firstParagraph.length > MAX_DESCRIPTION_LIMIT ? `${firstParagraph.substring(0, MAX_DESCRIPTION_LIMIT - 3)}...` : firstParagraph
}

const intializeScrapper = async () => {
  console.info("Intializing Scrapper...")

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  page.setUserAgent("Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36")
  page.setDefaultTimeout(DEFAULT_TIMEOUT)
  await page.setViewport({ "width": 1920, "height": 1080 })

  console.info("Scrapper Initialized Successfully!")
  return [browser, page]
}

const getWOTDUrl = async (page) => {
  console.info(`Navigating to: ${MY_WAIFU_LIST_URL}`)
  await page.goto(MY_WAIFU_LIST_URL, {waitUntil: "networkidle2"})

  console.info("Looking for WOTD section...")
  const sectionWOTD = await page.waitForSelector(imageWOTDLinkSelector)
  const hrefWOTD = await sectionWOTD.evaluate(el => el.getAttribute("href"))

  return (new URL(hrefWOTD, MY_WAIFU_LIST_URL)).href
}

const getWaifuDataFromPage = async (page, waifuUrl) => {
  console.info(`Navigating to waifu details page: ${waifuUrl}`)
  await page.goto(waifuUrl, {waitUntil: "networkidle2"})

  console.info("Waifu details page loaded, now collecting waifu data...")

  let bioUrl = page.url()
  bioUrl = getValidStringOrThrowError(bioUrl, 'bioUrl')
  console.info(`URL: "${bioUrl}". OK!`)

  const typeOfCharacterElement = await page.$(typeOfCharacterSelector)
  let typeOfCharacter = null
  if (typeOfCharacterElement) {
    typeOfCharacter = await typeOfCharacterElement.evaluate(el => el.textContent)
  }
  console.info(`Character tag: "${typeOfCharacter}". OK!`)

  const nameElement = await page.$(nameSelector)
  let characterName = await nameElement.evaluate(el => el.textContent)
  characterName = getValidStringOrThrowError(characterName, 'characterName')
  const [name, isHusbando] = getNameAndExtractHusbando(characterName, typeOfCharacter)
  console.info(`Name: "${name}". OK!`)

  const imgElement = await page.$(`[alt="${name.trim()}"]`)
  let imageUrl = await imgElement.evaluate(el => el.src)
  imageUrl = getValidStringOrThrowError(imageUrl, 'imageUrl')
  console.info(`Image: ${imageUrl}. OK!`)

  const descriptionElement = await page.$(descriptionSelector)
  let description = await descriptionElement.evaluate(el => el.textContent)
  description = getValidStringOrThrowError(description, 'description')
  description = getOnlyFirstParagraph(description)
  console.info(`Description: ${description.length} chars length. OK!`)

  const appearsInElement = await page.$(appearsSelector)
  let appearsIn = await appearsInElement.evaluate(el => el.textContent)
  appearsIn = getValidStringOrThrowError(appearsIn, 'appearsIn')
  console.info(`Source: ${appearsIn}. OK!`)

  const popularityElement = await page.$(popularitySelector)
  let popularity = await popularityElement.evaluate(el => el.textContent.split('#')[1])
  popularity = getValidStringOrThrowError(popularity, 'popularity')
  console.info(`Popularity: ${popularity}. OK!`)

  const ageElement = await page.$(ageSelector)
  let age = await page.evaluate(el => el.textContent, ageElement)
  age = getValidStringOrNone(age)
  console.info(`Age: ${age}. OK!`)

  console.info("Scrapping successful...")
  return {
    name,
    description,
    imageUrl,
    isHusbando,
    bioUrl,
    appearsIn,
    popularity,
    age
  }
}

const getWaifu = async () => {
  const [browser, page] = await intializeScrapper()
  let waifuObj, error

  try {
    const waifuUrl = await getWOTDUrl(page)
    waifuObj = await getWaifuDataFromPage(page, waifuUrl)
  } catch (err) {
    error = err
  } finally {
    console.info("Closing the browser...")
    await browser.close()
  }

  if (error) {
    throw error
  }

  return waifuObj
}

module.exports = {
  intializeScrapper,
  getWOTDUrl,
  getWaifuDataFromPage,
  getWaifu,
}
