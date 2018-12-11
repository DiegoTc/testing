require('chromedriver');
var assert = require('assert');
const {
  Browser,
  Builder,
  By,
  Key,
  until
} = require('selenium-webdriver');
const {
  ignore,
  suite
} = require('selenium-webdriver/testing');

suite(function(env) {
  describe('Google Search', function() {
    let driver;
    this.timeout(0)

    beforeEach(async function() {
      // env.builder() returns a Builder instance preconfigured for the
      // envrionment's target browser (you may still define browser specific
      // options if necessary (i.e. firefox.Options or chrome.Options)).
      driver = new Builder()
      .forBrowser('chrome')
      .build();
      await driver.get('https://www.google.com/ncr');
    });

    it('demo', async function() {

      await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
      await driver.wait(until.titleIs('webdriver - Google Search'), 25000);
    });

    // The ignore function returns wrappers around describe & it that will
    // suppress tests if the provided predicate returns true. You may provide
    // any synchronous predicate. The env.browsers(...) function generates a
    // predicate that will suppress tests if the  env targets one of the
    // specified browsers.
    //
    // This example is always configured to skip Chrome.
    ignore(env.browsers(Browser.FIREFOX)).it('demo 2', async function() {

      let url = await driver.getCurrentUrl();
      assert.equal(url, 'https://www.google.com/');
    });

    afterEach(() => driver && driver.quit());
  });
});
