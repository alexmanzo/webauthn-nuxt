import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userSchema = z.object({
  email: z.string().email(),
});

export default defineEventHandler(async (event) => {
  const payload = await readValidatedBody(event, (body) => userSchema.safeParse(body)); // or `.parse` to directly throw an error

  if (!payload.success) {
    throw payload.error.issues;
  }

  try {
    return await prisma.user.create({
      data: payload.data,
    });
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: 'An error occurred.'
    });
  }
});
