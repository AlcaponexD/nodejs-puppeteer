const puppeteer = require("puppeteer");
module.exports = {
  async gpu(req, res) {
    //Verifica paginacao
    var exist_pagination = true;
    var page_number = 1;
    var listagem = [];

    while (exist_pagination) {
      //Abre o navegador
      const browser = await puppeteer.launch({ headless : false });

      //Nova guia
      const page = await browser.newPage();

      //Bypass checking browser cloudflare
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en",
      });
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
      );

      await page.goto("https://www.kabum.com.br/hardware/placa-de-video-vga?page_number="+page_number+"&page_size=100");

      //await page.waitFor(10000);
      await page.screenshot({ path: "kabum.png" });

      const data = await page.evaluate((page_number) => {
        var list = [];
        const nodeList = document.querySelectorAll(".productCard");

        nodeList.forEach((node) => {
          //Take price
          try {
            var price = node
              .querySelector(".priceCard")
              .innerText.replace(/[^0-9]+/g, "");
          } catch {
            var price = null;
          }

          //Take product
          try {
            var produtct = node.querySelector(".nameCard").innerText;
          } catch {
            var produtct = null;
          }

          //Take link
          try {
            var link = node.querySelector(".sc-eLwHnm").href;
          } catch {
            var link = null;
          }

          //Take link
          try {
            var image_url = node.querySelector("img").src;
          } catch {
            var image_url = null;
          }

          if (price) {
            let obj = {
              price: price,
              produtct: produtct,
              image_url: image_url,
              link: link,
              source: "crawler",
              store: "kabum",
            };

            list.push(obj);
          }
        });

        return list;
      });

      //Pega dados da página
      await browser.close();
      console.log(data)
      if(data.length > 0){
        //Adiciona array no array
        listagem = [...data];
        //Adiciona mais paginacao
        page_number = (page_number+1)
      }else{
        //Para o while quando o data vem [] vazio
        exist_pagination = false;
      }
    }
    res.send(listagem)
  },
};
