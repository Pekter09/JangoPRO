import { Request, Response } from 'express'
import prismaClient from '../../prisma';
import { CreatePortalService } from '../../services/subscription/CreatePortalService';

class CreatePortalController{
  async handle(request: Request, response: Response){
    const user_id = request.user_id;

    const createPortal = new CreatePortalService(prismaClient);

    const portal = await createPortal.execute({
      user_id
    })

    return response.json(portal);

  }
}

export { CreatePortalController }