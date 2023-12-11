export class AuthTokenError extends Error{
  constructor(){
    super('Erro na autenticação do token.')
  }
}