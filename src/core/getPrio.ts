import type { ComponentProps } from 'react';
import Badge from 'react-bootstrap/Badge';
import type { RootState } from './redux/store';

type Task = RootState['tasks']['tasks'][0];
type Color = ComponentProps<typeof Badge>['text'];

function getPrio(prio: Task['priority']) {
  switch (prio) {
    case 2:
      return {
        bg: 'primary',
        content: 'Low',
        text: 'light' as Color,
      };
    case 3:
      return {
        bg: 'warning',
        content: 'Medium',
        text: 'dark' as Color,
      };
    case 4:
      return {
        bg: 'danger',
        content: 'High',
        text: 'light' as Color,
      };
    case 0:
    case 1:
    default:
      return {
        bg: 'light',
        content: 'None',
        text: 'dark' as Color,
      };
  }
}

export default getPrio;
