# 📱 Matemática+ | Aplicativo Educacional Android

> Plataforma educacional mobile com arquitetura serverless AWS, aplicando conceitos de Cloud Computing, DevOps e Full Stack Development.

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=FF9900)](https://aws.amazon.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Serverless](https://img.shields.io/badge/Serverless-FD5750?style=for-the-badge&logo=serverless&logoColor=white)](https://www.serverless.com/)

## 📋 Sobre o Projeto

**Matemática+** é um aplicativo Android educacional voltado ao ensino de matemática por meio de quizzes interativos e gamificação. Desenvolvido com arquitetura cloud-native serverless, o projeto demonstra a aplicação prática de conceitos de **Engenharia de Computação**, **DevOps** e **Cloud Engineering**.

### 🎯 Características Principais

- 📚 **Quizzes interativos** de matemática com diferentes níveis de dificuldade
- 🎮 **Gamificação** para engajamento e progressão do usuário
- 🏗️ **Arquitetura escalável** preparada para expansão (ciências, conhecimentos gerais)
- 🔐 **Autenticação segura** com Amazon Cognito
- ☁️ **100% Serverless** na AWS
- 📊 **Baixo acoplamento** e alta manutenibilidade

### 📱 Status do Projeto

> **Fase atual:** Testes internos  
> **Próximo milestone:** Publicação na Google Play Store

---

## 🏗️ Arquitetura

O projeto utiliza arquitetura **serverless** moderna, eliminando a necessidade de gerenciamento de servidores e proporcionando escalabilidade automática.

```
┌─────────────────┐
│  React Native   │
│   (Frontend)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │ ◄─── Autenticação (Cognito)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AWS Lambda     │ ◄─── Funções serverless
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────────┐ ┌─────────┐
│DynamoDB │ │   S3    │
└─────────┘ └─────────┘
```

### 🛠️ Stack Tecnológica

#### **Frontend Mobile**

- **React Native** - Framework cross-platform
- **JavaScript/TypeScript** - Linguagens de desenvolvimento
- **Expo** (se aplicável) - Ferramenta de desenvolvimento

#### **Backend & Cloud (AWS)**

| Serviço            | Função                                    |
| ------------------ | ----------------------------------------- |
| **Amazon Cognito** | Autenticação e gerenciamento de usuários  |
| **AWS Lambda**     | Funções serverless para regras de negócio |
| **API Gateway**    | Endpoints REST e roteamento               |
| **DynamoDB**       | Banco de dados NoSQL                      |
| **S3**             | Armazenamento de recursos estáticos       |
| **CloudWatch**     | Monitoramento e logs                      |
| **IAM**            | Controle de acesso e permissões           |

#### **DevOps & Ferramentas**

- Git/GitHub - Versionamento de código
- CI/CD - Automação de deploy (GitHub Actions / CodePipeline)
- Infrastructure as Code - CloudFormation / Serverless Framework
- Jest - Testes unitários

---

## 💼 Responsabilidades Técnicas

### **Desenvolvimento Mobile**

- Desenvolvimento do aplicativo com **React Native**
- Implementação de UI/UX focada em performance e experiência do usuário
- Integração com APIs REST do backend
- Gerenciamento de estado e navegação

### **Cloud Engineering & Backend**

- Definição da arquitetura serverless na AWS
- Desenvolvimento de **APIs REST** escaláveis
- Implementação de autenticação/autorização com **Cognito**
- Modelagem de dados no **DynamoDB** (chave-valor, índices secundários)
- Desenvolvimento de **Lambda functions** em Node.js/Python
- Configuração do **API Gateway** para roteamento

### **DevOps & Infraestrutura**

- Aplicação de princípios **CI/CD** para automação de deploys
- Provisionamento de infraestrutura como código (IaC)
- Configuração de políticas IAM seguindo princípio de **least privilege**
- Implementação de monitoramento e observabilidade
- Otimização de custos cloud

### **Segurança**

- Autenticação JWT com Amazon Cognito
- Criptografia de dados em trânsito (HTTPS) e em repouso
- Validação de entrada e sanitização de dados
- Implementação de rate limiting e proteção contra ataques

---

## 🚀 Funcionalidades Implementadas

- [x] Sistema de autenticação completo (registro, login, recuperação de senha)
- [x] Catálogo de quizzes de matemática
- [x] Sistema de pontuação e ranking
- [x] Perfil de usuário com histórico de desempenho
- [x] Armazenamento persistente de progresso
- [x] Interface responsiva e intuitiva
- [x] Backend serverless escalável
- [x] APIs REST documentadas

### 🔜 Roadmap

- [ ] Publicação na Google Play Store
- [ ] Expansão para outras disciplinas (Ciências, Conhecimentos Gerais)
- [ ] Sistema de conquistas e badges
- [ ] Modo multiplayer/competitivo
- [ ] Análise de performance com machine learning
- [ ] Versão iOS (React Native)

---

## 📚 Conceitos Aplicados

Este projeto demonstra aplicação prática de:

### **Engenharia de Software**

- Clean Code e boas práticas de programação
- Arquitetura orientada a serviços (SOA)
- Princípios SOLID
- Separação de responsabilidades (concerns)

### **Cloud Computing**

- Arquitetura serverless
- Auto-scaling e alta disponibilidade
- Pay-as-you-go (otimização de custos)
- Serviços gerenciados (managed services)

### **DevOps**

- Continuous Integration / Continuous Deployment
- Infrastructure as Code
- Monitoramento e observabilidade
- Automação de processos

### **Segurança**

- Autenticação e autorização
- Princípio de least privilege
- Criptografia de dados
- HTTPS/TLS

---

## 📊 Resultados e Aprendizados

### **Consolidação de Conhecimentos**

✅ Experiência prática em **Cloud Engineering** e **DevOps**  
✅ Ciclo completo de desenvolvimento: **Frontend → Backend → Infraestrutura**  
✅ Arquitetura moderna orientada a **microsserviços serverless**  
✅ Integração entre **tecnologia e educação**

### **Competências Desenvolvidas**

- Desenvolvimento mobile com React Native
- Arquitetura e implementação de soluções AWS
- APIs REST escaláveis e seguras
- Modelagem de dados NoSQL
- Automação e CI/CD
- Pensamento orientado a custos e performance

### **Impacto Técnico**

- ⚡ **Escalabilidade automática** para milhares de usuários simultâneos
- 💰 **Custo otimizado** com pay-per-use (serverless)
- 🔒 **Segurança enterprise** com Cognito + IAM
- 📈 **Monitoramento em tempo real** com CloudWatch
- 🚀 **Deploy automatizado** via CI/CD

---

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como aplicação prática dos conhecimentos adquiridos em **Engenharia de Computação**, com ênfase em:

- Cloud Computing e Arquitetura de Sistemas
- Desenvolvimento Full Stack
- Práticas DevOps e SRE
- Engenharia de Software
- Fundamentos matemáticos aplicados à computação

---

## 👨‍💻 Autor

**Luis Fernando Alexandre dos Santos**  
Engenheiro de Computação | DevOps Engineer | Cloud Engineer (AWS)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/luisfernando-eng)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/luisFernandoJv)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:luizfer.12321@gmail.com)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🤝 Contribuições

Atualmente, este é um projeto educacional em desenvolvimento individual. Sugestões e feedback são bem-vindos!

---

<div align="center">
  
**Desenvolvido com 💙 aplicando engenharia de software moderna**

_"Integrando tecnologia, educação e cloud computing"_

</div>
