# ---------- Stage 1: Build the application ----------
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests


# ---------- Stage 2: Run the application ----------
FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# Copy the built jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose Spring Boot port
EXPOSE 8080

# Run the Spring Boot app
ENTRYPOINT ["java","-jar","app.jar"]