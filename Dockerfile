FROM openjdk:22
VOLUME /cd
ARG JAR_FILE=/target/psygenie-backend-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]