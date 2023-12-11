import { PrismaClient, Barber } from '@prisma/client';

class BarbersService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createBarber(nome: string, telefone: string, email: string, haircutIds: string[], userId: string): Promise<Barber> {
    if (!nome || !telefone || !email || !userId) {
      throw new Error('Nome, telefone, email e userId são obrigatórios.');
    }

    const barber = await this.prisma.barber.create({
      data: {
        nome,
        telefone,
        email,
        User: { connect: { id: userId } }, // Associe o Barber ao User usando o ID do usuário
        haircuts: {
          connect: haircutIds.map((id) => ({ id })),
        },
      },
    });

    return barber;
  }

  async updateBarber(id: string, nome: string, telefone: string, email: string, haircutIds: string[]): Promise<Barber | null> {
    const updatedBarber = await this.prisma.barber.update({
      where: { id },
      data: {
        nome,
        telefone,
        email,
        haircuts: {
          set: haircutIds.map((id) => ({ id })),
        },
      },
    });

    return updatedBarber;
  }

  async deleteBarber(id: string): Promise<void> {
    await this.prisma.barber.delete({
      where: { id },
    });
  }
}

export default BarbersService;
