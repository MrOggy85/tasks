import type { Tag } from '../tags/types';

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: 0 | 1 | 2 | 3 | 4;
  startDate?: string;
  endDate?: string;
  completionDate?: string;

  /**
   * CRON string
   *
   * e.g: '* * * * *'
   */
  repeat: string;

  /**
   * Repeat from which date
   */
  repeatType: 'endDate' | 'completionDate';

  /**
   * timestamp default fields
   */
  createdAt?: string;
  /**
   * timestamp default fields
   */
  updatedAt?: string;

  tags: Tag[];
};
