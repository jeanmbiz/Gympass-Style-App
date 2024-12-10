<h1 align="center" style="font-weight: bold;">Fórum com Sistema de Notificações 💻</h1>

<p align="center">
 <a href="#tech">Tecnologias</a> • 
 <a href="#arch">Arquitetura</a> • 
 <a href="#diagram">Diagrama</a> • 
  <a href="#tests">Testes</a> • 
 <a href="#config">Configuração</a> • 
 <a href="#functions">Funcionalidades</a> • 
 <a href="#license">Licensa</a> • 
</p>

<p align="center"> <b>Este projeto é uma API que simula um aplicativo estilo Gympass, permitindo aos usuários se cadastrar, autenticar e realizar check-ins em academias próximas, seguindo regras de negócio específicas para garantir segurança e consistência. A aplicação inclui funcionalidades como busca de academias por localização ou nome, gerenciamento de check-ins e histórico do usuário, além de suporte para administradores cadastrarem novas academias e validarem check-ins. Construída com tecnologias modernas como <em>Fastify</em>, <em>Prisma</em>, e <em>PostgreSQL</em>, a API oferece autenticação segura com JWT, controle de permissões (RBAC), e persistência robusta de dados, sendo ideal para aplicações escaláveis e seguras.</b> </p>

<h2 id="tech">🛠️ Tecnologias</h2>

- ⚡ **Fastify**
- 🐳 **Docker**
- 🛠️ **Prisma**
- 🐘 **PostgreSQL**
- 🔐 **JWT**
- ♻️ **Refresh Token**
- 🏷️ **RBAC** 
- 📏 **ZOD** 
- 🧪 **Vitest** 
- 🚀 **E muito mais!**

<h2 id="arch">📐 Arquitetura e Design de Software</h2>

- Domain-driven Design (DDD)
- SOLID
- Design Patterns: Repository Pattern e Factory Pattern.
  
<h2 id="diagram">📊 Diagrama do Projeto</h2>

![diagrama](/src/utils//readme/diagram.png)

<h2 id="tests">🧪 Testes Unitários </h2>

![testesUnitários](/src/utils/readme/unit-tests.png)

<h2 id="">🧪 Testes E2E </h2>

![testese2e](/src/utils/readme/e2e-tests.png)

<h2 id="config">⚙️ Configuração do Ambiente</h2>

1. **Clone o Repositório**:
   ```bash
   git clone git@github.com:jeanmbiz/Gympass-Style-App.git
   ```

2. **Crie o Banco de dados e Configure as Variáveis de ambiente**:
   - Configure as variáveis de ambiente no arquivo `.env` utilizando o arquivo `.env.example` como base para preencher as credenciais necessárias.

3. **Suba Dependências Docker**:
   ```bash
   docker compose up -d
   ```

4. **Instale as Dependências do Projeto**:
   ```bash
   npm install
   ```

5. **Execute as Migrações**:
   ```bash
   npx prisma migrate dev
   ```

6. **Iniciar a Aplicação**:
   ```bash
   npm run start:dev
   ```

7. **Executar Testes Unitários**:
   ```bash
   npm run test
   ```

8. **Executar Testes e2e**:
   ```bash
   npm run test:e2e
   ```

<h2 id="functions">✨ Funcionalidades Principais</h2>

1. **Cadastro e Autenticação**:
   - Registrar usuários no sistema.
   - Realizar autenticação para acesso ao sistema.

2. **Perfil e Histórico**:
   - Obter o perfil de um usuário logado.
   - Obter o número de check-ins realizados pelo usuário logado.
   - Consultar o histórico de check-ins do usuário.

3. **Localização de Academias**:
   - Buscar academias próximas até 10 km.
   - Buscar academias pelo nome.

4. **Check-ins em Academias**:
   - Realizar check-in em uma academia.
   - Validar o check-in de um usuário (administradores).

5. **Gerenciamento de Academias**:
   - Cadastrar novas academias (somente administradores).

6. **Regras de Validação**:
   - Garantir que usuários não façam check-in a mais de 100 metros da academia.
   - Restringir check-ins duplicados no mesmo dia.
   - Limitar a validação de check-ins a até 20 minutos após a criação.
  
7. **Persistência e Segurança**:
   - Criptografar a senha dos usuários.
   - Persistir dados em um banco de dados PostgreSQL.
   - Identificar usuários por JWT (JSON Web Token).
   - Paginar todas as listas de dados com 20 itens por página.

  
<h2 id="license">📃 Licença</h2>

Este projeto está sob a licença [MIT](/src/utils/readme/LICENSE) license