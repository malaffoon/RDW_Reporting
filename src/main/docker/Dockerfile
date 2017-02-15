FROM anapsix/alpine-java:8_jdk_unlimited

VOLUME /tmp
ADD docker-startup.sh /
ADD configuration-service-0.0.1-SNAPSHOT.jar configuration-service.jar
RUN sh -c 'touch /docker-startup.sh && touch /configuration-service.jar'
RUN apk --no-cache add curl
ENTRYPOINT ["/docker-startup.sh"]