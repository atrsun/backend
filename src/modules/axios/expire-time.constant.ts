export const expireTimeDate = {
  oneDay: () => new Date(Date.now() + 1000 * 60 * 60 * 24),
  twoDay: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
  threeDay: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
  oneWeek: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  oneMonth: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
};
