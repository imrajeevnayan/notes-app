FROM eclipse-temurin:25-jdk

WORKDIR /app

# Copy maven wrapper and pom
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Copy source
COPY src ./src

# Build the application
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Run the jar
CMD ["java", "-jar", "target/notesapp-0.0.1-SNAPSHOT.jar"]
