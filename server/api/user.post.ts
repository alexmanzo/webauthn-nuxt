import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userSchema = z.object({
  email: z.string().email(),
});

export default defineEventHandler(async (event) => {
  const payload = await readValidatedBody(event, (body) => userSchema.safeParse(body)); // or `.parse` to directly throw an error

  if (!payload.success) {
    throw createError({
      statusCode: 400,
      statusMessage: result.error.issues,
    });
  }

  try {
    return await prisma.user.create({
      data: payload.data,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        console.log('There is a unique constraint violation, a new user cannot be created with this email');
      }
    }
    throw e;
  }
});
