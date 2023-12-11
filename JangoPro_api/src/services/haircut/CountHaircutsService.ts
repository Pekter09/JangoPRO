import { PrismaClient } from '@prisma/client';


interface CountRequest{
  user_id: string;
}

class CountHaircutsService{
  private prisma: PrismaClient;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async execute({ user_id }: CountRequest){

    const count = await this.prisma.haircut.count({
      where:{
        user_id: user_id
      }
    })

    return count;

  }
}

export { CountHaircutsService }