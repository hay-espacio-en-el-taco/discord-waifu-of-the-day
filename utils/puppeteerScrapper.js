const puppeteer = require('puppeteer'); // v13.0.0 or later

const getWaifu = async () => {
  const waifu = {
    name: '',
    imageUrl: '',
    bioUrl: '',
    extract: '',
    appearsIn: '',
  }
  const browser = await puppeteer.launch();
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
    await targetPage.setViewport({ "width": 1149, "height": 929 })
  }
  {
    const targetPage = page;
    const promises = [];
    promises.push(targetPage.waitForNavigation());
    await targetPage.goto("https://mywaifulist.moe/");
    const [href] = await targetPage.$$eval('#widget-waifu-of-the-day > div.w-full > a', elements => {
      return elements.map(elem => {
        return elem.getAttribute('href');
      })
    });

    const [name] = await targetPage.$$eval('#widget-waifu-of-the-day .no-underline', elements => {
      return elements.map(elem => {
        return elem.textContent;
      })
    });

    const [image] = await targetPage.$$eval('#widget-waifu-of-the-day > div.w-full > a > img', elements => {
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
    const element = await waitForSelectors([["#widget-waifu-of-the-day > div.w-full > a > img"]], targetPage, { timeout, visible: true });
    await element.click({
      offset: {
        x: 127,
        y: 150,
      },
    });

    await waitForSelectors([["#description"]], targetPage, { timeout, visible: true });
    const [extract] = await targetPage.$$eval('#description', elements => {
      return elements.map(elem => {
        return elem.textContent;
      })
    });
    waifu.extract = extract;

    await waitForSelectors([["#waifu-core-information a"]], targetPage, { timeout, visible: true });
    const [appearsIn] = await targetPage.$$eval('#waifu-core-information a', elements => {
      return elements.map(elem => {
        return {
          url: 'https://mywaifulist.moe' + elem.getAttribute('href'),
          text: elem.textContent
        };
      })
    });

    waifu.appearsIn = appearsIn;

  }

  await browser.close();

  return waifu;

};

module.exports = { getWaifu }
