import { Request, Response } from 'express'
import prismaClient from '../../prisma';
import { AuthUserService } from '../../services/user/AuthUserService'

class AuthUserController{
  async handle(request: Request, response: Response){
    const { email, password } = request.body;

    const authUserService = new AuthUserService(prismaClient);

    const session = await authUserService.execute({
      email,
      password
    })

    return response.json(session);

  }
}

export { AuthUserController }