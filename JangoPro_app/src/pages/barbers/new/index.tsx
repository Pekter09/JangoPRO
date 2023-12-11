import { useState, createContext, useEffect, useContext } from 'react';
import Head from 'next/head';
import { Sidebar } from '../../../components/sidebar';
import {
  Flex,
  Text,
  Heading,
  Button,
  useMediaQuery,
  Input,
  Checkbox,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FiChevronLeft } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { canSSRAuth } from '../../../utils/canSSRAuth';
import { setupAPIClient } from '../../../services/api';
import InputMask from 'react-input-mask';
import { AuthContext } from '@/src/context/AuthContext';

export const BarberInfoContext = createContext<any | null>(null);

interface HaircutsItem {
  id: string;
  name: string;
  price: number | string;
  status: boolean;
  user_id: string;
}

interface NewBarberProps {
  subscription: boolean;
  count: number;
  haircuts: HaircutsItem[];
}

export default function NewBarber({
  subscription,
  count,
  haircuts
}: NewBarberProps) {
  const router = useRouter();
  const [isMobile] = useMediaQuery('(max-width: 500px)');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [barberInfo, setBarberInfo] = useState<any | null>(null);
  const [selectedHaircuts, setSelectedHaircuts] = useState<string[]>([]);
  const [haircutList, setHaircutList] = useState<HaircutsItem[]>(
    haircuts || []
  );

  async function fetchHaircuts() {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/haircuts", {
        params: { status: true },
      });      
      setHaircutList(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchHaircuts();
  }, []);
  const { user } = useContext(AuthContext); 
  const userId = user ? user.id : null; // Verifique se user existe antes de acessar user.id
  
  async function handleRegister() {
    let errorMessage = '';
  
    if (nome === '') {
      errorMessage = 'O nome é obrigatório.';
    } else if (telefone === '') {
      errorMessage = 'O telefone é obrigatório.';
    } else if (email === '') {
      errorMessage = 'O email é obrigatório.';
    }
  
    if (errorMessage) {
      alert(errorMessage);
      return;
    }
  
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.post('/barbers', {
        nome,
        telefone,
        email,
        userId, // Adicione o userId ao corpo da solicitação
        haircutIds: selectedHaircuts,
      });
  
      const newBarberInfo = response.data;
      setBarberInfo(newBarberInfo);
      router.back();
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar esse barbeiro.');
    }
  }
  

  return (
    <BarberInfoContext.Provider value={barberInfo}>
      <>
        <Head>
          <title>JangoPRO - Novo Barbeiro</title>
        </Head>
        <Sidebar userType='admin'>
          <Flex
            direction="column"
            alignItems="flex-start"
            justifyContent="flex-start"
          />
          <Flex
            direction={isMobile ? 'column' : 'row'}
            w="100%"
            align={isMobile ? 'flex-start' : 'center'}
            mb={isMobile ? 4 : 0}
          >
            <Link href="/barbers">
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
            <Heading
              color="orange.900"
              mt={4}
              mb={4}
              mr={4}
              fontSize={isMobile ? '28px' : '3xl'}
            >
              Barbeiros
            </Heading>
          </Flex>

          <Flex
            maxW="700px"
            bg="jango.400"
            w="100%"
            align="center"
            justify="center"
            pt={8}
            pb={8}
            direction="column"
          >

            <Heading
              mb={4}
              fontSize={isMobile ? '22px' : '3xl'}
              color="white"
            >
              Cadastrar barbeiro
            </Heading>

            <Input
              placeholder="Nome do barbeiro"
              size="lg"
              type="text"
              w="85%"
              bg="gray.900"
              mb={3}
              value={nome}
              color="white"
              onChange={(e) => setNome(e.target.value)}
            />

            <InputMask
              mask="(99) 99999-9999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              size="lg"
              type="text"
              w="85%"
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

            <Input
              placeholder="Email"
              size="lg"
              type="email"
              bg="gray.900"
              value={email}
              w="85%"
              mb={4}
              color="white"
              onChange={(e) => setEmail(e.target.value)}
            />
            <VStack spacing={4}>
              {/* Lista de cortes de cabelo disponíveis para seleção */}
              <Text color="white" fontSize="xl">
                Selecione os cortes de cabelo:
              </Text>
              {haircutList.map((haircut) => (
                <Checkbox
                  key={haircut.id}
                  color="white"
                  isChecked={selectedHaircuts.includes(haircut.id)}
                  onChange={(e) => {
                    const selectedId = haircut.id;
                    setSelectedHaircuts((prevSelected) =>
                      prevSelected.includes(selectedId)
                        ? prevSelected.filter((id) => id !== selectedId)
                        : [...prevSelected, selectedId]
                    );
                  }}
                >
                  {haircut.name}
                </Checkbox>
              ))}
            </VStack>

            <Button
              onClick={handleRegister}
              w="85%"
              size="lg"
              color="gray.900"
              mb={6}
              bg="button.cta"
              _hover={{ bg: '#FFb13e' }}
              disabled={!subscription && count >= 3}
            >
              Cadastrar
            </Button>
          </Flex>
        </Sidebar>
      </>
    </BarberInfoContext.Provider>
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

    if (response.data === null) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return {
      props: {
        haircuts: response.data,
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
