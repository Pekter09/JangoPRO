import {Request, Response} from 'express'
import prismaClient from '../../prisma';
import { CheckSubscriptionService } from '../../services/haircut/CheckSubscriptionService'

class CheckSubscriptionController{
  async handle(request: Request, response: Response){
    const user_id = request.user_id;

    const checkSubscription = new CheckSubscriptionService(prismaClient);

    const status = await checkSubscription.execute({
      user_id
    })

    return response.json(status);

  }
}

export { CheckSubscriptionController }