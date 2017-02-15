FROM frolvlad/alpine-oraclejdk8:slim

VOLUME /tmp
ADD docker-startup.sh /
ADD configuration-service-0.0.1-SNAPSHOT.jar configuration-service.jar
RUN sh -c 'touch /docker-startup.sh && touch /configuration-service.jar'
ENTRYPOINT ["/docker-startup.sh"]