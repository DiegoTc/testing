require('chromedriver');

var Fakerator = require("fakerator");
var assert = require('assert');
var fakerator = Fakerator("de-DE")
var fs = require('fs');
const { Browser, Builder, By, Key, until } = require('selenium-webdriver');
const { ignore, suite } = require('selenium-webdriver/testing');
var states=['Baden-Württemberg','Bavaria','Berlin','Brandenburg','Bremen','Hamburg ','Hesse','Lower Saxony','Nordrhein-Westfalen','Rheinland-Pfalz','Saarland','Sachsen','Sachsen-Anhalt','Schleswig-Holstein','Thuringia'];
const codes = require('german-postal-codes');
const unzip = require('zip-to-city')
var email = 'wunderflats'+Date.now()+"@mailinator.com";
var password = fakerator.internet.password(12);
var driver;
console.log("email: "+email);
console.log("password: "+ password);

var account = [];
account.push(fakerator.names.firstName());
account.push(fakerator.names.lastName());
account.push(email)
var phone = fakerator.phone.number();
phone = phone.replace(/\+49\-/,"");
while(phone.length >=13){
  phone = fakerator.phone.number();
  phone = phone.replace(/\+49\-/,"");
}

account.push(phone)
account.push(password)

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
      await driver.findElement(By.name('firstName')).sendKeys(account[0]);
      await driver.findElement(By.name('lastName')).sendKeys(account[1]);
      await driver.findElement(By.name('email')).sendKeys(account[2]);
      await driver.findElement(By.className('Input CustomPhoneNumberInput-textInput CustomPhoneNumberInput-phoneNumber qa-phoneNumber')).sendKeys(account[3]);
      await driver.findElement(By.name('password')).sendKeys(account[4]);
      await driver.findElement(By.name('passwordConfirmation')).sendKeys(account[4]);
      await driver.findElement(By.name('tos')).click();
      await driver.findElement(By.className('Button Button--primary Button--fullWidth')).click();
      await driver.wait(until.titleIs('Rent furnished apartments - Wunderflats'), 10000);
    });
    afterEach(function(){
      if (this.currentTest.state == 'failed') {
            var filename = encodeURIComponent(this.currentTest.title.replace(/\s+/g, '-'));
            var d = new Date();
            filename='screenshots/'+filename+"_"+d.getFullYear()+"_"+d.getMonth()+"_"+d.getDate()+".png";
            driver.takeScreenshot().then(function(data){
              fs.writeFileSync(filename,data,'base64');
            });
      }
      driver && driver.quit();
    });
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

    afterEach(function(){
      if (this.currentTest.state == 'failed') {
            var filename = encodeURIComponent(this.currentTest.title.replace(/\s+/g, '-'));
            var d = new Date();
            filename='screenshots/'+filename+"_"+d.getFullYear()+"_"+d.getMonth()+"_"+d.getDate()+".png";
            driver.takeScreenshot().then(function(data){
              fs.writeFileSync(filename,data,'base64');
            });
      }
      driver && driver.quit();
    });
  });

  describe('Wunderflats 3 Test - Changing parameters individually', function(){
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
      var newlastname = await driver.findElement(By.name('lastName')).getAttribute("value");
      assert.notEqual(lastname, newlastname);
    });

    it('Change email',async function(){
      driver = new Builder().forBrowser('chrome').build();
      await driver.get('https://en-master.wunderflats.xyz/my/account');
      await driver.findElement(By.name('email')).sendKeys(email);
      await driver.findElement(By.name('password')).sendKeys(password);
      await driver.findElement(By.className('Button Button--primary Button--fullWidth')).click();
      await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      var mail = await driver.findElement(By.name('email')).getAttribute("value");
      var newmail = 'wunderflats'+Date.now()+"@mailinator.com";
      await driver.findElement(By.name('email')).sendKeys(newmail);
      await driver.findElement(By.className('UserProfileForm-submitButton btn btn-action btn-full')).click();
      email = await driver.findElement(By.name('email')).getAttribute("value");
      assert.notEqual(mail, email);
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

    it('Change State', async function(){
      driver = new Builder().forBrowser('chrome').build();
      await driver.get('https://en-master.wunderflats.xyz/my/account');
      await driver.findElement(By.name('email')).sendKeys(email);
      await driver.findElement(By.name('password')).sendKeys(password);
      await driver.findElement(By.className('Button Button--primary Button--fullWidth')).click();
      await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      var state = await driver.findElement(By.name('address[region]')).getAttribute("value");
      var rand = Math.floor((Math.random() * 15) + 1);
      await driver.findElement(By.name('address[region]')).sendKeys(states[rand]);
      await driver.findElement(By.className('UserProfileForm-submitButton btn btn-action btn-full')).click();
      var newState = await driver.findElement(By.name('address[region]')).getAttribute("value");
      assert.notEqual(state,newState);
    });

    it('Change Country',async function(){
      driver = new Builder().forBrowser('chrome').build();
      await driver.get('https://en-master.wunderflats.xyz/my/account');
      await driver.findElement(By.name('email')).sendKeys(email);
      await driver.findElement(By.name('password')).sendKeys(password);
      await driver.findElement(By.className('Button Button--primary Button--fullWidth')).click();
      await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      var country = await driver.findElement(By.name('address[country]')).getAttribute('value');
      var newValue=fakerator.address.countryCode();
      await driver.executeScript('document.getElementById("addressCountry").value="'+newValue+'"');
      await driver.findElement(By.className('UserProfileForm-submitButton btn btn-action btn-full')).click();
      var newcountry = await driver.findElement(By.name('address[country]')).getAttribute('value');
      assert.notEqual(country,newcountry);
    });

    it('Change language', async function(){
      driver = new Builder().forBrowser('chrome').build();
      await driver.get('https://en-master.wunderflats.xyz/my/account');
      await driver.findElement(By.name('email')).sendKeys(email);
      await driver.findElement(By.name('password')).sendKeys(password);
      await driver.findElement(By.className('Button Button--primary Button--fullWidth')).click();
      await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      var language = await driver.findElement(By.name('language')).getAttribute('value');
      var optlanguage = language ==='en' ? 'de':'en';
      await driver.executeScript('document.getElementsByName("language")[0].value="'+optlanguage+'"');
      await driver.findElement(By.className('UserProfileForm-submitButton btn btn-action btn-full')).click();
      var newlanguage = await driver.findElement(By.name('language')).getAttribute('value');
      assert.notEqual(language,newlanguage);
    });

    it('Change nationality',async function(){
      driver = new Builder().forBrowser('chrome').build();
      await driver.get('https://en-master.wunderflats.xyz/my/account');
      await driver.findElement(By.name('email')).sendKeys(email);
      await driver.findElement(By.name('password')).sendKeys(password);
      await driver.findElement(By.className('Button Button--primary Button--fullWidth')).click();
      await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      var nationality = await driver.findElement(By.name('nationality')).getAttribute('value');
      var newValue=fakerator.address.countryCode();
      await driver.executeScript('document.getElementsByName("nationality")[0].value="'+newValue+'"');
      await driver.findElement(By.className('UserProfileForm-submitButton btn btn-action btn-full')).click();
      var newnationality = await driver.findElement(By.name('address[country]')).getAttribute('value');
      assert.notEqual(nationality,newnationality);
    });

    afterEach(function(){
      if (this.currentTest.state == 'failed') {
            var filename = encodeURIComponent(this.currentTest.title.replace(/\s+/g, '-'));
            var d = new Date();
            filename='screenshots/'+filename+"_"+d.getFullYear()+"_"+d.getMonth()+"_"+d.getDate()+".png";
            driver.takeScreenshot().then(function(data){
              fs.writeFileSync(filename,data,'base64');
            });
      }
      driver && driver.quit();
    });
  });

  describe('Wunderflats 4 - Test Not able to save', function(){
    this.timeout(0)
    it('Not able to save empty name', async function(){
      driver = new Builder().forBrowser('chrome').build();
      await driver.get('https://en-master.wunderflats.xyz/my/account');
      await driver.findElement(By.name('email')).sendKeys(email);
      await driver.findElement(By.name('password')).sendKeys(password);
      await driver.findElement(By.className('Button Button--primary Button--fullWidth')).click();
      await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      await driver.executeScript("document.getElementsByName('firstName')[0].value=''");
      await driver.findElement(By.className('UserProfileForm-submitButton btn btn-action btn-full')).click();
      await driver.wait(until.elementLocated(By.className('ErrorIndicator ErrorIndicator--invalid')),12000);
    });

    it('Not able to save empty last name', async function(){
      driver = new Builder().forBrowser('chrome').build();
      await driver.get('https://en-master.wunderflats.xyz/my/account');
      await driver.findElement(By.name('email')).sendKeys(email);
      await driver.findElement(By.name('password')).sendKeys(password);
      await driver.findElement(By.className('Button Button--primary Button--fullWidth')).click();
      await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      await driver.executeScript("document.getElementsByName('lastName')[0].value=''");
      await driver.findElement(By.className('UserProfileForm-submitButton btn btn-action btn-full')).click();
      await driver.wait(until.elementLocated(By.className('ErrorIndicator ErrorIndicator--invalid')),12000);
    });

    it('Not able to save empty email', async function(){
      driver = new Builder().forBrowser('chrome').build();
      await driver.get('https://en-master.wunderflats.xyz/my/account');
      await driver.findElement(By.name('email')).sendKeys(email);
      await driver.findElement(By.name('password')).sendKeys(password);
      await driver.findElement(By.className('Button Button--primary Button--fullWidth')).click();
      await driver.wait(until.titleIs('Profile - Wunderflats'), 10000);
      await driver.executeScript("document.getElementsByName('email')[0].value='kjhghgfds@gf.com'");
      await driver.findElement(By.className('UserProfileForm-submitButton btn btn-action btn-full')).click();
      await driver.wait(until.elementLocated(By.className('ErrorIndicator ErrorIndicator--invalid')),12000);
    });

    afterEach(function(){
      if (this.currentTest.state == 'failed') {
            var filename = encodeURIComponent(this.currentTest.title.replace(/\s+/g, '-'));
            var d = new Date();
            filename='screenshots/'+filename+"_"+d.getFullYear()+"_"+d.getMonth()+"_"+d.getDate()+".png";
            driver.takeScreenshot().then(function(data){
              fs.writeFileSync(filename,data,'base64');
            });
      }
      driver && driver.quit();
    });

  });

});
