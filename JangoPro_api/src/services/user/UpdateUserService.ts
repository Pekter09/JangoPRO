import { PrismaClient } from '@prisma/client';

interface UserRequest{
  user_id: string;
  name: string;
  endereco: string;
}

class UpdateUserService{
  private prisma: PrismaClient;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async execute({ user_id, name, endereco }: UserRequest){

    try{
      const userAlreadyExists = await this.prisma.user.findFirst({
        where:{
          id: user_id,
        }
      })

      if(!userAlreadyExists){
        throw new Error("Usuário não existe!");
      }

      const userUpdated = await this.prisma.user.update({
        where:{
          id: user_id
        },
        data:{
          name,
          endereco,
        },
        select:{
          name: true,
          email: true,
          endereco: true,
        }
      })

      return userUpdated;

    }catch(err){
      console.log(err);
      throw new Error("Erro ao atualizar o usuário!")
    }

  }
}

export { UpdateUserService }