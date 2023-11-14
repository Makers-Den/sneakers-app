export const todayNoonUtc = () => {
  const now = new Date(Date.now());

  return Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    12,
    0,
    0,
    0
  );
};
