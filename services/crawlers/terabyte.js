const puppeteer = require("puppeteer");
module.exports = {
async gpu(req, res) {
  //Abre o navegador
  const browser = await puppeteer.launch({ headless: false });

  //Nova guia
  const page = await browser.newPage();

  //Bypass checking browser cloudflare
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en",
  });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
  );

  await page.goto("https://www.terabyteshop.com.br/hardware/placas-de-video");

  //await page.waitFor(10000);
  await page.screenshot({ path: "terabyte.png" });

  const data = await page.evaluate(() => {
    var list = [];
    const nodeList = document.querySelectorAll(".pbox");

    nodeList.forEach((node) => {
      //Take price
      try {
        var price = node
          .querySelector(".prod-new-price>span")
          .innerText.replace(/[^0-9]+/g, "");
      } catch {
        var price = null;
      }

      //Take product
      try {
        var produtct = node.querySelector(".prod-name").title;
      } catch {
        var produtct = null;
      }

      //Take link
      try {
        var link = node.querySelector(".prod-name").href;
      } catch {
        var link = null;
      }

      //Take link
      try {
        var image_url = node.querySelector('img').src;
      } catch {
        var image_url = null;
      }

      if(price){
        let obj = {
          price: price,
          produtct: produtct,
          image_url: image_url,
          link: link,
          source: "crawler",
          store: "terabyte",
        };

        list.push(obj);
      }
    });

    return list;
  });

  //Pega dados da página
  //await browser.close();

  res.send(data);
},
};
