import { Response, Request } from "express";
import prismaClient from "../../prisma";
import { ListScheduleService } from '../../services/schedule/ListScheduleService'

class ListScheduleController{
  async handle(request: Request, response: Response){
    const user_id = request.user_id;

    const listSchedule = new ListScheduleService(prismaClient);

    const schedule = await listSchedule.execute({
      user_id
    })

    return response.json(schedule);

  }
}

export { ListScheduleController }