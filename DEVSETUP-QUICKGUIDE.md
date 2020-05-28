# Development Setup
The Setup guide for new developers to RDW_Reporting. This document will guide a new user to setup a development environment that will get a basic RDW running locally.
The end goal is to have the RDW_Reporting project up and running with set of test data to use. 
This doc will make references to other README files, this is a quickstart to get a developer up and running quickly.

**Intended Audience**: This document is meant to help setup an environment for RDW Development. And instructions are showing installations on a Mac. Adjust the installation to match your actual development machine.

Before updating resources in this project, please reference [Contributing](CONTRIBUTING.md).

## Prerequisites 
The following is the list of requirements needed for development and then to run RDW_reporting locally:

* Docker
* Java 8 
* Gradle (part of project)
* gdub (recommended, not required)
* Node & Angular
* wkhtmltopdf
* RDW Repos
* MySQL 
* GitLab account
* Test data (using 'mysqltestdata.dmp' ask project lead for latest data file)

### Docker
Install the latest Docker for your machine. And have it up and running.

### Java 8
Install the latest Java 8

### Gradle 
The project uses bundled gradle so no explicit installation is required. 
However, it is highly recommended to install gdub (https://github.com/dougborg/gdub) because it handles some shortcomings of gradle's commandline behavior. The instructions assume this, using gw instead of ./gradlew or gradle.

### Node
```bash
# Install node.js
# Download the most current from https://nodejs.org/en/
 
# Install angular-cli
npm install @angular/cli
```

### Install wkhtmltopdf
wkhtmltopdf is required for building (integration tests) the applications. To install:
```bash
brew install Caskroom/cask/wkhtmltopdf
```
For running the application, wkhtmltopdf is bundled as a service and is run in a docker container.


### RDW Repos
Create a RDW 
To get the RDW_Reporting app up and running, only the following repos need to cloned locally. 

* [RDW](https://github.com/SmarterApp/RDW)
 git clone https://github.com/SmarterApp/RDW.git

* [RDW_Reportng](https://github.com/SmarterApp/RDW_Reporting)
 git clone https://github.com/SmarterApp/RDW_Reporting.git
 
* [RDW_Common](https://github.com/SmarterApp/RDW_Common)
 git clone https://github.com/SmarterApp/RDW_Common.git
 
* [RDW_Schema](https://github.com/SmarterApp/RDW_Schema)
 git clone https://github.com/SmarterApp/RDW_Schema.git
 
### goto RDW_Schema - setup MySQL & Test data
From the RDW_Schema directory, follow the directions from the RDW_Schema README->MySQL section, following Native or Docker setup, and then return to this document. 
Then from the RDW_Schema directory, run the following two commands to pull in the mysqltestdata.dmp into the database and create the schema. Remember the mysqltestdata.dmp is the file you got from the project lead or other developer. Also update the path in the command line to point to where your .dmp file is located.

Add the test data dump file
```bash
mysql -u root < ~/mysqltestdata.dmp
gw migrateAll
```

### Update Environment
The following environment variable are needed to run RDW_Reporting using Docker.
Can be placed in your .bashrc or .zshrc file. 

Note: can use chk [README.md](README.md)

```bash
export CONFIG_SERVICE_REPO=https://gitlab.com/fairwaytech/rdw_config.git
export GIT_USER=(your GitLab User Name) 
export GIT_PASSWORD=(your GitLab pwd)
export RDW_REPORTING_KEYSTORE_PATH=file:~/Downloads/rdw-reporting-saml.jks
export RDW_REPORTING_KEYSTORE_PASSWORD=mypassword
export RDW_REPORTING_KEYSTORE_ALIAS=rdw-reporting-ui-sp
export RDW_REPORTING_KEYSTORE_ENTRY_PASSWORD=mypassword
export RDW_REPORTING_IDP=https://sso-deployment.sbtds.org/auth/saml2/jsp/exportmetadata.jsp?realm=/sbac
export RDW_REPORTING_ENTITYID=rdw-reporting-ui-local
export RDW_AWS_ACCESS_KEY=myAccessKey
export RDW_AWS_SECRET_KEY=mySecretKey
export RDW_RESOURCE_ROOT=s3://rdw-resources/
export RDW_PERMISSION_SERVICE=http://perm-web-deployment.sbtds.org:8080/rest
export RDW_REPORTING_IRIS_VENDORID=2B3C34BF-064C-462A-93EA-41E9E3EB8333
export RDW_REPORTING_IRIS_URL=http://iris-dev.sbacdw.org:8080/iris/
export RDW_REPORTING_ARTIFACTS_EXAM_ITEM_DIRECTORY=item-content/bank/items/Item-{0}/
``` 
REMEMBER: If you updated the .bashrc or .zshrc files, either open a new terminal window OR source your file so the environment is set properly.

### goto RDW_Reporting
Now build the RDW_reporting project
```bash
gw build it
```

Build the DockerImages
```bash
gw dockerBuildImage
```

Run the Docker images
```bash
docker-compose up -d
```
This will take a few minutes to run, and you can check on the container status using the following: 
```bash
docker ps 
```

To view reporting webapp logs to verify it is up and running, run the following cmd, look for Tomcat is up and running on port 8080. (ctrl-c) to exit.
```bash
docker logs -f rdw_reporting_webapp_1
```

Once all of the containers are running, goto Http://localhost:8080 and the SB webapp should be available.

To Shutdown the Docker Images
```bash
docker-compose down 
```
## Tips & Troubleshooting
#### * If you are working offsite and need to run the aggregate-service, have an admin whitelist your IP address for the AWS security group sbacdw-redshift. 

#### * Error when running `docker-compose up -d` getting "stuck on" config_server. 
check your GIT LAB user name and password are set properly in your environment (can use the `export` cmd to list current environment settings.

#### * mysql.sock error when running locally
1) uninstall mysql 
```bash
brew uninstall mysql@5.6
```
2) remove all my.cnf files (note: location of my.cnf file may differ)
```bash
rm /usr/local/etc/mycnf
```
3) start from the begining of the MySQL installation setup in the RDW_Schema -> README.md file 
#### NOTE: to follow the steps closely.
