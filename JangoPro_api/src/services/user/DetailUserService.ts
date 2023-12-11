import { PrismaClient } from '@prisma/client';

class UserDetailService {
  private prisma: PrismaClient;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async execute(user_id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        name: true,
        userType: true,
        telefone:true,
        email: true,
        endereco: true,
        userAdmin: true,
        haircuts:true,
        service:true,
        barbers: true,
        subscriptions: {
          select: {
            id: true,
            priceId: true,
            status: true,
          },
        },
      },
    })
    ;

    return user;
  }
  async useres() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        userType: true,
        telefone: true,
        email: true,
        endereco: true,
        userAdmin: true,
        haircuts:true,
        service:true,
        barbers: true,
        subscriptions: {
          select: {
            id: true,
            priceId: true,
            status: true,
          },
        },
      },
    });

    return users;
  }
}

export { UserDetailService };
