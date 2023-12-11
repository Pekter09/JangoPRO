import { PrismaClient } from '@prisma/client';
import Stripe from "stripe";

interface SubscribeRequest {
  user_id: string;
}

class SubscribeService {
  private prisma: PrismaClient;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async execute({ user_id }: SubscribeRequest) {
    try {
      if (!user_id || typeof user_id !== "string") {
        throw new Error("ID do usuário inválido.");
      }
      const stripe = new Stripe(process.env.STRIPE_API_KEY, {
        apiVersion: "2022-11-15",
        appInfo: {
          name: "JangoPRO",
          version: "1",
        },
      });

      // Buscar o usuario e cadastrar ele no stripe caso nao tenha cadastrado
      const findUser = await this.prisma.user.findFirst({
        where: {
          id: user_id,
        },
      });

      let customerId = findUser.stripe_customer_id;

      if (!customerId) {
        // Caso nao tenha criamos como cliente lá no stripe
        const stripeCustomer = await stripe.customers.create({
          email: findUser.email,
        });

        await this.prisma.user.update({
          where: {
            id: user_id,
          },
          data: {
            stripe_customer_id: stripeCustomer.id,
          },
        });

        customerId = stripeCustomer.id;
      }

      // inicializar o nosso checkout de pagamento
      const stripeCheckoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        billing_address_collection: "required",
        line_items: [{ price: process.env.STRIPE_PRICE, quantity: 1 }],
        mode: "subscription",
        allow_promotion_codes: true,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
      });

      return { sessionId: stripeCheckoutSession.id };
    } catch {
      console.error("Erro durante a execução do serviço:");
      throw new Error("Ocorreu um erro ao processar a assinatura.");
    }
  }
}

export { SubscribeService };
