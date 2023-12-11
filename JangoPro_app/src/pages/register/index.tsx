import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import logoImg from "../../../public/images/logo.png";
import { Flex, Text, Center, Input, Button, Select, FormControl } from "@chakra-ui/react";

import Link from "next/link";

import { AuthContext } from '../../context/AuthContext'
import { canSSRGuest } from "@/src/utils/canSSRGuest";

import InputMask from 'react-input-mask';
import { setupAPIClient } from "@/src/services/api";

export default function Register() {

  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [users, setUsers] = useState([]);
  const [userAdmin, setUserAdmin] = useState<string | undefined>(undefined);

  const apiClient = setupAPIClient();

  useEffect(() => {

    // Faça a chamada para buscar os dados de usuários
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get("/users"); // Substitua pelo endpoint correto da API
        if (response.data) {
          setUsers(response.data);
        }
        
      } catch (error) {
        console.error("Erro ao buscar dados de usuários:", error);
      }
    };

    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);
  
  async function handleRegister() {
    if (name === '' || email === '' || password === '') {
      return;
    }

    // Dependendo do tipo de usuário selecionado, preencha os campos apropriados
    const userData = {
      name,
      email,
      telefone,
      endereco,
      password,
      userType,
      userAdmin, 
    };

    if (userType === "client" && userAdmin !== null) {
      userData.telefone = telefone;  
      userData.endereco = endereco;
      userData.userAdmin = userAdmin;
    }
    await signUp(userData);
  }

  return (
    <>
      <Head>
        <title>Cria sua conta no JangoPRO</title>
      </Head>
      <Flex
        background="jango.900"
        height="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <Flex width={640} direction="column" p={14} rounded={8}>
          <Center p={4}>
            <Image
              src={logoImg}
              quality={100}
              width={240}
              alt="Logo JangoPro"
            />
          </Center>
          <Select
            background="jango.400"
            variant="filled"
            size="lg"
            placeholder="Selecione o tipo de usuário"
            color="orange.400"
            mb={3}
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="client">Cliente = Marcar Horários</option>
            <option value="admin">Adminstrador = Cadastrar Barbearia</option>
          </Select>

          {userType && (
            <>
              <Input
                background="jango.400"
                variant="filled"
                size="lg"
                placeholder={userType === "client" ? "Nome Completo" : "Nome da Barbearia"}
                type="text"
                color="#fff"
                mb={3}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {userType === "admin" && (
                <FormControl>
                  <Input
                    background="jango.400"
                    variant="filled"
                    size="lg"
                    placeholder="Endereço"
                    type="text"
                    color="#fff"
                    mb={3}
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                  />
                </FormControl>
              )}

              <Input
                background="jango.400"
                variant="filled"
                size="lg"
                placeholder="email@email.com"
                color="#fff"
                type="email"
                mb={3}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                background="jango.400"
                variant="filled"
                size="lg"
                placeholder="********"
                type="password"
                color="#fff"
                mb={3}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {userType === "client" && (
                <FormControl>
                  <InputMask
                    variant="filled"
                    mask="(99) 99999-9999"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    size="lg"
                    type="text"
                    w="100%"
                    bg="gray.900"
                    mb={4}
                    color="white"
                  >
                    {(inputProps: any) => (
                      <Input
                        placeholder="(99) 99999-9999"
                        size="lg"
                        type="text"
                        bg="gray.900"
                        mb={3}
                        {...inputProps}
                      />
                    )}
                  </InputMask>
                </FormControl>
              )} 
              {userType === "client" && (
                <Select
                  background="jango.400"
                  variant="filled"
                  size="lg"
                  color="orange.400"
                  placeholder="Selecione um usuário administrador"
                  value={userAdmin}
                  onChange={(e) => setUserAdmin(e.target.value)}
                >
                  <option disabled></option>
                  {users
                    .filter((user) => user.userType === "admin")
                    .map((adminUser) => (
                      <option key={adminUser.id} value={adminUser.id}>
                        {adminUser.name}
                      </option>
                    ))
                  }

                </Select>
              )}
              <Button
                onClick={handleRegister}
                background="button.cta"
                mb={6}
                mt={6}
                color="gray.900"
                size="lg"
                _hover={{ bg: "#ffb13e" }}
              >
                Cadastrar
              </Button>
            </>
          )}

          <Center mt={2}>
            <Link href="/login">
              <Text cursor="pointer" color="jango.100">
                Já possui uma conta? <strong>Faça login</strong>
              </Text>
            </Link>
          </Center>
        </Flex>
      </Flex >
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {

  return {
    props: {},
  };
})
