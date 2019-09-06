## RDW_Reporting

Additional documentation:
1. RDW_Reporting is part of the RDW suite of projects and applications. For all things RDW please refer to 
[RDW repo](https://github.com/SmarterApp/RDW)
1. [Change log](CHANGELOG.md)
1. [Contributing developer notes](CONTRIBUTING.md)
1. [License](LICENSE)

### Prerequisites
```bash
# Install node.js
# Download the most current from https://nodejs.org/en/
 
# Install angular-cli
npm install @angular/cli
```

#### MySQL
MySQL is required for building (integration tests) and running this application. To better match production, MySQL
should be run as a native app outside the container framework . There are various ways to install it; please be sure 
to install version 5.6 which is older and not the default! Here are the basic brew instructions:
```bash
brew update
brew install mysql@5.6
```
At the end of the install, there is a suggestion to add the mysql location to the path:
```bash
echo 'export PATH="/usr/local/opt/mysql@5.6/bin:$PATH"' >> ~/.bash_profile
```

Because brew isn't cool and directly sets the bind address you must modify `/usr/local/Cellar/mysql@5.6/5.6.34/homebrew.mxcl.mysql@5.6.plist` 
(make sure to use your minor version of the installation) and set `--bind-address=*`. 
You'll need to restart mysql after that, `brew services restart mysql@5.6`. You may need to fully stop and start
the service if you get a `mysql.sock` error at this point:
```bash
brew services stop mysql@5.6
brew services start mysql@5.6 
```

You may need to grant permissions to 'root'@'%':
```bash
mysql -uroot
mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
mysql> exit
```

You should load your timezone info, because we'll be forcing the timezone to 'UTC' in the next step. You may see 
some warnings of skipped files but no errors when you do this:
```bash
mysql_tzinfo_to_sql /usr/share/zoneinfo | sed -e "s/Local time zone must be set--see zic manual page/local/" | mysql -u root mysql
```

Finally, you need to configure MySQL settings in `my.cnf` file. Locate the file (for a brew install it will be
`/usr/local/Cellar/mysql@5.6/5.6.34/my.cnf` but if you can't find it try `sudo find -name my.cnf -print`) 
and add the following lines:
```
[mysqld]
explicit_defaults_for_timestamp=1
default-time-zone='UTC'
secure_file_priv=/tmp/
```

Restart MySQL:
```bash
brew services restart mysql@5.6
```

To verify the settings, run a mysql client:
```bash
mysql> SELECT @@explicit_defaults_for_timestamp;
+-----------------------------------+
| @@explicit_defaults_for_timestamp |
+-----------------------------------+
|                                 1 |
+-----------------------------------+

mysql> SELECT @@system_time_zone, @@global.time_zone, @@session.time_zone;
+--------------------+--------------------+---------------------+
| @@system_time_zone | @@global.time_zone | @@session.time_zone |
+--------------------+--------------------+---------------------+
| PDT                | UTC                | UTC                 |
+--------------------+--------------------+---------------------+
```

The service depends on the database being configured properly. See instructions below under [Running](#running) 

#### wkhtmltopdf
wkhtmltopdf is required for building (integration tests) the applications. To install:
```bash
brew install Caskroom/cask/wkhtmltopdf
```
For running the application, wkhtmltopdf is bundled as a service and is run in a docker container.

### Building
After cloning the repository run:
```bash
./gradlew build it
```
The `it` task will trigger the integration tests.

If you want to run the integration tests against Aurora (instead of the local MySQL) you should set environment
variable with the required credentials for the CI (or other appropriate) database instance. Note that the way things
work for this, all the schemas must live in the same database server (so reporting and warehouse can't be separate
servers). The users may be different (but for CI they are the same). The `ORG_GRADLE_PROJECT_*` variables are passed
into the gradle environment so the RDW_Schema commands are applied to the correct database. The `SPRING_*_*` are used
by the Spring Boot ITs. And the temporary variables are just to avoid some duplication.
```bash
(SERVER=rdw-aurora-ci.cugsexobhx8t.us-west-2.rds.amazonaws.com:3306; USER=sbac; PSWD=password; \
 export ORG_GRADLE_PROJECT_database_url=jdbc:mysql://$SERVER/; \
 export ORG_GRADLE_PROJECT_database_user=$USER; export ORG_GRADLE_PROJECT_database_password=$PSWD; \
 export DATASOURCES_REPORTING_RO_URL_SERVER=$SERVER; \
 export DATASOURCES_REPORTING_RO_USERNAME=$USER; export DATASOURCES_REPORTING_RO_PASSWORD=$PSWD; \
 export DATASOURCES_WAREHOUSE_RW_URL_SERVER=$SERVER; \
 export DATASOURCES_WAREHOUSE_RW_USERNAME=$USER; export DATASOURCES_WAREHOUSE_RW_PASSWORD=$PSWD; \
 export DATASOURCES_REPORTING_RW_URL_SERVER=$SERVER; \
 export DATASOURCES_REPORTING_RW_USERNAME=$USER; export DATASOURCES_REPORTING_RW_PASSWORD=$PSWD; \
 export TEST_AURORA=true
 ./gradlew it)
```

The integration tests dealing with Redshift have been separated out because they require remote AWS resources
and they take a while to run. To run these tests you must set credentials -- please see the comment in 
aggregate-service/build.gradle. By default it uses the CI database instances:
```bash
(export DATASOURCES_OLAP_RO_PASSWORD=password; \
 ./gradlew rst)
```

#### Building with locally modified RDW_Common
RDW_Reporting makes use of RDW_Common modules. If you are developing RDW_Common and would like to test changes in this 
project, you can build RDW_Common locally and install your changes to the local repository:
```bash
git clone https://github.com/SmarterApp/RDW_Common
cd RDW_Common
# make code changes
./gradlew install
```
Then to use those new changes, you can specify the SNAPSHOT version of RDW_Common
```bash
./gradlew build it -Pcommon=1.1.0-SNAPSHOT
```

#### Docker Images
To build the docker images run:
```bash
./gradlew buildImage
```

### Coverage Reports
Code coverage reports can be found under each project in `./build/reports/coverage/index.html` after explicitly 
generating them using:
```bash
./gradlew coverage
``` 

### Running
Running the application locally depends on the local database being configured properly.
```bash
# To completely clean out any existing data you might have and start fresh:
./gradlew cleanallprod migrateallprod
# or, if you want to use a different version of the schema, say version 1.1.0-68 of RDW_Schema
./gradlew -Pschema=1.1.0-68 cleannallprod migrateallprod
# or, SNAPSHOT version of RDW_Schema if you are doing simultaneous development with RDW_Schema
./gradlew -Pschema=SNAPSHOT cleanallprod migriateallprod
```

There is also a dev mysql dump file available with preloaded data. Ask for the latest version and then load, e.g.:
```
mysql -u root < mysql.20170707.68.dmp
```

The apps are wrapped in docker containers and should be built and run that way. There is a docker-compose spec for
each webapp to make it easier: it runs the configuration server, webapps and other service dependencies service with
the correct profile. Please read the comments in the docker-compose script for setting required environment variables.

To use docker-compose to run the reporting or admin webapp. Go to the module directory and run:
```bash
docker-compose up -d
```

To test the app navigate to `http://localhost:8080` in a browser. You'll need ART credentials to login.
The status end-point should be available without credentials at `http://localhost:8081/status?level=5`

To shut down:
```bash
docker-compose down
```

If you want to run a particular service in your IDE, you'll need to tweak a couple things:
1. Modify the `docker-compose.yml` file and comment out the service you'll be running, and look at the comments
in the webapp configuration section about changing the zuul routes
1. Modify the `application.yml` for the service to have tenant information. For example, for the data in the dev
mysql dump, we want CA and TS to be defined:

```
tenantProperties:
  tenants:
    CA:
      id: CA
      key: CA
      name: California
    TS:
      id: TS
      key: TS
      name: Test Tenant
```
2. And if for SandboxCreation, a list of datasets is required. Locally they won't exist.
so if you add the following to your application.yml to list 'available' datasets.
# Only here for local Dev for Sandbox creation, not real dataSets
sandbox-properties:
  sandboxDatasets:
    - label: Demo Dataset
      id: demo-dataset
    - label: SBAC Dataset
      id: sbac-dataset
**NOTE: do NOT check in this change to the file!**

### Running sandbox / tenant administration locally

In production tenant administration is dependent upon

- [Spring Cloud Config](https://spring.io/projects/spring-cloud-config) 
  - backed by a git repository to hold all the application configurations
- S3 to store Datasets
- Aurora and Redshift to have new schemas created and to load datasets from S3.

#### Caveats

- It is not possible to run the entire process locally, Redshift resources must be remote.
- It isn't possible to run config-server off of a local git repo without some manual intervention
- There is no automated way to remove missing sandbox or tenant databases from you local mysql, you will need to clean them up by hand.

#### Datasets

Datasets are used during Sandbox creation to pre-populate a sandbox with generated data.

Datasets resolve within the application via the `archive.uri-root` configuration.  When running remotely the application will be using Aurora / Redshift calls directly to S3.  For local development they can be simulated with the local filesystems instead of S3 and mysql instead of Aurora.  In local mode no Redshift / OLAP schema creation or population will occur. 

*Local Mode* is derived form the `archive.uri-root` being set to a `file://` prefix instead of `s3://`.

By default for local development that is 

```yaml
archive:
  uri-root: "file:///tmp/"
```

The root of the datasets are in a directory `sandbox-datasets` and the sub directory names must
agree with the configured properties defined in `sandbox-properties.sandboxDatasets`.

An expedient way of populating the simulated archive root directory populated with datasets is to copy the ones in use in the QA S3 archive. 

```bash
aws s3 sync s3://<archiveBucketName>/sandbox-datasets/ /tmp/sandbox-datasets
```

#### Git - Private Remote Fork (recommended)

This is a sample for reference, depending on the git setup for your private fork the exact commands may vary.

clone a base configuration

`git clone https://gitlab.com/<baseRepoOwner>/rdw_config.git ~/projects/RDW/rdw_config`

setup a private repository (Github, Bitbucket, Gitlab, etc) then set repo as a remote

`git remote add fork https://github.com/<mygithubusername>/rdw_config.git`

push the local clone to the fork

`git push -f fork  master`

At times it is worth resetting your fork to match base (origin) exactly

```
$ cd ~/projects/RDW/rdw_config
$ git fetch origin
$ git reset --hard origin/master
$ git push -f fork master
```

It is probable that you will want to make changes to your fork that you do not want to make to the original rdw_config. I recommend an additional working copy for that purpose.

`git clone https://github.com/<mygithubusername>/rdw_config.git ~/projects/RDW/rdw_config_fork`

It is necessary to set the configuration for `tenant-configuration-persistence` in `~/projects/RDW/rdw_config_fork/rdw-reporting-admin-service.yml`, but before that you will need to encrypt your git user account (the one used for the fork) with the locally running config-server in docker.

```
$ curl localhost:8888/encrypt -d mygitpassword
44b5d831427388b6d24751619a6cebd8392ac8d97f23a332700ed83e203b8288
```

then edit `~/projects/RDW/rdw_config_fork/rdw-reporting-admin-service.yml` make sure to set the  remote-repository-uri, git-username, and git-password.  remote-repository-uri needs to be https.

```
tenant-configuration-persistence:
  local-repository-path: /tmp/rdw_config_local
  remote-repository-uri: https://github.com/<mygithubusername>/rdw_config.git
  git-username: <mygithubusername>
  git-password: '{cipher}44b5d831427388b6d24751619a6cebd8392ac8d97f23a332700ed83e203b8288'
  author: "RDW Admin System"
  author-email: "rdwadmin@example.com"
```

After editing it may be worth saving a copy of  `~/projects/RDW/rdw_config_fork/rdw-reporting-admin-service.yml` so that you can easily update it again after resting your fork to the latest from the shared repository.

The last thing to do is to make sure `$CONFIG_SERVICE_REPO` environment variable is set to your fork `https://github.com/<mygithubusername>/rdw_config.git` instead of the shared repo.  `$GIT_PASSWORD` and`$GIT_USER` also need to be set to your username and password.  The `$GIT_PASSWORD` environment variable is unencrypted unlike the one stored in the yml file.

#### Git - Private Local Fork (requires manual intervention)

set up your local fork

```
rm -rf  /tmp/rdw_config_remote
git clone https://gitlab.com/<baseRepoOwner>/rdw_config.git /tmp/rdw_config_remote
```

The config-server will try and fetch remotes you have defined, disconnect them

```
cd /tmp/rdw_config_remote
git remote rm origin
```

This would [theoretically](https://stackoverflow.com/questions/1764380/how-to-push-to-a-non-bare-git-repository) work, but it is currently unsupported by JGit.

```
git config --local receive.denyCurrentBranch updateInstead
```

The last thing to do is to make sure `$CONFIG_SERVICE_REPO` environment variable is set to your fork `file:///tmp/rdw_config_remote` instead of the shared repo. `$GIT_PASSWORD` and `$GIT_USER` are not used.

The downside of this setup is that pushes to the simulated git repo are not reflected in the working copy, and need to be manually synced in order for the config server to pick them up (creating or updating a tenant or sandbox)

```
$ cd /tmp/rdw_config_remote
$ git reset --hard HEAD 
$ curl -d "path=*" http://localhost:8888/monitor
```

