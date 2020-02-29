const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
// const csvparser = require("csv-parser");
// const xlsx = require("xlsx");
const neatCsv = require("neat-csv");
const fs = require("fs");

var writedata = [];

fs.readFile("./Components_2020.csv", async (err, data) => {
  // const browser = await puppeteer.launch({ headless: true });
  // const page = await browser.newPage();

  const parsed = (await neatCsv(data)).map(item => item.part);

  for (let i = 0; i < parsed.length; i++) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const part = parsed[i];
    await page.goto(`https://www.digikey.com/products/en?keywords=${part}`, {
      waitUntil: "networkidle2"
    });
    await page.waitForSelector("a[class='secondary button']");
    await page.click("a[class='secondary button']");

    // const table = await page.$("table[id='productTable']");
    const html = await page.content();

    const $ = cheerio.load(html);

    let item =
      $("#lnkPart tr, .tr-description")
        .eq(1)
        .text()
        .trim() ||
      $("td[itemprop='description']")
        .text()
        .trim() ||
      $(".exactPart tr td:nth-child(2) span")
        .eq(2)
        .text()
        .trim();

    writedata.push({
      part: part,
      description: item
    });

    console.log(
      part,
      item
      // $("#lnkPart tr, .tr-description")
      //   .eq(1)
      //   .text()
      //   .trim()
    );

    browser.close();
  }

  fs.writeFileSync("./partdata.json", JSON.stringify(writedata));

  // parsed.map(async part => {
  //   const browser = await puppeteer.launch({ headless: true });
  //   const page = await browser.newPage();
  //   await page.goto(`https://www.digikey.com/products/en?keywords=${part}`);

  //   await page.waitForSelector("a[class='secondary button']");
  //   await page.click("a[class='secondary button']");
  //   // const table = await page.$("table[id='productTable']");
  //   const html = await page.content();

  //   const $ = cheerio.load(html);

  //   console.log(
  //     $("#lnkPart tr, .tr-description")
  //       .eq(1)
  //       .text()
  //       .trim()
  //   );

  //   browser.close();
  // });
});

// (async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto(
//     "https://www.digikey.com/products/en?keywords=MMZ1608B471CTAH0"
//   );

//   await page.waitForSelector("a[class='secondary button']");
//   await page.click("a[class='secondary button']");
//   // const table = await page.$("table[id='productTable']");
//   const html = await page.content();

//   const $ = cheerio.load(html);

//   console.log(
//     $("#lnkPart tr, .tr-description")
//       .eq(1)
//       .text()
//       .trim()
//   );
// })();
