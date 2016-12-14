### Build / Run ###
```
#!bash
mvn spring-boot:run
open http://localhost:8080
```
### Background ###
This project was created on Mac OS with the below instructions:
```
#!bash
#install brew
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# install java
brew tap caskroom/cask
brew install caskroom/cask/java

# install springboot cli
brew tap pivotal/tap
brew install springboot

# create spring boot app in directory called "api"
spring init --dependencies=web,aop,lombok,devtools --groupId=com.smarterbalanced --artifactId=rdw-reporting-ui api
```