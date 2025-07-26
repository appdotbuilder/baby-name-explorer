
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createBabyNameInputSchema,
  updateBabyNameInputSchema,
  getBabyNamesQuerySchema,
  createParentingQuoteInputSchema,
  updateParentingQuoteInputSchema,
  getParentingQuotesQuerySchema,
  createAppConfigInputSchema,
  updateAppConfigInputSchema
} from './schema';

// Import handlers
import { createBabyName } from './handlers/create_baby_name';
import { getBabyNames } from './handlers/get_baby_names';
import { updateBabyName } from './handlers/update_baby_name';
import { deleteBabyName } from './handlers/delete_baby_name';
import { createParentingQuote } from './handlers/create_parenting_quote';
import { getParentingQuotes } from './handlers/get_parenting_quotes';
import { updateParentingQuote } from './handlers/update_parenting_quote';
import { deleteParentingQuote } from './handlers/delete_parenting_quote';
import { createAppConfig } from './handlers/create_app_config';
import { getAppConfigs } from './handlers/get_app_configs';
import { updateAppConfig } from './handlers/update_app_config';
import { deleteAppConfig } from './handlers/delete_app_config';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Baby names routes
  createBabyName: publicProcedure
    .input(createBabyNameInputSchema)
    .mutation(({ input }) => createBabyName(input)),

  getBabyNames: publicProcedure
    .input(getBabyNamesQuerySchema)
    .query(({ input }) => getBabyNames(input)),

  updateBabyName: publicProcedure
    .input(updateBabyNameInputSchema)
    .mutation(({ input }) => updateBabyName(input)),

  deleteBabyName: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteBabyName(input.id)),

  // Parenting quotes routes
  createParentingQuote: publicProcedure
    .input(createParentingQuoteInputSchema)
    .mutation(({ input }) => createParentingQuote(input)),

  getParentingQuotes: publicProcedure
    .input(getParentingQuotesQuerySchema)
    .query(({ input }) => getParentingQuotes(input)),

  updateParentingQuote: publicProcedure
    .input(updateParentingQuoteInputSchema)
    .mutation(({ input }) => updateParentingQuote(input)),

  deleteParentingQuote: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteParentingQuote(input.id)),

  // App configuration routes
  createAppConfig: publicProcedure
    .input(createAppConfigInputSchema)
    .mutation(({ input }) => createAppConfig(input)),

  getAppConfigs: publicProcedure
    .input(z.object({ isActive: z.boolean().optional() }))
    .query(({ input }) => getAppConfigs(input.isActive)),

  updateAppConfig: publicProcedure
    .input(updateAppConfigInputSchema)
    .mutation(({ input }) => updateAppConfig(input)),

  deleteAppConfig: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteAppConfig(input.id)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
