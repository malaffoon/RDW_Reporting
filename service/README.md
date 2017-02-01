### Prerequisites ###
```
#!bash

# create a local application data folder
mkdir -p /opt/rdw-reporting-ui/config

# download the application.properties and saml.jks made for your local environment into this directory
# URLs will be circulated internally
curl <application_properties_url> > /opt/rdw-reporting-ui/config/application.properties
curl <saml_jks_url> > /opt/rdw-reporting-ui/config/saml.jks
```
### Build ###
```
#!bash
mvn package
```
### Run ###
```
#!bash
java -jar target/rdw-reporting-ui*.jar --spring.config.location=/opt/rdw-reporting-ui/config/application.properties
open http://localhost:6543
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
spring init --dependencies=web,security,aop,lombok,devtools --groupId=rdw.reporting.web --artifactId=rdw-reporting-ui api
```