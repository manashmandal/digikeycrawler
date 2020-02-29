// https://www.digikey.com/products/en?keywords=112705
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // const promise = page.waitForNavigation({ waitUntil: "networkidle" });
  await page.goto(`https://www.digikey.com/products/en?keywords=112705`);
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await page.waitForSelector("a[class='secondary button']");
  await page.click("a[class='secondary button']");
  // const table = await page.$("table[id='productTable']");
  const html = await page.content();

  const $ = cheerio.load(html);

  console.log(
    $(".exactPart tr td:nth-child(2) span")
      .eq(2)
      .text()
      .trim()
  );
  // let item =
  //   $("#lnkPart tr, .tr-description")
  //     .eq(1)
  //     .text()
  //     .trim() ||
  //   $("td[itemprop='description']")
  //     .text()
  //     .trim();
})();
