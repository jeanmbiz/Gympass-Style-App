# App

Gympass Style App

## RFs (Requisitos Funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar
- [x] Deve ser possível obter o perfil de um usuário logado
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado
- [x] Deve ser possível o usuário obter seu histórico de check-ins
- [x] Deve ser possível o usuário buscar academias próximas até 10km
- [x] Deve ser possível o usuário buscar academias pelo nome
- [x] Deve ser possível o usuário realizar check-in em uma academia
- [x] Deve ser possível validar o check-in de um usuário
- [x] Deve ser possível cadastrar uma academia

## RNs (Regras de Negócio)

- [x] O usuário não deve poder se cadastrar com um email duplicado
- [x] O usuário não pode fazer 2 check-ins no mesmo dia
- [x] O usuário não pode fazer check-in se nao estiver perto (100m) da academia
- [x] O Check-in só pode ser validado até 20 min após ser criado
- [x] O check-in só pode ser validado por administradores
- [x] A academia só poder ser cadastrada por administradores

## RNFs (Requisitos Não-Funcionais)

- [x] A senha do usuário precisa estar criptografada
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL
- [x] Todas as listas de dados precisam estar paginadas com 20 itens por página
- [x] O usuário pode ser identificado por um JWT (JSON WEB TOKEN)

- [ ] Tirar comentários desnecessários do código - limpeza de código