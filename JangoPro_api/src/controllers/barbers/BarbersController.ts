import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class BarbersController {
  async create(req: Request, res: Response) {
    try {
      const { nome, telefone, email, haircutIds, userId } = req.body; // Adicionado userId

      if (!nome || !telefone || !email || !userId) { // Certifique-se de que userId seja fornecido
        return res.status(400).json({ message: 'Nome, telefone, email e userId são obrigatórios.' });
      }
    
      const createdBarber = await prisma.barber.create({
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

      return res.json(createdBarber);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const barbers = await prisma.barber.findMany({
        include: {
          haircuts: true,
        },
      });

      return res.json(barbers);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, telefone, email, haircutIds } = req.body;

      const updatedBarber = await prisma.barber.update({
        where: { id },
        data: {
          nome,
          telefone,
          email,
          haircuts: {
            set: haircutIds.map((id) => ({ id })),
          },
        },
        include: {
          haircuts: true,
        },
      });

      return res.json(updatedBarber);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.barber.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export { BarbersController };
