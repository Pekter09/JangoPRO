import { createContext, ReactNode, useEffect, useState } from 'react'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import Router from 'next/router'

import { api } from '../services/apiClient'

interface AuthContextData {
  user: UserProps | null;
  userId: string | undefined; // Defina userId como uma string
  userType: string;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signUp: (credentials: SignUpProps) => Promise<void>;
  logoutUser: () => Promise<void>;
}

interface UserProps {
  id: string;
  name: string;
  userType: string;
  email: string;
  endereco: string | null;
  subscriptions?: SubscriptionProps | null;
  userAdmin?: string;
  userId?: string;
}

interface SubscriptionProps {
  id: string;
  status: string;
}

type AuthProviderProps = {
  children: ReactNode;
}
//login
interface SignInProps {
  email: string;
  password: string;
}
// cadastro
interface SignUpProps {
  name: string;
  userType: string;
  email: string;
  password: string;
  telefone?: string; // Adicione os campos específicos do cliente
  endereco?: string; // Adicione os campos específicos do administrador
  userAdmin?: string;

}


export const AuthContext = createContext({} as AuthContextData)


export function signOut() {
  console.log("Erro no Logout");
  try {
    destroyCookie(null, '@jango.token', { path: '/' })
    Router.push('/login');

  } catch (err) {
    console.log("Error ao sair")
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>()
  const [userType, setUserType] = useState<string | undefined>(undefined);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { '@jango.token': token } = parseCookies();
  
    if (token) {
      api.get('/me').then(response => {
        const { id, name, userType, endereco, email, subscriptions, userId } = response.data;
        setUser({
          id,
          name,
          userType,
          email,
          endereco,
          subscriptions,
          userId: id, // Defina o userId dentro do objeto do usuário

        });
        setUserType(userType); // Defina o userType quando o usuário é carregado
      })
        .catch(() => {
          signOut();
        });
    }
  }, []);
  

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post("/session", {
        email,
        password,
      });

      const { id, name, token, subscriptions, endereco, userType } = response.data;

      setCookie(undefined, '@jango.token', token, {
        path: '/'
      });

      setUser({
        id,
        name,
        userType,
        email,
        endereco,
        subscriptions
      });

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      Router.push('/dashboard');
      // Redireciona para o painel do administrador
    } catch (err) {
      console.log("Erro ao entrar", err);
    }
  }



  async function signUp({ name, userType, email, password, telefone, endereco, userAdmin }: SignUpProps) {
    try {
      const data: SignUpProps = {
        name,
        email,
        password,
        userType,
      };
  
      if (userType === 'client' && telefone) {
        data.telefone = telefone;
      } else if (userType === 'admin' && endereco) {
        data.endereco = endereco;
      }
  
      if (userAdmin) {
        data.userAdmin = userAdmin;
      }
  
      const response = await api.post('users', data);
  
      Router.push('login');
    } catch (err) {
      console.log(err);
    }
  }
  

  async function logoutUser() {
    try {
      destroyCookie(null, '@jango.token', { path: '/' })
      Router.push('/login')
      setUser(null)
    } catch (err) {
      console.log("Erro ao sair");

    }
  }
  return (
    <AuthContext.Provider value={{
      user,
      userId: user ? user.userId : undefined,
      userType,
      isAuthenticated,
      signIn,
      signUp,
      logoutUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
