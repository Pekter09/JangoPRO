import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { Flex, Text, Heading, Box, Input, Button } from "@chakra-ui/react";
import { Sidebar } from "../../components/sidebar";

import Link from "next/link";
import { canSSRAuth } from "@/src/utils/canSSRAuth";
import { setupAPIClient } from "@/src/services/api";
import { AuthContext } from "@/src/context/AuthContext";

interface UserProps {
  id: string;
  name: string;
  userType: string;
  email: string;
  telefone: string;
  endereco: string;
  userAdmin: string;
}

interface ProfileProps {
  user: UserProps;
  premium: boolean;
}

export default function Profile({ user, premium }: ProfileProps) {
  const { logoutUser } = useContext(AuthContext);

  const [name, setName] = useState(user && user?.name);
  const [endereco, setEndereco] = useState(
    user?.endereco ? user?.endereco : ""
  );
  const [telefone, setTelefone] = useState(user.telefone);
  const [userAdmin, setUserAdmin] = useState(user ? user.userAdmin : "");
  const [userAdminName, setUserAdminName] = useState("");

  useEffect(() => {
    if (user && user.userAdmin) {
      const apiClient = setupAPIClient();
      apiClient.get(`/users`)
      .then((response) => {
        const users = response.data;
        const userAdmin = users.find(u => u.id === user.userAdmin);
        
        if (userAdmin) {
          setUserAdminName(userAdmin.name);
        }
      })
        .catch((error) => {
          console.error("Erro ao buscar o nome do userAdmin:", error);
        });
    }
  }, [user]);
  

  async function handleLogout() {
    await logoutUser();
  }
  async function handleUpdateUser() {
    if (name === "") {
      return;
    }

    try {
      const apiClient = setupAPIClient();
      await apiClient.put("/users", {
        name: name,
        telefone: telefone, // Inclua o telefone no objeto, se necessário
        endereco: endereco,
      });

      alert("Dados alterados com sucesso!");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Head>
        <title>Minha Conta - JangoPRO</title>
      </Head>
      <Sidebar userType={user.userType}>
        <Flex
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Flex
            w="100%"
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Heading fontSize="3xl" mt={4} mb={4} mr={4} color="orange.900">
              Minha Conta
            </Heading>
          </Flex>

          <Flex
            pt={8}
            pb={8}
            background="jango.400"
            maxW="700px"
            w="100%"
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Flex direction="column" w="85%">
              <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                {user.userType === 'client' ? 'Nome:' : 'Nome da barbearia:'}
              </Text>
              <Input
                w="100%"
                color="white"
                background="gray.900"
                placeholder={
                  user.userType === 'client' ? 'Nome:' : 'Nome da barbearia:'
                }
                size="lg"
                type="text"
                mb={3}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {user.userType === 'client' ? (
                <>
                  <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                    Telefone:
                  </Text>
                  <Input
                    color="white"
                    w="100%"
                    background="gray.900"
                    placeholder="Telefone do Cliente"
                    size="lg"
                    type="text"
                    mb={3}
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                    Endereço:
                  </Text>
                  <Input
                    color="white"
                    w="100%"
                    background="gray.900"
                    placeholder="Endereço da barbearia"
                    size="lg"
                    type="text"
                    mb={3}
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                  />
                </>
              )}
              {user.userType === 'client' ? (
                <>
                  <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                    Barbearia Vinculada:
                  </Text>
                  <Input
                    w="100%"
                    color="white"
                    background="gray.900"
                    placeholder="User Admin"
                    size="lg"
                    type="text"
                    mb={3}
                    value={userAdminName}
                    onChange={(e) => setUserAdminName(e.target.value)}
                  />


                </>
              ) : (
                <>
                  <Text mb={2} fontSize="xl" fontWeight="bold" color="white">
                    Plano atual:
                  </Text>

                  <Flex
                    direction="row"
                    w="100%"
                    mb={3}
                    p={1}
                    borderWidth={1}
                    rounded={6}
                    background="jango.900"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text
                      p={2}
                      fontSize="lg"
                      color={premium ? "#FBA931" : "#4dffb4"}
                    >
                      {" "}
                      Plano {premium ? "Premium" : "Grátis"}
                    </Text>

                    <Link href="/planos">
                      <Box
                        cursor="pointer"
                        p={1}
                        pl={2}
                        pr={2}
                        background="#00cd52"
                        rounded={4}
                        color="white"
                      >
                        Mudar plano
                      </Box>
                    </Link>
                  </Flex>

                  <Button
                    w="100%"
                    mt={3}
                    mb={4}
                    bg="button.cta"
                    size="lg"
                    _hover={{ bg: "#ffb13e" }}
                    onClick={handleUpdateUser}
                  >
                    Salvar
                  </Button>
                </>
              )}
              <Button
                w="100%"
                mb={6}
                bg="transparent"
                borderWidth={2}
                borderColor="red.500"
                color="red.500"
                size="lg"
                _hover={{ bg: "transparent" }}
                onClick={handleLogout}
              >
                Sair da conta
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/me");
    const userData = response.data;

    const user = {
      id: response.data.id,
      name: response.data.name,
      userType: response.data.userType,
      telefone: response.data.telefone,
      email: response.data.email,
      endereco: response.data?.endereco,
      userAdmin: response.data?.userAdmin,
    };
 
    return {
      props: {
        user: user,
        premium:
          response.data?.subscriptions?.status === "active" ? true : false,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
});
