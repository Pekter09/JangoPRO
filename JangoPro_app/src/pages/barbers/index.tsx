import { useState, useEffect } from "react";
import Head from "next/head";
import { Sidebar } from "../../components/sidebar";
import {
  Flex,
  Text,
  Heading,
  Button,
  useMediaQuery,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import Link from "next/link";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";
import { useRouter } from "next/router";

const listItemStyle = {
  marginBottom: "20px",
  padding: "20px",
  backgroundColor: "#1b1c29",
  borderRadius: "8px",
  color: "white",
};

const buttonStyle = {
  marginTop: "10px",
  backgroundColor: "#ffffff",
  color: "#000000",
  borderRadius: "4px",
  padding: "8px 16px",
  border: "none",
  cursor: "pointer",
};

export default function Barbers({ barbers, idUser }) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  const [barbersList, setBarbersList] = useState(barbers);
  const router = useRouter();

  const handleDisableBarber = async (barberId) => {
    try {
      const apiClient = setupAPIClient();
      await apiClient.delete(`/barbers/${barberId}`);
      const updatedBarbers = barbersList.filter(
        (barber) => barber.id !== barberId
      );
      setBarbersList(updatedBarbers);
    } catch (error) {
      console.error("Erro ao desativar o barbeiro: ", error);
    }
  }

  return (
    <>
      <Head>
        <title>Barbeiros Cadastrados - Minha barbearia</title>
      </Head>
      <Sidebar userType="admin">
        <Flex
          direction="column"
          alignItems="flex-start"
          justifyContent="flex-start"
        >
          <Flex
            direction={isMobile ? "column" : "row"}
            w="100%"
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent="flex-start"
            mb={0}
          >
            <Heading
              fontSize={isMobile ? "28px" : "3xl"}
              mt={4}
              mb={4}
              mr={4}
              color="orange.900"
            >
              Barbeiros Cadastrados
            </Heading>

            <Link href="barbers/new">
              <Button style={buttonStyle}>Adicionar Barbeiro</Button>
            </Link>
          </Flex>

          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            {barbersList.map((barber) => (
              <div key={barber.id} style={listItemStyle}>
                <Heading fontSize="2xl" mb="2" color="orange.900">
                  {barber.nome}
                </Heading>
                <Text fontSize="lg" mb="2">
                  <Text color="orange.200" fontWeight="bold">Telefone:</Text> {barber.telefone}
                </Text>
                <Text fontSize="lg" mb="2">
                  <Text color="orange.200" fontWeight="bold">Email:</Text> {barber.email}
                </Text>
                {barber.haircuts && barber.haircuts.length > 0 && (
                  <div>
                    <Text fontSize="lg">
                      <Text color="orange.200" fontWeight="bold">Corte(s) selecionado(s):</Text>{' '}
                      {barber.haircuts.map((haircut, index) => (
                        <span key={haircut.id}>
                          {haircut.name}
                          {index < barber.haircuts.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </Text>
                  </div>
                )}
                <Button onClick={() => handleDisableBarber(barber.id)} style={buttonStyle}>
                  Desativar Barbeiro
                </Button>
              </div>
            ))}
          </SimpleGrid>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);

    const [barbersResponse, haircutsResponse, meResponse] = await Promise.all([
      apiClient.get("/barbers"),
      apiClient.get("/haircuts"),
      apiClient.get("/me"),
    ]);

    const barbers = barbersResponse.data || [];
    const haircutsData = haircutsResponse.data || [];
    const meResponseData = meResponse.data || [];
    const idUser = meResponseData.id
    const barbersWithUserId = barbers.filter((barber) => barber.userId === idUser);

    return {
      props: {
        barbers: barbersWithUserId,
        haircutsData: haircutsData,
        idUser: meResponseData.id
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
