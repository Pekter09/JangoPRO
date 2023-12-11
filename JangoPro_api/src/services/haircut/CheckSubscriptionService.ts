import { PrismaClient } from '@prisma/client';

interface CheckSubscription{
  user_id: string;
}

class CheckSubscriptionService{
  private prisma: PrismaClient;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async execute({ user_id }: CheckSubscription){

    const status = await this.prisma.user.findFirst({
      where:{
        id: user_id
      },
      select:{
        subscriptions:{
          select:{
            id: true,
            status: true,
          }
        }
      }
    })

    return status;

  }
}

export { CheckSubscriptionService }