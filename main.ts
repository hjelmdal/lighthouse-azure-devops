import * as fs from 'fs';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse/lighthouse-core';
import ReportGenerator from 'lighthouse/lighthouse-core/report/report-generator';

const run = async (url: string, options: chromeLauncher.Options) => {
  const chrome: chromeLauncher.LaunchedChrome = await chromeLauncher.launch({ chromeFlags: options.chromeFlags });
  options.port = chrome.port;

  try {
    const results = await lighthouse(url, options);
    const jsonReport = ReportGenerator.generateReport(results.lhr, 'json');

    fs.writeFile('results.json', jsonReport, (err) => {
      if (err) {
        console.log(err);

        return;
      };
      
      console.log('Successfully Written to File: results.json');
    });
    const htmlReport = ReportGenerator.generateReport(results.lhr, 'html');
    fs.writeFile('results.html', htmlReport, (err) => {
      if (err) {
        console.log(err);

        return;
      };
      
      console.log('Successfully Written to File: results.html');
    });
  } catch (error) {
    throw new Error(error);
  } finally {
    await chrome.kill();
  }
}

const urlToTest = 'https://dev.v3.weplan.dk/test';

run(urlToTest, { chromeFlags: ['--headless'] });
