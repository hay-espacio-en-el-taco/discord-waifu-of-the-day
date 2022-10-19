const puppeteer = require('puppeteer'); // v13.0.0 or later

const getWaifu = async () => {
  const waifu = {
    name: '',
    imageUrl: '',
    bioUrl: '',
    extract: '',
    appearsIn: '',
  }


  const hrefSelector = '#widget-waifu-of-the-day > a';
  const nameSelector = '#widget-waifu-of-the-day .text-zinc-100';
  const imageSelector = '#widget-waifu-of-the-day > a > img';
  const descriptionSelector = '#description';
  const appearsSelector = '#waifu-core-information > div > div > a';

  const browser = await puppeteer.launch();
  console.info("Opening Browser")
  const page = await browser.newPage();
  page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36");
  const timeout = 5000;
  page.setDefaultTimeout(timeout);

  async function waitForSelectors(selectors, frame, options) {
    for (const selector of selectors) {
      try {
        return await waitForSelector(selector, frame, options);
      } catch (err) {
        console.error(err);
      }
    }
    throw new Error('Could not find element for selectors: ' + JSON.stringify(selectors));
  }

  async function waitForSelector(selector, frame, options) {
    if (!Array.isArray(selector)) {
      selector = [selector];
    }
    if (!selector.length) {
      throw new Error('Empty selector provided to waitForSelector');
    }
    let element = null;
    for (let i = 0; i < selector.length; i++) {
      const part = selector[i];
      if (element) {
        element = await element.waitForSelector(part, options);
      } else {
        element = await frame.waitForSelector(part, options);
      }
      if (!element) {
        throw new Error('Could not find element: ' + selector.join('>>'));
      }
      if (i < selector.length - 1) {
        element = (await element.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
      }
    }
    if (!element) {
      throw new Error('Could not find element: ' + selector.join('|'));
    }
    return element;
  }
  {
    const targetPage = page;
    await targetPage.setViewport({ "width": 1920, "height": 1080 })
  }
  {
    const targetPage = page;
    const promises = [];
    promises.push(targetPage.waitForNavigation());
    console.info("Navigating to https://mywaifulist.moe/");
    await targetPage.goto("https://mywaifulist.moe/");
    console.info("Waiting the href");
    await waitForSelectors([[hrefSelector]], targetPage, { timeout, visible: true });
    console.info("Getting the href");
    const [href] = await targetPage.$$eval(hrefSelector, elements => {
      return elements.map(elem => {
        return elem.getAttribute('href');
      })
    });

    console.info("Waiting name of the waifu");
    await waitForSelectors([[nameSelector]], targetPage, { timeout, visible: true });
    console.info("Getting name of the waifu");
    const [name] = await targetPage.$$eval(nameSelector, elements => {
      return elements.map(elem => {
        return elem.textContent;
      })
    });

    console.info("Waiting image of the waifu");
    await waitForSelectors(["#widget-waifu-of-the-day > a > img"], targetPage, { timeout, visible: true });
    console.info("Getting image of the waifu");
    const [image] = await targetPage.$$eval("#widget-waifu-of-the-day > a > img", elements => {
      return elements.map(elem => {
        return elem.getAttribute('src');
      })
    });

    waifu.name = name;
    waifu.bioUrl = `https://mywaifulist.moe${href}`;
    waifu.imageUrl = image;
    await Promise.all(promises);
  }
  {
    const targetPage = page;
    console.info("Waiting the image to be ready");
    const element = await waitForSelectors([[imageSelector]], targetPage, { timeout, visible: true });
    console.info("Clicking the image");
    await element.click({
      offset: {
        x: 200,
        y: 209,
      },
    });

    console.info("Waiting the Description to be ready");
    await waitForSelectors([[descriptionSelector]], targetPage, { timeout, visible: true });
    console.info("Getting Description of the waifu");
    const [extract] = await targetPage.$$eval(descriptionSelector, elements => {
      return elements.map(elem => {
        return elem.textContent;
      })
    });
    waifu.extract = extract;

    console.info("Waiting the anime where the waifu appears to be ready");
    await waitForSelectors([[appearsSelector]], targetPage, { timeout, visible: true });
    console.info("Getting the anime where the waifu appears");
    const [appearsIn] = await targetPage.$$eval(appearsSelector, elements => {
      return elements.map(elem => {
        return {
          url: `https://mywaifulist.moe${elem.getAttribute('href')}`,
          text: elem.textContent
        };
      })
    });

    waifu.appearsIn = appearsIn;

  }

  console.info("Closing the browser");
  await browser.close();

  return waifu;

};

module.exports = { getWaifu }
