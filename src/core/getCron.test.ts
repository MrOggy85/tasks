import getCron from './getCron';

beforeAll(() => {
  jest.useFakeTimers();
  // Year 2022, March, 21th, 10:30
  jest.setSystemTime(new Date(2022, 2, 21, 10, 30));
});

afterAll(() => {
  jest.useRealTimers();
});

// Note: Wednesday
const d2021_10_20_16_59 = new Date(2021, 9, 20, 16, 59);
console.log('d2021_10_20_16_59', d2021_10_20_16_59);

type CronType = Parameters<typeof getCron>[0];
type RepeatType = Parameters<typeof getCron>[2];

const testCases: [CronType, Date | undefined, RepeatType, string][] = [
  ['monthly', undefined, 'completionDate', '30 10 21 */1 *'],
  ['weekly', undefined, 'completionDate', '30 10 * * 1'],
  ['weekly', d2021_10_20_16_59, 'endDate', '59 16 * * 3'],
  ['monthly', d2021_10_20_16_59, 'endDate', '59 16 20 */1 *'],
  ['yearly', d2021_10_20_16_59, 'endDate', '59 16 20 9 *'],
  ['yearly', undefined, 'completionDate', '30 10 21 2 *'],
];

describe.each(testCases)(
  'When cronType: %s, endDate: %s, repeatType: %s',
  (cronType, endDate, repeatType, expectedCron) => {
    it(`should return cron: ${expectedCron}`, () => {
      const result = getCron(cronType, endDate, repeatType);

      expect(result).toBe(expectedCron);
    });
  },
);
