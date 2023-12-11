import {Request, Response} from 'express' 
import prismaClient from '../../prisma';
import { CreateUserService } from '../../services/user/CreateUserService'

class CreateUserController{
  async handle(request: Request, response: Response){
    const { name, endereco, telefone, email, password, userType, userAdmin } = request.body;

    const createUserService = new CreateUserService(prismaClient);

    const user = await createUserService.execute({
      name,
      endereco,
      email,
      telefone,
      password,
      userType,
      userAdmin
    });

    return response.json(user);

  }
}

export { CreateUserController }