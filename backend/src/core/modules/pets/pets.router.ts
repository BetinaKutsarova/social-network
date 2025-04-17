import Router from 'koa-router';
import { validator } from '../../validator';
// import { authMiddleware } from '../auth';
import { PetService } from './pets.service';
import { createPetValidationSchema, updatePetValidationSchema } from './pets.validation-schema';


export const petRouter = new Router({
	prefix: '/pets'
});

// petRouter.use(authMiddleware);

petRouter.get('/', async ctx => {
	const pets = await PetService.getAll();
	ctx.body = pets;
});

petRouter.get('/user/:userId', async ctx => {
  const { userId } = ctx.params;
  const userPets = await PetService.getByUserId(userId);
  ctx.body = userPets;
});

petRouter.get('/:id', async ctx => {
	const { id } = ctx.params;
	const pet = await PetService.getById(id);
	if (!pet) {
		ctx.status = 404;
		ctx.body = { error: { message: 'Pet not found!' } };
		return;
	}

	ctx.body = pet;
});

petRouter.post('/', validator(createPetValidationSchema), async ctx => {
	const petData = {
		...ctx.request.body,
		userId: ctx.state.user.id
	};
	try {
		const pet = await PetService.create(petData);
		ctx.status = 201;
		ctx.body = pet;

	} catch (error: unknown) {
		ctx.status = 400;
		ctx.body = { error: { message: error instanceof Error ? error.message : 'Unknown error' } };
	}
});

petRouter.put('/:id', validator(updatePetValidationSchema), async ctx => {
	const { id } = ctx.params;

	const pet = await PetService.getById(id);
	if (!pet) {
		ctx.status = 404;
		ctx.body = { error: { message: 'Pet not found' } };
		return;
	}

	if (pet.userId !== ctx.state.user.id) {
		ctx.status = 403;
		ctx.body = { error: { message: 'Access denied - you can only update your own profile' } };
		return;
	}

	const petData = ctx.request.body;

	const updatedPet = await PetService.update(id, petData);
	ctx.body = updatedPet;
});

petRouter.delete('/:id', async ctx => {
	const { id } = ctx.params;

	const pet = await PetService.getById(id);
	if (!pet) {
		ctx.status = 404;
		ctx.body = { error: { message: 'Pet not found' } };
		return;
	}

	if (pet.userId !== ctx.state.user.id && ctx.state.user.role !== 'admin') {
		ctx.status = 403;
		ctx.body = { error: { message: 'Access denied - you can only delete your own info' } };
		return;
	}

	await PetService.delete(id);
	ctx.status = 204;
});