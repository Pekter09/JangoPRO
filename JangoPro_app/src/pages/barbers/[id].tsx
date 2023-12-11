import { useState, ChangeEvent } from "react";
import Head from "next/head";
import {
  Flex,
  Text,
  Heading,
  Button,
  useMediaQuery,
  Input,
  Stack,
  Switch,
} from "@chakra-ui/react";

import { FiChevronLeft } from "react-icons/fi";
import Link from "next/link";
import { Sidebar } from "@/src/components/sidebar";
import { setupAPIClient } from "@/src/services/api";
import { canSSRAuth } from "@/src/utils/canSSRAuth";

interface BarberProps {
  id: string;
  name: string;
  haircuts: string[];
}

interface EditBarberProps {
  barber: BarberProps;
}

export default function EditBarber({ barber }: EditBarberProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  const [name, setName] = useState(barber?.name);

  async function handleUpdate() {
    if (name === "") {
      return;
    }
    try {
      const apiClient = setupAPIClient();
      await apiClient.put("/barber", {
        name: name,
        barber_id: barber?.id,
      });

      alert("Barbeiro Atualizado");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Head>
        <title>Editando barbeiro - JangoPRO</title>
      </Head>
      <Sidebar  userType='admin'>
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
            mb={isMobile ? 4 : 0}
          >
            <Link href="/barbers">
              <Button
                mr={3}
                p={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FiChevronLeft size={24} />
                Voltar
              </Button>
            </Link>

            <Heading fontSize={isMobile ? "22px" : "3xl"} color="orange.900">
              Editar barbeiro
            </Heading>
          </Flex>

          <Flex
            mt={4}
            maxW="700px"
            pt={8}
            pb={8}
            w="100%"
            bg="jango.400"
            direction="column"
            align="center"
            justify="center"
          >
            <Heading fontSize={isMobile ? "22px" : "3xl"} mb={4} color="#FFF">
              Editar barbeiro
            </Heading>

            <Flex w="85%" direction="column">
              <Input
                placeholder="Nome do barbeiro"
                bg="gray.900"
                mb={3}
                size="lg"
                type="text"
                w="100%"
                color="#FFF"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Button
                mb={6}
                w="100%"
                bg="button.cta"
                color="gray.900"
                _hover={{ bg: "#FFB13e" }}
                onClick={handleUpdate}
              >
                Salvar
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const { id } = ctx.params;

  try {
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get("/barber/detail", {
      params: {
        barber_id: id,
      },
    });

    return {
      props: {
        barber: response.data,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      redirect: {
        destination: "/barbers",
        permanent: false,
      },
    };
  }
});
