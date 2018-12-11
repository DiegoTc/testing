require('chromedriver');
var assert = require('assert');
const { Browser, Builder, By, Key, until } = require('selenium-webdriver');
const { ignore, suite } = require('selenium-webdriver/testing');

var driver = new Builder().forBrowser('chrome').build();
driver.get('https://en-master.wunderflats.xyz/');
driver.get(By.className('btn btn-action')).click();
driver.wait(until.titleIs)
