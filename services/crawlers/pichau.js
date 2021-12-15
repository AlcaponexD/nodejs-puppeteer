const puppeteer = require("puppeteer");
module.exports = {
  async gpu(req, res) {
    //Verifica paginacao
    var exist_pagination = true;
    var page_number = 1;
    var listagem = [];

    while (exist_pagination) {
      //Abre o navegador
      const browser = await puppeteer.launch();

      //Nova guia
      const page = await browser.newPage();

      //Bypass checking browser cloudflare
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en",
      });
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
      );

      await page.goto(
        "https://www.pichau.com.br/hardware/placa-de-video?page=" + page_number
      );

      await page.waitForSelector('.MuiGrid-item');

      const data = await page.evaluate(() => {
        var list = [];
        const nodeList = document.querySelectorAll(".MuiGrid-item");

        nodeList.forEach((node) => {
          //Take price
          try {
            var p = node.querySelector(
              "a> div .MuiCardContent-root > div > div > div > div"
            ).innerText;
            console.log(p);
            if (p.indexOf("por") > -1) {
              var error = true;
            }

            price = p.replace(/[^0-9]+/g, "");
          } catch {
            var price = null;
          }

          //Take product
          try {
            var produtct = node.querySelector(".MuiTypography-h6").innerText;
          } catch {
            var produtct = null;
          }

          //Take link
          try {
            var link = node.querySelector('[data-cy="list-product"]').href;
          } catch {
            var link = null;
          }

          //Take link
          try {
            var image_url = node.querySelector(".jss55").src;
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
              store: "pichau",
              active: 'yes',
              published : 'yes',
              review : 'no'
            };
            //Verfifica se algum precisa de review
            if(!produtct || !link || error){
              obj.published = 'no';
              obj.review = 'yes';
            }

            list.push(obj);
          }
        });

        return list;
      });

      //Pega dados da página
      //await browser.close();
      console.log(data);
      if (data.length > 0) {
        //Adiciona array no array
        for (var i in data) {
          listagem.push(data[i]);
        }
        //Adiciona mais paginacao
        page_number = page_number + 1;
      } else {
        //Para o while quando o data vem [] vazio
        exist_pagination = false;
      }
    }
    res.send(listagem);
  },
};
