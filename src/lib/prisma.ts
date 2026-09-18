// Pure JavaScript Prisma mock proxy for standalone deployment
// All queries gracefully throw so route try/catch blocks immediately serve storeManager / storeData
export const prisma: any = new Proxy({} as any, {
  get(target, prop: string) {
    return new Proxy({}, {
      get(_, method: string) {
        return async () => {
          throw new Error(`Prisma bypassed for ${prop}.${method}`);
        };
      },
    });
  },
});

export default prisma;

