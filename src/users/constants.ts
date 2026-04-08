export const DEFAULT_MEALTIME = {
  breakfast: '07:00',
  lunch: '13:00',
  snacks: '17:00',
  dinner: '20:00',
};

export const getMealTimeUTC = (
  time: string,
  timezoneOffset: number,
): string => {
  const [h, m] = time.split(':').map(Number);

  const totalMinutes = h * 60 + m + timezoneOffset;

  const utcMinutes = ((totalMinutes % 1440) + 1440) % 1440;

  const hours = String(Math.floor(utcMinutes / 60)).padStart(2, '0');
  const minutes = String(utcMinutes % 60).padStart(2, '0');

  return `${hours}:${minutes}`;
};

export const getDefaultMealTimesUTC = (timezoneOffset: number) => {
  const result: Record<string, string> = {};

  for (const mealName in DEFAULT_MEALTIME) {
    result[mealName] = getMealTimeUTC(
      DEFAULT_MEALTIME[mealName],
      timezoneOffset,
    );
  }

  return result;
};
