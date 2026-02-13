# 🧮 Matemática Mais - Cloud & DevOps Edition

<div align="center">
  <img src="app/assets/icon.png" width="100" height="100" alt="Logo Matemática Mais">
  <p><em>Transformando a educação através da Engenharia de Cloud e Práticas DevOps</em></p>
</div>

---

## 🚀 Sobre o Projeto
O **Matemática Mais** é uma plataforma educacional gamificada projetada para tornar o aprendizado de matemática divertido e acessível. Originalmente um projeto mobile, esta versão foi evoluída para demonstrar **maturidade de engenharia**, utilizando uma arquitetura moderna baseada em Cloud, Automação e Infraestrutura como Código.

Este repositório serve como um portfólio técnico para **DevOps / Cloud Engineering**, demonstrando a integração entre desenvolvimento mobile e infraestrutura escalável.

---

## 🏗️ Arquitetura do Sistema
O projeto utiliza uma arquitetura **Serverless-First** na AWS, garantindo alta disponibilidade e baixo custo.

| Componente | Tecnologia | Função |
| :--- | :--- | :--- |
| **Frontend Mobile** | React Native (Expo) | Interface do usuário e gamificação |
| **Backend API** | Node.js (Express) | Lógica de negócio e integração |
| **Infraestrutura** | Terraform (IaC) | Provisionamento automatizado na AWS |
| **Containerização** | Docker | Padronização do ambiente de backend |
| **CI/CD** | GitHub Actions | Pipeline de integração e entrega contínua |
| **Banco de Dados** | DynamoDB | Armazenamento NoSQL escalável |
| **Serverless** | AWS Lambda | Execução de código sem servidor |

---

## 🛠️ Tecnologias e Conceitos DevOps

### 1. Infraestrutura como Código (Terraform)
Toda a infraestrutura AWS é definida na pasta `/terraform`. Isso permite que o ambiente seja replicado de forma idêntica em segundos.
- **Recursos provisionados:** S3, DynamoDB, Lambda, API Gateway, IAM Roles e CloudWatch.
- **Benefícios:** Versionamento de infraestrutura, redução de erros manuais e agilidade no deploy.

### 2. Containerização (Docker)
O backend está preparado para rodar em containers, garantindo que o código funcione da mesma forma em qualquer ambiente.
- **Dockerfile:** Otimizado com multi-stage build para reduzir o tamanho da imagem final.
- **Portabilidade:** Pronto para ser implantado em serviços como AWS ECS ou EKS.

### 3. CI/CD (GitHub Actions)
Automatizamos o ciclo de vida do software com pipelines que rodam a cada push:
- **Lint & Validate:** Verifica a sintaxe do Terraform.
- **Build & Test:** Garante que o backend está íntegro.
- **Docker Build:** Valida a criação da imagem do container.

---

## 📂 Estrutura do Repositório
```bash
matematica-mais/
├── .github/workflows/   # Pipelines de CI/CD
├── app/                 # Código fonte do aplicativo Mobile (React Native)
├── backend/             # API Node.js e Dockerfile
│   ├── src/             # Lógica da API
│   └── Dockerfile       # Definição do container
├── terraform/           # Infraestrutura como Código (AWS)
│   ├── main.tf          # Recursos principais
│   ├── variables.tf     # Variáveis de ambiente
│   └── outputs.tf       # Saídas da infraestrutura
└── README.md            # Documentação técnica
```

---

## 🚀 Como Executar

### Backend (Docker)
```bash
cd backend
docker build -t matematica-mais-backend .
docker run -p 3000:3000 matematica-mais-backend
```

### Infraestrutura (Terraform)
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### Mobile App
```bash
cd app
npm install
npx expo start
```

---

## 👨‍💻 Autor
**Luis Fernando Alexandre dos Santos**  
Engenheiro de Computação | DevOps Engineer | Cloud Engineer (AWS)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/luisfernando-eng)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/luisFernandoJv)

---
<div align="center">
  <b>Desenvolvido com foco em automação e escalabilidade.</b>
</div>
