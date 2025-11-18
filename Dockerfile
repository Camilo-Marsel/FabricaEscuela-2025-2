FROM eclipse-temurin:11-jdk
EXPOSE 8080
ADD target/lab2v.jar lab2v.jar
ENTRYPOINT ["java","-jar","/lab2v.jar"]