import { FiChevronsUp, FiChevronUp } from 'react-icons/fi';
import type { RootState } from './redux/store';

type Task = RootState['tasks']['tasks'][0];

function getPrio(prio: Task['priority']) {
  switch (prio) {
    case 2:
      return FiChevronsUp;
    case 1:
      return FiChevronUp;
    default:
    case 0:
      return null;
  }
}

export default getPrio;
