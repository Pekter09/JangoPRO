import { useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import logoImg from "@/public/images/logo.png";
import { Flex, Text, Center, Input, Button } from "@chakra-ui/react";

import Link from "next/link";

import { AuthContext } from "@/src/context/AuthContext";
import { canSSRGuest } from "@/src/utils/canSSRGuest";

export default function Login() {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    
    if(email === '' || password === ''){
      return;
    }

    await signIn({
        email,
        password,
    })
  }

  return (
    <>
      <Head>
        <title>JangoPRO - Faça login para acessar</title>
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
              //objectFit="fill"
              alt="Logo JangoPro"
            />
          </Center>

          <Input
            background="jango.400"
            variant="filled"
            size="lg"
            placeholder="email@email.com"
            type="email"
            color="#fff"
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
            mb={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            background="button.cta"
            mb={6}
            color="gray.900"
            size="lg"
            _hover={{ bg: "#ffb13e" }}
            onClick={handleLogin}
          >
            Acessar
          </Button>

          <Center mt={2}>
            <Link href="/register">
              <Text cursor="pointer" color="jango.100">
                Ainda não possui conta? <strong>Cadastre-se</strong>
              </Text>
            </Link>
          </Center>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return{
    props: {}
  }
})