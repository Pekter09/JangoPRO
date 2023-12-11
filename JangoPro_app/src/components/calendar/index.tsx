import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';
import { ModalInfo } from "../modal";
import { Text, Box, Link as ChakraLink, useDisclosure } from '@chakra-ui/react'

const CalendarTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  background-color: #cecccc;
  font-size: 12px;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const HeaderCell = styled.th`
  background-color: #ffa600;
  color: #f7f6f6;
  text-align: center;
  padding: 8px;
  font-weight: bold;
  border: 1px solid #000;
  font-size: 12px;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const TimeCell = styled.td`
  background-color: #b9acac;
  text-align: center;
  padding: 8px;
  border: 1px solid #000;
  font-size: 12px;
  width: 0%;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const ServiceCell = styled.td`
  background-color: #797474;
  text-align: center;
  padding: 4px;
  color: white;
  border: 1px solid #000;
  cursor: pointer;
  font-size: 12px;
  width: 10%;

  @media (max-width: 768px) {
    font-size: 10px;
    width: 20%;
  }
`;

const DateNumberCell = styled.td`
  background-color: #d6d6d6;
  text-align: center;
  padding: 8px;
  color: #333;
  border: 1px solid #000;
`;

const HighlightedRow = styled.tr`
  background-color: #888585;
`;

const NavigationRow = styled.tr`
  background-color: #cecccc;
  text-align: center;
`;

const NavigationCell = styled.td`
  padding: 8px;
  cursor: pointer;
`;

const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

const generateDates = (currentDate, currentDayIndex) => {
  const dates = [];

  for (let i = 0; i < daysOfWeek.length; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i - currentDayIndex);
    dates.push(date);
  }

  return dates;
};

const generateTimes = () => {
  const times = [];
  for (let hour = 8; hour <= 19; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      if (time !== '12:00' && time !== '12:30' && time !== '13:00') {
        times.push(time);
      }
    }
  }
  return times;
};

const ServiceCalendar = ({ services, handleOpenModal, handleFinish }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(new Date().getDate());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedService, setSelectedService] = useState(null); 

  const currentDayIndex = currentWeek.getDay() - 1;

  function isValidString(value) {
    return typeof value === "string" || value instanceof String;
  }

  const dates = generateDates(currentWeek, currentDayIndex);
  const times = generateTimes();

  const nextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + 7);
    setCurrentWeek(newWeek);
  };

  const previousWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() - 7);
    setCurrentWeek(newWeek);
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  useEffect(() => {
    setCurrentDay(new Date().getDate());
    setCurrentMonth(new Date().getMonth() + 1);
    setCurrentYear(new Date().getFullYear());
  }, [currentWeek]);
  
  return (
    <>
      <NavigationRow>
        <NavigationCell onClick={previousWeek}>&#8592; Semana Anterior</NavigationCell>
        <NavigationCell onClick={goToCurrentWeek}> Dia Atual: {`${currentDay}/${currentMonth}/${currentYear}`} </NavigationCell>
        <NavigationCell onClick={nextWeek}>Próxima Semana &#8594;</NavigationCell>
      </NavigationRow>
      <CalendarTable>
        <thead>
          <tr>
            <HeaderCell></HeaderCell>
            {daysOfWeek.map((day, index) => (
              <HeaderCell key={index}>
                {day}
              </HeaderCell>
            ))}
          </tr>
          <tr className="highlighted-row">
            <DateNumberCell></DateNumberCell>
            {dates.map((date, index) => (
              <DateNumberCell key={index}>
                {`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}
              </DateNumberCell>
            ))}
          </tr>
        </thead>
        <tbody>
      {times.map((time, timeIndex) => (
        <HighlightedRow key={timeIndex}>
          <TimeCell>{time}</TimeCell>
          {daysOfWeek.map((day, dayIndex) => {
            const matchingServices = services.filter((service) => {
              if (!isValidString(service.date)) return false;
              const serviceDateParts = service.date.split('/');
              const serviceTime = service.time;
              const serviceDay = parseInt(serviceDateParts[0], 10);
              const serviceMonth = parseInt(serviceDateParts[1], 10);
              const serviceYear = parseInt(serviceDateParts[2], 10);

              return (
                serviceTime === time &&
                serviceDay === dates[dayIndex].getDate() &&
                serviceMonth === dates[dayIndex].getMonth() + 1 &&
                serviceYear === dates[dayIndex].getFullYear()
              );
            });

            return (
              <ServiceCell
                key={`${dayIndex}-${time}`}
              >
                {matchingServices.map((matchingService, index) => (
                  <ChakraLink
                    onClick={() => handleOpenModal(matchingService)}
                    key={matchingService.id}
                    w="100%"
                    m={0}
                    p={0}
                    mt={1}
                    bg="transparent"
                    color="white"
                    style={{ textDecoration: "none" }}
                  >
                    <Box backgroundColor='orange.300' key={index}>
                      <Text color='black'>{matchingService.customer}</Text>
                      {matchingService.barber && (
                        <Text>Barbeiro: {matchingService.barber.nome}</Text>
                      )}
                      <Text>{matchingService.haircut.name}</Text>
                    </Box>
                  </ChakraLink>
                ))}
              </ServiceCell>
            );
          })}
        </HighlightedRow>
      ))}
    </tbody>
      </CalendarTable>
      <ModalInfo
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        data={selectedService}
        finishService={handleFinish}
      />
    </>
  );
};

export default ServiceCalendar;
