export const queryKeys = {
  events: {
    all: (seasonId: string) => ['events', seasonId] as const,
    detail: (eventId: string) => ['events', 'detail', eventId] as const,
  },
  users: {
    all: (seasonId: string) => ['users', seasonId] as const,
    detail: (userId: string) => ['users', 'detail', userId] as const,
  },
}
