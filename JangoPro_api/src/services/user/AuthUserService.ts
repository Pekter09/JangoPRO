import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs'
import { Secret, sign } from 'jsonwebtoken'

interface AuthUserRequest{
  email: string;
  password: string;
} 

class AuthUserService{
  private prisma: PrismaClient;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async execute({ email, password }: AuthUserRequest){

    const user = await this.prisma.user.findFirst({
      where:{
        email: email
      },
      include:{
        subscriptions: true,
      }
    })

    if(!user){
      throw new Error("Email/password incorrect")
    }

    const passwordMatch = await compare(password, user?.password)

    if(!passwordMatch){
      throw new Error("Email/password incorrect")
    }
    const jwtSecret = process.env.JWT_SECRET as Secret;

    const token = sign(
      {
        name: user.name,
        email: user.email,
      },
      jwtSecret,      
      {
        subject: user.id,
        expiresIn: '1000d'
      }
    )
    

    return {
      id: user?.id,
      name: user?.name,
      userType: user?.userType, 
      email: user?.email,
      endereco: user?.endereco,
      token: token,
      subscriptions: user.subscriptions ? {
        id: user?.subscriptions?.id,
        status: user?.subscriptions?.status
      } : null
     }
  }
}

export { AuthUserService }