### Build / Run ###
```
#!bash
mvn spring-boot:run
open http://localhost:8080
```

### Development ###
#### Background ####
This project basics were created on Mac OS with the below instructions:
```
#!bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install springboot
spring init --dependencies=web,aop,lombok,devtools --groupId=com.smarterbalanced --artifactId=rdw-reporting-ui api
```