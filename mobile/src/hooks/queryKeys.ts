export const queryKeys = {
  events: {
    all: (seasonId: string) => ['events', seasonId] as const,
    detail: (eventId: string) => ['events', 'detail', eventId] as const,
  },
  players: {
    all: (seasonId: string) => ['players', seasonId] as const,
    detail: (playerId: string) => ['players', 'detail', playerId] as const,
  },
}
