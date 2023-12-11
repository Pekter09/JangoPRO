import { PrismaClient } from '@prisma/client';
import prismaClient from '../../prisma';
import { NewScheduleService } from '../../services/schedule/NewScheduleService';

class NewScheduleController {
  private prisma: PrismaClient; // Adicione a propriedade prisma
  private scheduleService: NewScheduleService;

  constructor() {
    this.prisma = prismaClient; // Defina a propriedade prisma
    this.scheduleService = new NewScheduleService(this.prisma);
  }
  

  async handle(request, response) {
    try {
      const user_id = request.user_id;
      const { customer, haircut_id, barber_id, date, time } = request.body;
  
      // Converter a string de data e hora em um objeto Date válido
      const [hours, minutes] = time.split(':').map(Number);
      const selectedDate = new Date(date);
      selectedDate.setHours(hours, minutes, 0, 0);
  
  
      const existingSchedule = await prismaClient.service.findFirst({
        where: {
          barber_id,
          date: selectedDate,
        },
      });
  
      if (existingSchedule) {
        return response.status(400).json({ error: 'Horário não está disponível.' });
      }
    
      const schedule = await prismaClient.service.create({
        data: {
          customer,
          date: selectedDate,
          haircut: { connect: { id: haircut_id[0] } }, 
          user: { connect: { id: user_id } },
          barber: { connect: { id: barber_id } },
        },
      });
    
      return response.json(schedule);
    } catch (error) {
      return response.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
  
}

export { NewScheduleController };
