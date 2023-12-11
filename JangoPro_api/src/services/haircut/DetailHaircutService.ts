import { PrismaClient } from '@prisma/client';

interface DetailRequest{
  haircut_id: string;
}

class DetailHaircutService{
  private prisma: PrismaClient;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async execute({ haircut_id }:DetailRequest ){

    const haircut = await this.prisma.haircut.findFirst({ // Busca so o primeiro
      where:{
        id: haircut_id
      }
    })


    return haircut;

  }
}

export { DetailHaircutService }