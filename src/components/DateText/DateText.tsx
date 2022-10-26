import { format, isSameYear, isAfter } from 'date-fns';

type Props = {
  date: string;
};
const DateText = ({ date }: Props) => {
  const now = new Date();

  const year = format(new Date(date), 'yyyy');
  const month = format(new Date(date), 'MMM');
  const day = format(new Date(date), 'do');

  const color = isAfter(now, new Date(date)) ? 'tomato' : undefined;

  return (
    <div style={{ color }}>
      {!isSameYear(now, new Date(date)) && <span>{year}</span>}
      <span>{month} </span>
      <span>{day}</span>
    </div>
  );
};

export default DateText;
