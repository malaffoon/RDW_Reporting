#!/bin/sh
#-----------------------------------------------------------------------------------------------------------------------
# File:  docker-startup.sh
#
# Desc:  Start the configuration-service.jar with the appropriate properties.
#
#-----------------------------------------------------------------------------------------------------------------------

java $JAVA_OPTS -jar /configuration-service.jar