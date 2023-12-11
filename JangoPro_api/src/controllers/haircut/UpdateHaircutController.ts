import {Request, Response} from 'express'
import prismaClient from '../../prisma';
import { UpdateHaircutService } from '../../services/haircut/UpdateHaircutService'

class UpdateHaircutController{
  async handle(request: Request, response: Response){
    const user_id = request.user_id;
    const { name, price, status, haircut_id } = request.body;

    const updateHaircut = new UpdateHaircutService(prismaClient);

    const haircut = await updateHaircut.execute({
      user_id,
      name,
      price,
      status,
      haircut_id
    })

    return response.json(haircut);

  }
}

export { UpdateHaircutController }