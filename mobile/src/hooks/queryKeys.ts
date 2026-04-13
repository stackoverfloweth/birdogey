export const queryKeys = {
  users: {
    all: (seasonId: string) => ['users', seasonId] as const,
  },
}
