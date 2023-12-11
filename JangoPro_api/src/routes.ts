import express, { Router, Request, Response } from 'express'

import { CreateUserController } from './controllers/user/CreateUserController'
import { AuthUserController } from './controllers/user/AuthUserController'
import { DetailUserController } from './controllers/user/DetailUserController'
import { UpdateUserController } from './controllers/user/UpdateUserController'

import { CreateHaircutController } from './controllers/haircut/CreateHaircutController'
import { ListHaircutController } from './controllers/haircut/ListHaircutController'
import { UpdateHaircutController } from './controllers/haircut/UpdateHaircutController'
import { CheckSubscriptionController } from './controllers/haircut/CheckSubscriptionController'
import { CountHaircutsController } from './controllers/haircut/CountHaircutsController'
import { DetailHaircutController } from './controllers/haircut/DetailHaircutController'

import { ListScheduleController } from './controllers/schedule/ListScheduleController'
import { FinishScheduleController } from './controllers/schedule/FinishScheduleController'

import { isAuthenticated } from './middlewares/isAuthenticated'
import { SubscribeController } from './controllers/subscription/SubscribeController'
import { WebhooksController } from './controllers/subscription/WebhooksController'
import { CreatePortalController } from './controllers/subscription/CreatePortalController'
import { BarbersController } from './controllers/barbers/BarbersController'
import { NewScheduleController } from './controllers/schedule/NewScheduleController'


const router = Router();

// --- ROTAS USER ---
router.post('/users', new CreateUserController().handle)
router.post('/session', new AuthUserController().handle)
router.get('/me', isAuthenticated, new DetailUserController().handle)
router.put('/users', isAuthenticated, new UpdateUserController().handle)
router.get('/users', new DetailUserController().useres);

// --- ROTA HAIRCUT ---
router.post('/haircut', isAuthenticated, new CreateHaircutController().handle) 
router.get('/haircuts', isAuthenticated, new ListHaircutController().handle)
router.put('/haircut', isAuthenticated, new UpdateHaircutController().handle)
router.get('/haircut/check', isAuthenticated, new CheckSubscriptionController().handle)
router.get('/haircut/count', isAuthenticated, new CountHaircutsController().handle)
router.get('/haircut/detail', isAuthenticated, new DetailHaircutController().handle)
 
// --- ROTA SERVIÇOS ---
router.post('/schedule', isAuthenticated, new NewScheduleController().handle)
router.get('/schedule', new ListScheduleController().handle)
router.delete('/schedule', isAuthenticated, new FinishScheduleController().handle)

// --- ROTAS PAGAMENTOS ---
router.post('/subscribe', isAuthenticated, new SubscribeController().handle)
router.post('/webhooks',express.raw({ type: 'application/json'}), new WebhooksController().handle)
router.post('/create-portal', isAuthenticated, new CreatePortalController().handle)

// --- ROTAS BARBEIROS ---
router.post('/barbers', new BarbersController().create);
router.get('/barbers', new BarbersController().list);
router.put('/barbers/:id', new BarbersController().update);
router.delete('/barbers/:id', new BarbersController().delete);


export { router };