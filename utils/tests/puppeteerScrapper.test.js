'use strict'

const { getWOTDUrl, intializeScrapper, getWaifuDataFromPage } = require('../puppeteerScrapper')

/**
 * Constants
 */
const URL_REGEXP = /^(http|https):\/\/[^ "]+$/
const WAIFU_URL = "https://mywaifulist.moe/waifu/emilia-re-zero-starting-life-in-another-world"
const HUSBANDO_URL = "https://mywaifulist.moe/waifu/shigeo-kageyama-mob-psycho-100"

/**
 * Comparison objects for tests
 */
const WAIFU_OBJ1 = {
    "age": "none",
    "appearsIn": "Re:ZERO -Starting Life in Another World-",
    "bioUrl": "https://mywaifulist.moe/waifu/emilia-re-zero-starting-life-in-another-world",
    "description": "Emilia is the main heroine of the Re:Zero kara Hajimeru Isekai Seikatsu series. She is a Half Elf and a candidate to become the 42nd King of the Dragon Kingdom of Lugnica in the Royal Selection. Officially debuting at the very start of the series, Emilia is arguably the most important character i...",
    "imageUrl": "https://thicc.mywaifulist.moe/waifus/54/b8557e17db9f8527fbc31d243c6ff72285ef8abe7c0a06b59281a51b45bba370_thumb.jpeg",
    "isHusbando": false,
    "name": "Emilia",
    "popularity": "6",
}
const HUSBANDO_OBJ1 = {
    "age": "none",
    "appearsIn": "Mob Psycho 100",
    "bioUrl": "https://mywaifulist.moe/waifu/shigeo-kageyama-mob-psycho-100",
    "description": "Shigeo Kageyama, nicknamed \"Mob\" and \"White T-Poison\", is the main protagonist of the Mob Psycho 100 series, as well as assistant and disciple of Arataka Reigen. He is the newest member of the Body Improvement Club.",
    "imageUrl": "https://thicc.mywaifulist.moe/waifus/2757/291eb47cc0f02e379286503bf1bb29bcef8e581a8664b474e7feebcbf039024c_thumb.png",
    "isHusbando": true,
    "name": "Shigeo Kageyama",
    "popularity": "1723",
}

describe('utils/puppeteerScrapper.js', () => {
    let puppeteerPage, puppeteerBrowser
    beforeAll(async () => {
        const [browser, page] = await intializeScrapper()
        puppeteerBrowser = browser
        puppeteerPage = page
    })

    afterAll(async () => {
        await puppeteerBrowser.close()
    })

    describe('getWOTDUrl', () => {
        test('Must return a valid URL string', async () => {
            const result = await getWOTDUrl(puppeteerPage)
            expect(result).toEqual(expect.stringMatching(URL_REGEXP))
        })
    })

    describe('getWaifuDataFromPage', () => {
        test('Gets waifu object correctly', async () => {
            const waifuObj = await getWaifuDataFromPage(puppeteerPage, WAIFU_URL)
            expect(waifuObj).toEqual(WAIFU_OBJ1)
        })

        test('Gets husbando object correctly', async () => {
            const husbando = await getWaifuDataFromPage(puppeteerPage, HUSBANDO_URL)
            expect(husbando).toEqual(HUSBANDO_OBJ1)
        })
    })
})
