# ---------- Stage 1: Build the Spring Boot app ----------
FROM maven:3.9.3-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy only the pom first to leverage Maven caching
COPY pom.xml .
# Download dependencies (cached if pom.xml hasn't changed)
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the jar (skip tests for faster build; remove -DskipTests for prod)
RUN mvn clean package -DskipTests

# ---------- Stage 2: Create a minimal runtime image ----------
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/target/ecommerce-category-service-1.0.0.jar app.jar

# Expose the Spring Boot default port
EXPOSE 8080

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]