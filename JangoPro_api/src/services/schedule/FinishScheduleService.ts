import { PrismaClient } from '@prisma/client';

interface FinishRequest {
    schedule_id: string;
}

class FinishScheduleService {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async execute({ schedule_id }: FinishRequest) {
        try {
            const belongsToUser = await this.prisma.service.findFirst({
                where: {
                    id: schedule_id,
                },
            });

            if (!belongsToUser) {
                throw new Error('Agendamento não encontrado');
            }

            await this.prisma.service.delete({
                where: {
                    id: schedule_id,
                },
            });

            return { message: 'Finalizado com sucesso' };
        } catch (err) {
            console.log(err);
            throw new Error('Erro ao finalizar o serviço');
        }
    }
}

export { FinishScheduleService }
