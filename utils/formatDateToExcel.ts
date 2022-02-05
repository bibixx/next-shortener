const baseExcelDate = new Date('1899-12-30');
const dayInSeconds = 1000 * 60 * 60 * 24;

export const formatDateToExcel = (now: Date) => {
  return (now.getTime() - baseExcelDate.getTime()) / dayInSeconds;
};
