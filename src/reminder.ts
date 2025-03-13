export class Reminder {
  constructor(
    public id: string,
    public title: string,
    public dueDate: string,
    public isCompleted: boolean
  ) {}
}

// In-memory store for reminders
export const reminders: Reminder[] = [];