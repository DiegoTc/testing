# Wunderflats Coding Challenge
This is my solution for the challenge of wunderflats.

### Installation

This solution runs in Node Js. First you will need to install the dependancies and the run it. Follow instructions below.

Install the dependencies and devDependencies and start the server.

```sh
$ npm install
$ npm start
```
### Development
The tests consists in one main suit, with 4 main descriptions.
 - Create account
 - Login
 - Change information from the account
 - Leave empty fields and try to save them

##### Create account
This is the main part of the test, as in this main case, the account is created. With the credentials used here, the rest of the test scenarios are being use. I'm using [Fakerator] a Node Js package for generating names and phone numbers.

###### Important
Take into consideration some times, test will fail as the phone number is wrong. See image below. (Couldn't identify correctly the format for phone numbers)
![Error](https://raw.githubusercontent.com/DiegoTc/testing/master/screenshots/Creating-account_2018_11_12.png)



##### Login
This test validates that the user can login to his or her account.

##### Change information from account
Here we have several test, the main idea is to change every detail in the form, save it and validate the information was change successfully.

##### Leave empty fields and try to save them
The idea of these test, is that they have to fail. The form needs certain fields that can't be empty. The idea is to test this functionality and see if they fail, meaning that the test pass.

##### Approach
This was an interesting challenge. In the past I had used Selenium for testing, but Java as programming language. It was a little bit challenge to manage the asyncronus calls in Javascript, but after some struggle (that's why it's a challenge :p ) I got to managed it. I consider that I needed to test the save option for each field, that's why the third description contains the most of the test. And definetely it's needed to test that the application fails, when the user tries to delete the first, last name and email.



[Fakerator]: <https://www.npmjs.com/package/fakerator>
