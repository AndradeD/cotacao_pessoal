# ==============================================================================
# Dockerfile Multi-Stage: CotacaoBR (Java 21 Spring Boot + React Vite)
# Gera uma única imagem Docker contendo o Backend e o Frontend integrados
# ==============================================================================

# ------------------------------------------------------------------------------
# Estágio 1: Build do Frontend (React + Vite)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copia os manifestos de dependência
COPY CotacaoBR_React/package*.json ./

# Instala as dependências do React
RUN npm install

# Copia os arquivos do frontend e gera a build de produção estática (dist)
COPY CotacaoBR_React/ ./
RUN npm run build

# ------------------------------------------------------------------------------
# Estágio 2: Build do Backend (Spring Boot + Java 21)
# ------------------------------------------------------------------------------
FROM maven:3.9.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend

# Copia o pom.xml e baixa dependências para aproveitar cache de camadas
COPY CotacaoBR_Java/pom.xml .
RUN mvn dependency:go-offline -B || true

# Copia o código-fonte do backend
COPY CotacaoBR_Java/src ./src

# Injeta a build do frontend React diretamente na pasta de recursos estáticos do Spring Boot.
# Com isso, o servidor Spring Boot entrega tanto a API (/api/cotacao/...) quanto a UI React (/)
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# Compila e empacota a aplicação gerando o JAR final executável
RUN mvn clean package -DskipTests -B && \
    cp target/CotacaoBR-*.jar app.jar

# ------------------------------------------------------------------------------
# Estágio 3: Imagem Final de Execução (JRE 21 Alpine)
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

# Criação de usuário não-root por boas práticas de segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copia apenas o JAR gerado no estágio anterior
COPY --from=backend-builder /app/backend/app.jar app.jar

# Define permissões e usuário de execução
RUN chown appuser:appgroup app.jar
USER appuser

# Porta padrão de escuta da aplicação
EXPOSE 8080

# Otimizações de memória JVM para ambiente em contêiner
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Comando de inicialização do contêiner
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
