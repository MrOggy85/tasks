import { format, isSameYear, isAfter, isSameDay } from 'date-fns';

type Props = {
  date: string;
};

const DateText = ({ date }: Props) => {
  const now = new Date();

  const year = format(new Date(date), 'yyyy');
  const month = format(new Date(date), 'MMM');
  const day = format(new Date(date), 'do');

  const taskDate = new Date(date);

  let color = isAfter(now, taskDate) ? 'tomato' : undefined;
  if (isSameDay(now, taskDate)) {
    color = 'cornflowerblue';
  }

  return (
    <div style={{ color }}>
      {!isSameYear(now, new Date(date)) && <span>{year} </span>}
      <span>{month} </span>
      <span>{day}</span>
    </div>
  );
};

export default DateText;
