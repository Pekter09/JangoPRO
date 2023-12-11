import { PrismaClient } from '@prisma/client';

interface HaircutRequest{
  user_id: string;
  status: boolean | string;
}

class ListHaircutService{
  private prisma: PrismaClient;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async execute({ user_id, status }: HaircutRequest){

    const haircut = await this.prisma.haircut.findMany({
      where:{
        user_id: user_id,
        status: status === 'true' ? true : false
      }
    })

    return haircut;

  }
}

export { ListHaircutService }
