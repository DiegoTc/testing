require('chromedriver');

var Fakerator = require("fakerator");
var assert = require('assert');
var fakerator = Fakerator("de-DE")
const { Browser, Builder, By, Key, until } = require('selenium-webdriver');
const { ignore, suite } = require('selenium-webdriver/testing');

const codes = require('german-postal-codes');
const unzip = require('zip-to-city')
const email = 'wunderflats'+Date.now()+"@mailinator.com";
const password = fakerator.internet.password(12);
let driver;
console.log("email: "+email);
console.log("password: "+ password);


suite(function(env) {
  describe('Wunderflats 1 Test', function() {

    this.timeout(0)
    it('Creating account',async function() {
      driver = new Builder()
      .forBrowser('chrome')
      .build();
      await driver.get('https://en-master.wunderflats.xyz/my/account');
      await driver.findElement(By.className('Modal-footer-link')).click();
      var name = fakerator.names.firstName();
      await driver.findElement(By.name('firstName')).sendKeys(name);
      await driver.findElement(By.name('lastName')).sendKeys(fakerator.names.lastName());
      await driver.findElement(By.name('email')).sendKeys(email);
      var phone = fakerator.phone.number();
      phone = phone.replace(/\+49\-/,"");
      while(phone.length >=15){
        phone = fakerator.phone.number();
        phone = phone.replace(/\+49\-/,"");
      }

      await driver.findElement(By.className('Input CustomPhoneNumberInput-textInput CustomPhoneNumberInput-phoneNumber qa-phoneNumber')).sendKeys(phone);
      await driver.findElement(By.name('password')).sendKeys(password);
      await driver.findElement(By.name('passwordConfirmation')).sendKeys(password);
      await driver.findElement(By.name('tos')).click();
      await driver.findElement(By.className('Button Button--primary Button--fullWidth')).click();
      await driver.wait(until.titleIs('Rent furnished apartments - Wunderflats'), 10000);
    });
    afterEach(() => driver && driver.quit());
  });

  describe('Wunderflats 2 Test', function(){
    this.timeout(0)
    it('login test',async function(){
      driver = new Builder().forBrowser('chrome').build();
      await driver.get('https://en-master.wunderflats.xyz/my/account');
      await driver.findElement(By.name('email')).sendKeys(email);
      await driver.findElement(By.name('password')).sendKeys(password);
      await driver.findElement(By.className('Button Button--primary Button--fullWidth')).click();
      await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
    });

    afterEach(() => driver && driver.quit());
  });

  describe('Wunderflats 3 Test', function(){
    this.timeout(0)
    it('Change name',async function(){
      driver = new Builder().forBrowser('chrome').build();
      await driver.get('https://en-master.wunderflats.xyz/my/account');
      await driver.findElement(By.name('email')).sendKeys(email);
      await driver.findElement(By.name('password')).sendKeys(password);
      await driver.findElement(By.className('Button Button--primary Button--fullWidth')).click();
      await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      var name = await driver.findElement(By.name('firstName')).getAttribute("value");
      await driver.findElement(By.name('firstName')).sendKeys(fakerator.names.firstName());
      await driver.findElement(By.className('UserProfileForm-submitButton btn btn-action btn-full')).click();
      //await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      var newname = await driver.findElement(By.name('firstName')).getAttribute("value");
      assert.notEqual(name, newname);
    });

    it('Change last name',async function(){
      driver = new Builder().forBrowser('chrome').build();
      await driver.get('https://en-master.wunderflats.xyz/my/account');
      await driver.findElement(By.name('email')).sendKeys(email);
      await driver.findElement(By.name('password')).sendKeys(password);
      await driver.findElement(By.className('Button Button--primary Button--fullWidth')).click();
      await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      var lastname = await driver.findElement(By.name('lastName')).getAttribute("value");
      await driver.findElement(By.name('lastName')).sendKeys(fakerator.names.lastName());
      await driver.findElement(By.className('UserProfileForm-submitButton btn btn-action btn-full')).click();
      //await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      var newlastname = await driver.findElement(By.name('lastName')).getAttribute("value");
      assert.notEqual(lastname, newlastname);
    });

    it('Change address', async function(){
      driver = new Builder().forBrowser('chrome').build();
      await driver.get('https://en-master.wunderflats.xyz/my/account');
      await driver.findElement(By.name('email')).sendKeys(email);
      await driver.findElement(By.name('password')).sendKeys(password);
      await driver.findElement(By.className('Button Button--primary Button--fullWidth')).click();
      await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      var address = await driver.findElement(By.name('address[addressLine1]')).getAttribute("value");
      await driver.findElement(By.name('address[addressLine1]')).sendKeys(fakerator.address.street());
      await driver.findElement(By.className('UserProfileForm-submitButton btn btn-action btn-full')).click();
      //await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      var newaddress = await driver.findElement(By.name('address[addressLine1]')).getAttribute("value");
      assert.notEqual(address, newaddress);
    });

    it('Change Zip code and city', async function(){
      driver = new Builder().forBrowser('chrome').build();
      await driver.get('https://en-master.wunderflats.xyz/my/account');
      await driver.findElement(By.name('email')).sendKeys(email);
      await driver.findElement(By.name('password')).sendKeys(password);
      await driver.findElement(By.className('Button Button--primary Button--fullWidth')).click();
      await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      var zipcode = await driver.findElement(By.name('address[zipCode]')).getAttribute("value");
      var city = await driver.findElement(By.name('address[city]')).getAttribute("value");
      var information = [zipcode,city];
      var rand = Math.floor((Math.random() * 8000) + 1);
      await driver.findElement(By.name('address[zipCode]')).sendKeys(codes[rand]);
      await driver.findElement(By.name('address[city]')).sendKeys(unzip(codes[rand]));
      await driver.findElement(By.className('UserProfileForm-submitButton btn btn-action btn-full')).click();
      //await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      var newzipcode = await driver.findElement(By.name('address[zipCode]')).getAttribute("value");
      var newcity = await driver.findElement(By.name('address[city]')).getAttribute("value");
      var newinformation = [newzipcode,newcity];
      assert.notEqual(information,newinformation);
    });

    

    afterEach(() => driver && driver.quit());
  });


});
