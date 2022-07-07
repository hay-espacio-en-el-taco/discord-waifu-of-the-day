const puppeteer = require('puppeteer'); // v13.0.0 or later

const getWaifu = async () => {
  const waifu = {
    name: '',
    imageUrl: '',
    bioUrl: '',
    extract: '',
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

  async function scrollIntoViewIfNeeded(element, timeout) {
    await waitForConnected(element, timeout);
    const isInViewport = await element.isIntersectingViewport({ threshold: 0 });
    if (isInViewport) {
      return;
    }
    await element.evaluate(element => {
      element.scrollIntoView({
        block: 'center',
        inline: 'center',
        behavior: 'auto',
      });
    });
    await waitForInViewport(element, timeout);
  }

  async function waitForConnected(element, timeout) {
    await waitForFunction(async () => {
      return await element.getProperty('isConnected');
    }, timeout);
  }

  async function waitForInViewport(element, timeout) {
    await waitForFunction(async () => {
      return await element.isIntersectingViewport({ threshold: 0 });
    }, timeout);
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

  async function waitForFunction(fn, timeout) {
    let isActive = true;
    setTimeout(() => {
      isActive = false;
    }, timeout);
    while (isActive) {
      const result = await fn();
      if (result) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error('Timed out');
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
    const element = await waitForSelectors([["aria/Display picture for Amira[role=\"img\"]"], ["#widget-waifu-of-the-day > div.w-full > a > img"]], targetPage, { timeout, visible: true });
    await scrollIntoViewIfNeeded(element, timeout);
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
  }

  await browser.close();

  return waifu;
  
};

module.exports = { getWaifu }
