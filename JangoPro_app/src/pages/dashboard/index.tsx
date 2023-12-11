import { useState, useEffect } from "react";
import Head from "next/head";
import { format, parseISO } from "date-fns";

import {
  Flex,
  Text,
  Heading,
  Button,
  Link as ChakraLink,
  useMediaQuery,
  useDisclosure,
} from "@chakra-ui/react";

import Link from "next/link";
import { IoMdPerson } from "react-icons/io";

import { canSSRAuth } from "../../utils/canSSRAuth";
import { Sidebar } from "../../components/sidebar";
import { setupAPIClient } from "../../services/api";

import { ModalInfo } from "../../components/modal";

import ServiceCalendar from "../../components/calendar";


interface HaircutProps {
  id: string;
  name: string;
  price: string | number;
  status: boolean;
  user_id: string;
}

interface BarberProps {
  id: string;
  nome: string;
}

export interface ScheduleItem {
  id: string;
  customer: string;
  haircut: HaircutProps;
  date: string;
  time: string;
  timeDifference: number;
  barber: BarberProps;
}

interface DashboardProps {
  schedule: ScheduleItem[];
  barbers: BarberProps[];
}

export default function Dashboard({ schedule, barbers, userData }) {
  const [list, setList] = useState(schedule);
  const [service, setService] = useState(undefined);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedAdminData, setSelectedAdminData] = useState(null);

  const [isMobile] = useMediaQuery("(max-width: 500px)");

  useEffect(() => {
    const updatedList = schedule.map((item) => ({
      ...item,
      date: format(parseISO(item.date), "dd/MM/yyyy"),
      time: extractTimeFromDateTime(item.date),
      timeDifference: Math.abs(
        parseISO(item.date).getTime() - new Date().getTime()
      ),
    }));

    updatedList.sort((a, b) => a.timeDifference - b.timeDifference);

    setList(updatedList);
  }, [schedule, barbers]);


  function handleOpenModal(item) {
    setService(item);
    onOpen();

    // Faça uma solicitação para obter os dados do administrador com base no 'user_id' do serviço
    const selectedAdmin = barbers.find((barber) => barber.id === item.user_id);

    setSelectedAdminData(selectedAdmin);

  }


  async function handleFinish(id) {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.delete("/schedule", {
        params: {
          schedule_id: id,
        },
      });

      const updatedList = list.filter((item) => item.id !== id);
      setList(updatedList);
      onClose();
    } catch (err) {
      console.log(err);
      onClose();
      alert("Erro ao finalizar este serviço");
    }
  }

  function extractTimeFromDateTime(dateTime) {
    const dateObj = new Date(dateTime);
    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <>
      <Head>
        <title>JangoPRO - Minha barbearia</title>
      </Head>
      <Sidebar userType={userData?.userType}>
        <Flex direction="column" align="flex-start" justify="flex-start">
          <Flex w="100%" direction="row" align="center" justify="flex-start">
            <Heading fontSize="3xl" mt={4} mb={4} mr={4} color="#fba931">
              {userData.userType === 'admin' ? 'Agenda' : 'Agenda Cliente'}
            </Heading>
            <Link href="/new">
              <Button>Cadastrar Novo</Button>
            </Link>
          </Flex>
          <ServiceCalendar
            services={list}
            handleOpenModal={handleOpenModal}
            handleFinish={handleFinish}
          />
        </Flex>
      </Sidebar>
      <ModalInfo
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        data={service}
        adminData={selectedAdminData} // Passe os dados do administrador para o modal
        finishService={() => handleFinish(service?.id)}
      />

    </>
  );
}
export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get("/schedule");
    const authResponse = await apiClient.get("/me");

    const userData = authResponse.data;
    if (userData.userType === 'admin') {
      const servicesById = response.data.filter(user => user.haircut.user_id === userData.id)

      return {
        props: {
          schedule: servicesById,
          barbers: [],
          userData, 
        },
      };

    } else {
      const servicesById = response.data.filter(user => user.haircut.user_id === userData.userAdmin)

      return {
        props: {
          schedule: servicesById,
          barbers: [],
          userData, 

        },
      };
    }

  } catch (err) {
    console.log(err);
    return {
      props: {
        schedule: [],
        barbers: [],
        userData: null, // Defina como null em caso de erro

      },
    };
  }
});
