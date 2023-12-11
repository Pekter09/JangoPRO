import { useState, ChangeEvent, useEffect } from "react";
import Head from "next/head";
import { Sidebar } from "../../components/sidebar";

import {
  Flex,
  Heading,
  Text,
  Button,
  Input,
  Select,
  Link,
} from "@chakra-ui/react";
import { DatePicker } from "react-rainbow-components";

import { canSSRAuth } from "../../utils/canSSRAuth";
import { setupAPIClient } from "../../services/api";

import { useRouter } from "next/router";
import { FiChevronLeft } from "react-icons/fi";
import { isWeekend } from "date-fns";

interface HaircutProps {
  id: string;
  name: string;
  price: string | number;
  status: boolean;
  user_id: string;
}
interface NewProps {
  haircuts: HaircutProps[];
  userData,
  barbers: BarberProps[]
}

interface BarberProps {
  id: string;
  nome: string;
  haircuts: HaircutProps[];
  userId: string;
}

export default function New({ barbers, userData, haircuts }: NewProps) {
  const [customer, setCustomer] = useState(userData === 'client' ? userData.name : "");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(
    null
  );
  const [selectedHaircuts, setSelectedHaircuts] = useState<string[]>([]);
  const [barberHaircuts, setBarberHaircuts] = useState<HaircutProps[]>([]);


  const router = useRouter();
  useEffect(() => {
    const currentDate = new Date();
    setSelectedDate(currentDate);
    if (userData.userType === 'client') {
      setCustomer(userData.name);
    }
  }, [userData]);


  // Função para validar a data selecionada
  const isDateValid = (date: Date) => {
    if (isWeekend(date)) {
      setErrorMessage("Não é permitido agendar para fins de semana.");
      return false;
    }
    return true;
  };

  // Função para validar o formulário
  const isFormValid = () => {
    if (!customer) {
      setErrorMessage("Por favor, insira o nome do cliente.");
      return false;
    } else if (!selectedBarberId) {
      setErrorMessage("Por favor, selecione um barbeiro.");
      return false;
    } else if (selectedHaircuts.length === 0) {
      setErrorMessage("Por favor, selecione pelo menos um corte.");
      return false;
    }
    setErrorMessage(null);
    return true;
  };
  // Função para validar o nome inserido
  const isNameValid = (name: string) => {
    // Verifique se o nome contém um espaço em branco
    return name.trim().split(" ").length > 1;
  };
  const handleCustomerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCustomer(newName);
    // Verifique se o nome é válido e exiba uma mensagem de erro, se necessário
    if (!isNameValid(newName)) {
      setErrorMessage("Por favor, insira um nome completo.");
    } else {
      setErrorMessage(null); // Remova a mensagem de erro se o nome for válido
    }
  };
  // Função para atualizar os cortes do barbeiro selecionado
  function updateBarberHaircuts(barberId: string) {
    if (barberId) {
      const selectedBarber = barbers.find((barber) => barber.id === barberId);
      if (selectedBarber) {
        const haircutsForSelectedBarber = selectedBarber.haircuts || [];
        setBarberHaircuts(haircutsForSelectedBarber);
      }
    }
  }


  function handleHaircutSelect(haircutId: string) {
    if (selectedHaircuts.includes(haircutId)) {
      setSelectedHaircuts((prevSelections) =>
        prevSelections.filter((id) => id !== haircutId)
      );
    } else {
      setSelectedHaircuts((prevSelections) => [...prevSelections, haircutId]);
    }
  }

  useEffect(() => {
    updateBarberHaircuts(selectedBarberId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBarberId]);

  function generateTimeOptions() {
    const options = [];
    const startTime = 8;
    const endTime = 19;

    for (let hour = startTime; hour <= endTime; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${String(hour).padStart(2, "0")}:${String(
          minute
        ).padStart(2, "0")}`;
        options.push(
          <option key={time} value={time}>
            {time}
          </option>
        );
      }
    }

    return options;
  }
  async function handleRegister() {
    try {
      if (!isFormValid()) {
        return;
      }

      const selectedDateTime = new Date(selectedDate);
      const currentTime = new Date();
      selectedDateTime.setHours(
        Number(selectedTime.split(":")[0]),
        Number(selectedTime.split(":")[1]),
        0,
        0
      );

      if (selectedDateTime < currentTime) {
        setErrorMessage("A data e hora não podem ser anteriores ao momento atual.");
        return;
      }

      const apiClient = setupAPIClient();
      await apiClient.post("/schedule", {
        customer: customer,
        haircut_id: selectedHaircuts,
        barber_id: selectedBarberId,
        date: selectedDate.toISOString(),
        time: selectedTime,
      });

      router.push("/dashboard");
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.error === "Horário não está disponível."
      ) {
        setErrorMessage("Horário Indisponível");
      } else {
        setErrorMessage("Erro ao registrar!");
      }
    }
  }

  return (
    <>
      <Head>
        <title>JangoPro - Novo agendamento</title>
      </Head>
      <Sidebar userType={userData?.userType}>
        <Flex direction="column" align="flex-start" justify="flex-start">
          <Flex direction="row" w="100%" align="center" justify="flex-start">
            <Link href="/dashboard">
              <Button
                p={4}
                display="flex"
                alignItems="center"
                justifyItems="center"
                mr={4}
              >
                <FiChevronLeft size={24} color="#000000" />
                Voltar
              </Button>
            </Link>
            <Heading fontSize="3xl" mt={4} mb={4} mr={4} color="orange">
              Novo serviço
            </Heading>
          </Flex>

          <Flex
            maxW="700px"
            pt={8}
            pb={8}
            width="100%"
            direction="column"
            align="center"
            justify="center"
            bg="jango.400"
          >
            <Text color="white" mb={2}>
              Nome do Cliente:
            </Text>
            <Input
              placeholder="Nome do cliente"
              w="85%"
              mb={3}
              size="lg"
              type="text"
              bg="jango.900"
              color="white"
              value={customer}
              onChange={handleCustomerChange}
            />
            <Text color="white" mb={2}>
              Selecione o Barbeiro:
            </Text>
            <Select
              bg="jango.900"
              color="white"
              mb={3}
              size="lg"
              w="85%"
              onChange={(e) => {
                setSelectedBarberId(e.target.value);
                updateBarberHaircuts(e.target.value);
              }}
            >
              <option
                value=""
                style={{ backgroundColor: "white", color: "black" }}
              >
                Selecione o Barbeiro
              </option>
              {barbers.map((barber) => (
                <option
                  key={barber.id}
                  value={barber.id}
                  style={{ backgroundColor: "white", color: "black" }}
                >
                  {barber.nome}
                </option>
              ))}
            </Select>
            <Text color="white" mb={2}>
              Cortes disponíveis para o Barbeiro selecionado:
            </Text>
            <Select
              bg="jango.900"
              color="white"
              mb={3}
              size="lg"
              w="85%"
              onChange={(e) => handleHaircutSelect(e.target.value)}
            >
              <option
                value=""
                style={{ backgroundColor: "white", color: "black" }}
              >
                Selecione um Corte
              </option>
              {barberHaircuts.map((haircut) => (
                <option
                  key={haircut.id}
                  value={haircut.id}
                  style={{ backgroundColor: "white", color: "black" }}
                >
                  {haircut.name}
                </option>
              ))}
            </Select>
            <Flex w="90%" mb={3}>
              <Flex
                flexDirection="row"
                alignItems="center"
                style={{
                  width: "90%",
                  marginRight: "auto",
                  marginLeft: "auto",
                }}
              >
                <Text mr={4} mt="2" color="white">
                  Horário:
                </Text>
                <Select
                  bg="jango.900"
                  height="30px"
                  style={{
                    width: "35%",
                    backgroundColor: "white",
                    color: "black",
                    marginTop: "8px",
                  }}
                  size="lg"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  {generateTimeOptions()}
                </Select>
                <Text mx={4} color="white">
                  Dia:
                </Text>
                <DatePicker
                  style={{
                    width: "50%",
                  }}
                  value={selectedDate}
                  onChange={(date) => {
                    if (isDateValid(date)) {
                      setSelectedDate(date);
                    }
                  }}
                />
              </Flex>
            </Flex>

            {errorMessage && (
              <Text color="red" mb={3} fontWeight="bold">
                {errorMessage}
              </Text>
            )}

            <Button
              w="85%"
              size="lg"
              color="gray.900"
              bg="button.cta"
              _hover={{ bg: "#FFb13e" }}
              onClick={handleRegister}
              disabled={isWeekend(selectedDate)}
            >
              Cadastrar
            </Button>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/haircuts", {
      params: {
        status: true,
      },
    });
    const authResponse = await apiClient.get("/me");
    const userData = authResponse.data;
    // Agora você tem o usuário "userAdmin", você pode usar seu ID para buscar os barbeiros e os cortes
    const barbersResponse = await apiClient.get(`/barbers`);

    if (userData.userType === 'client') {
      const barbersForUserAdmin = barbersResponse.data.filter(barber => barber.userId === userData.userAdmin)
      return {
        props: {
          barbers: barbersForUserAdmin,
          userData: userData,
          haircuts: response.data,
        },
      };

    } else {
      const barbersForId = barbersResponse.data.filter(barber => barber.userId === userData.id)
      return {
        props: {
          barbers: barbersForId,
          userData: userData,
          haircuts: barbersResponse.data,
        },
      };
    }

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