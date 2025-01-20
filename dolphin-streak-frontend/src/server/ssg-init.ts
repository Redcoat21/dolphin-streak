// import { createServerSideHelpers } from '@trpc/react-query/server';
// import type { GetStaticPropsContext } from 'next';
// import SuperJSON from 'superjson';
// import { createInnerTRPCContext } from './context';
// import type { AppRouter } from './routers/_app';
// import { appRouter } from './routers/_app';

// export async function ssgInit<TParams extends { locale?: string }>(
//   opts: GetStaticPropsContext<TParams>,
// ) {
//   // const locale = opts.params?.locale ?? opts?.locale ?? i18n.defaultLocale;
//   const ctx = await createInnerTRPCContext()
//   const ssg = createServerSideHelpers<AppRouter>({
//     router: appRouter,
//     ctx: ctx,
//     transformer: SuperJSON,
//   });

//   // Prefetch i18n everytime
//   // await ssg.i18n.fetch();

//   return ssg;
// }