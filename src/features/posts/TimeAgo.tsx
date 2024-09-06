import {parseISO, formatDistanceToNow} from 'date-fns';

interface IProps {
  timestamp: string
}

const TimeAgo = ({timestamp}: IProps) => {
  let timeAgo = '';
  if (timestamp) {
    const date = parseISO(timestamp);
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod} ago`;
  }
  return (
    <span title={timestamp}>
      &nbsp; <i>{timeAgo}</i>
    </span>
  );
}

export default TimeAgo;