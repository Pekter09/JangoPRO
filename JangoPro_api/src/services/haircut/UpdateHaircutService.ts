import { PrismaClient } from '@prisma/client';

interface HaircutRequest{
  user_id: string;
  haircut_id: string;
  name: string;
  price: number;
  status: boolean | string;
} 

class UpdateHaircutService{
  private prisma: PrismaClient;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async execute({ user_id, haircut_id, name, price, status = true}:HaircutRequest){

    const user = await this.prisma.user.findFirst({
      where:{
        id: user_id
      },
      include:{
        subscriptions:true,
      }
    })

    if(user?.subscriptions?.status !== 'active'){
      throw new Error("Assine o plano Premium para editar os cortes")
    }

    const haircut = await this.prisma.haircut.update({
      where:{
        id: haircut_id,
      },
      data:{
        name: name,
        price: price,
        status: status === true ? true : false,
      }
    })

    return haircut;

  }
}

export { UpdateHaircutService }