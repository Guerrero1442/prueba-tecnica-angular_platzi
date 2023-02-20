import { Task } from '../models/task.model';

export interface CreateTaskDto extends Omit<Task, 'id' | 'completed'> {}

export interface UpdateTaskDto extends Partial<Omit<Task, 'id'>> {}
