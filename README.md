# SS_ConfigurationService
Spring cloud configuration service.

This service is responsible for providing externalized configuration properties to the Smarter Balance microservices.

## Environment Properties
* CONFIG_SERVICE_REPO - This environment property should be set to the configuration repository location.
    * Example: https://github.com/spring-cloud-samples/config-repo
* GIT_USER - Git repository username
* GIT_PASSWORD - Git repository password
* SERVER_PORT - Server HTTP port (Default: 8888)
* ENCRYPT_KEY - Shared secret key for encrypting/decrypting sensitive property values in the configuration repository.