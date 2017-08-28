
let args = process.argv.slice(2);

//Force the URL to https
url = args[0];

const puppeteer = require('puppeteer');

let results = [];

puppeteer.launch({headless: true}).then(async browser => {
    let page = await browser.newPage();

    //Listen to all requests
    page.on('request', (request) => {
        //And catch those that are not https
        if (request.url.startsWith('http://') && request.url !== url) {
        let error = {
            'type': 'insecure_request',
            'value': request.url
        };
        results.push(error);
    }
});

    //Try to load the url
    try {
        await page.goto(url);
    } catch (e) {
        //An exception was thrown, likely due to an invalid cert
        let error = {
            'type': 'exception_opening_page',
            'value': e.message
        };
        results.push(error);
        browser.close();
        console.log(JSON.stringify(results));

        //fail early
        return;
    }

    if (!page.url().startsWith('https://')) {
        //That page didn't auto-redirect to https, reset the results to clear errors from the http request
        results = [];
        let error = {
            'type': 'not_https_by_default',
            'value': page.url()
        };
        results.push(error);

        //Now try to reload the page as https
        try {
            await page.goto(url.replace(/^http:\/\//i, 'https://'));
        } catch (e) {
            //An exception was thrown, likely due to an invalid cert
            let error = {
                'type': 'exception_opening_page',
                'value': e.message
            };
            results.push(error);
            browser.close();
            console.log(JSON.stringify(results));

            //fail early
            return;
        }
    }

    //Let the page run for a bit
    await page.waitFor(2500);

    //Now close and print any errors
    browser.close();
    console.log(JSON.stringify(results));
});


