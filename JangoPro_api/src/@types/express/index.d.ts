declare namespace Express {
    export interface Request {
      user_id?: string;  // Propriedade para identificar usuários (donos da barbearia)
      client_id?: string; // Propriedade para identificar clientes
    }
  }
  