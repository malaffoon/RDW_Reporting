### Build ###
```
#!bash
ng build
```
### Test ###
```
#!bash
ng test
```
### Run ###
```
#!bash
ng serve
open http://localhost:4200
```
### Integration Test ###
```
#!bash
# application must be running
ng e2e
```
### Background ###
This project was created on Mac OS with the below instructions:
```
#!bash
#install brew
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# install node js
brew install node

# install angular cli
npm install -g angular-cli

# create angular app in directory called "client"
ng new client
```
