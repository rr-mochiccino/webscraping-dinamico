import puppeteer from "puppeteer";
const url = "https://www.mercadolivre.com.br/";

const searchFor = "macbook";
const list = [];

(async()=> {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
console.log("iniciei");
    await page.goto(url);
console.log("fui pra url");

    await page.waitForSelector('#cb1-edit');
    await page.type('#cb1-edit', searchFor);
    
    await Promise.all([
        page.waitForNavigation(),      
        page.click('.nav-search-btn'),
    ]) 
    
   const links =  await page.$$eval('.ui-search-result__image > a', i => i.map(link => link.href));
   
   let j =1; 
   for (const link of links){
    if (j=== 10) continue;
    console.log("Página", j);
    await page.goto(link);
    await page.waitForSelector('.ui-pdp-title');

    const title =  await page.$eval('.ui-pdp-title', element => element.innerText);
    const price =  await page.$eval('.andes-money-amount__fraction', element => element.innerText);

    const seller = await page.evaluate(()=> {
        const elem = document.querySelector('.ui-pdp-seller__link-trigger');
        if (!elem) return null;
        return elem.innerText;
    })


    const obj = {};
    obj.title = title;
    obj.price = price;
    (seller ? obj.seller = seller : '');
    obj.link = link;
    
    list.push(obj);

   j++;
   }
    console.log(list);

    await page.waitForTimeout(3000);
    await browser.close();
})();
