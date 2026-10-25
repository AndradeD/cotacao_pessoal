# CotacaoBR - Docker Multi-Stage (Backend + Frontend)

Este diretório contém a infraestrutura Docker para gerar **uma única imagem unificada** com:
- **CotacaoBR_React**: Frontend (React 19 + Vite)
- **CotacaoBR_Java**: Backend (Spring Boot + Java 21)

---

## 🏗️ Como Funciona a Imagem

A imagem utiliza **Multi-Stage Build**:
1. **Estágio 1 (`node:20-alpine`)**: Instala dependências e compila os arquivos estáticos do frontend React gerando a pasta `dist`.
2. **Estágio 2 (`maven:3.9.9-eclipse-temurin-21-alpine`)**: Injeta os arquivos estáticos compilados do React em `src/main/resources/static` do Spring Boot e compila o JAR executável (`app.jar`).
3. **Estágio 3 (`eclipse-temurin:21-jre-alpine`)**: Imagem de execução enxuta e segura (apenas o JRE com usuário não-root) que roda a aplicação final na porta `8080`.

> **Vantagens**:
> - Não precisa de Nginx ou múltiplos contêineres: o Spring Boot entrega a interface web e responde aos endpoints REST (`/api/cotacao/...`).
> - Zero problemas de CORS em produção, pois frontend e backend rodam na mesma origem.
> - Imagem final leve (baseada em Alpine Linux).

---

## 🚀 Como Construir e Rodar

### Opção 1: Usando Docker Compose (Recomendado)

A partir da pasta `init`:
```bash
cd init
docker compose up --build
```

Para rodar em segundo plano (detached mode):
```bash
docker compose up --build -d
```

Para parar o contêiner:
```bash
docker compose down
```

---

### Opção 2: Usando Docker CLI Diretamente

A partir da raiz do projeto (`CotacaoBR`):
```bash
# 1. Gerar a imagem:
docker build -f init/Dockerfile -t cotacaobr:latest .

# 2. Rodar o contêiner:
docker run -d --name cotacaobr-app -p 8080:8080 cotacaobr:latest
```

---

## 🔑 Variáveis de Ambiente Opcionais

Você pode passar variáveis de ambiente ao rodar o contêiner:

| Variável | Padrão | Descrição |
| :--- | :--- | :--- |
| `SERVER_PORT` | `8080` | Porta onde o servidor escuta |
| `BRAPI_TOKEN` | Token do `application.properties` | Token da API da Brapi (para cotações em tempo real e múltiplos tickers) |

Exemplo via Docker CLI com token:
```bash
docker run -d -p 8080:8080 -e BRAPI_TOKEN="seu_token_aqui" --name cotacaobr-app cotacaobr:latest
```

Ou no arquivo `init/docker-compose.yml`, descomentando a linha `- BRAPI_TOKEN=seu_token_aqui`.

---

## 🌐 Acessando a Aplicação

Depois de iniciado o contêiner:
- **Aplicação Web (React UI)**: [http://localhost:8080](http://localhost:8080)
- **API REST (Spring Boot)**:
  - Cotação única: `http://localhost:8080/api/cotacao/PETR4`
  - Múltiplas cotações: `http://localhost:8080/api/cotacao/multiplos?tickers=PETR4,VALE3`
  - Explorar ativos: `http://localhost:8080/api/cotacao/ativos`
