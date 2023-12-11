import {Request, Response } from 'express'
import prismaClient from '../../prisma';
import { SubscribeService } from '../../services/subscription/SubscribeService';

class SubscribeController{
  async handle(request: Request, response: Response){
    const user_id = request.user_id

    const subscribeService = new SubscribeService(prismaClient)

    const subscribe = await subscribeService.execute({
      user_id
    })

    return response.json(subscribe);

  }
}

export { SubscribeController }