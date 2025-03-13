export interface Reminder {
    id: string;
    title: string;
    description?: string;
    dueDate: string;
    isCompleted: boolean;
  }
  
  export const reminders: Reminder[] = [];
  