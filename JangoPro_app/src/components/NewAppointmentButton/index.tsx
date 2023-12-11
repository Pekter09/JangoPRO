import React from 'react';
import Link from 'next/link';
import { Button } from '@chakra-ui/react';

function NewAppointmentButton() {
  return (
    <Link href="/new">
      <Button colorScheme="teal" size="sm">
        Cadastrar Novo
      </Button>
    </Link>
  );
}

export default NewAppointmentButton;
