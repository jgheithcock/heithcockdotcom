import { parseISO, format } from "date-fns";

const DateFormatter = ({ dateString }) => {
  try {
    const date = parseISO(dateString);
    return <time dateTime={dateString}>{format(date, "LLLL	d, yyyy")}</time>;
  } catch {
    return <time dateTime={dateString}>{dateString}</time>;
  }
};

export default DateFormatter;
