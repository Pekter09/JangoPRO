import { request, Request, response, Response } from "express";
import prismaClient from "../../prisma";
import { FinishScheduleService } from "../../services/schedule/FinishScheduleService";

class FinishScheduleController{
    async handle(request: Request, response: Response){
        const user_id = request.user_id;
        const schedule_id = request.query.schedule_id as string;

        const finishScheduleService = new FinishScheduleService(prismaClient);

        const schedule = await finishScheduleService.execute({
            user_id,
            schedule_id,
        })

        return response.json(schedule)

    }
}

export { FinishScheduleController }