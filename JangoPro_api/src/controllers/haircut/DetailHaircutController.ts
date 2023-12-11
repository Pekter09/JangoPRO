import { Request, Response } from "express";
import prismaClient from "../../prisma";
import { DetailHaircutService } from '../../services/haircut/DetailHaircutService'

class DetailHaircutController{
  async handle(request: Request, response: Response){
    const haircut_id = request.query.haircut_id as string;

    const detailHaircut = new DetailHaircutService(prismaClient);

    const haircut = await detailHaircut.execute({
      haircut_id,
    })

    return response.json(haircut)

  }
}

export { DetailHaircutController }