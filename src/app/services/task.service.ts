import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { CreateTaskDto, UpdateTaskDto } from '../dto/task.dto';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _tasksUpdate$ = new Subject<void>();
  constructor(private router: Router) {}

  getTasks() {
    const tasksJSON = localStorage.getItem('mydayapp-angular');
    return tasksJSON ? JSON.parse(tasksJSON) : null;
  }

  get tasksUpdate$() {
    return this._tasksUpdate$;
  }
  create(task: CreateTaskDto) {
    const newTask = {
      ...task,
      completed: false,
      id: this.generateId(),
    };
    const tasks = this.getTasks();
    if (tasks === null) {
      localStorage.setItem('mydayapp-angular', JSON.stringify([newTask]));
      this._tasksUpdate$.next(tasks);
    } else {
      tasks.push(newTask);
      localStorage.setItem('mydayapp-angular', JSON.stringify(tasks));
      this._tasksUpdate$.next(tasks);
    }
  }

  update(id: Task['id'], task: UpdateTaskDto) {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t: { id: string }) => t.id === id);
    const prevData = tasks[index];
    tasks[index] = {
      ...prevData,
      ...task,
    };
    localStorage.setItem('mydayapp-angular', JSON.stringify(tasks));
    this._tasksUpdate$.next(tasks);
  }

  delete(id: Task['id']) {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t: { id: string }) => t.id === id);
    tasks.splice(index, 1);
    localStorage.setItem('mydayapp-angular', JSON.stringify(tasks));
    this._tasksUpdate$.next(tasks);
  }

  clearTasks() {
    const tasks = this.getTasks();
    const incompletedTasks = tasks.filter(
      (task: { completed: boolean }) => !task.completed
    );
    localStorage.setItem('mydayapp-angular', JSON.stringify(incompletedTasks));
    this._tasksUpdate$.next(tasks);
  }

  countCompletedTasks(): number {
    const tasks = this.getTasks();
    const countCompleted = tasks.reduce(
      (acc: number, task: { completed: boolean }) => {
        return task.completed ? acc + 1 : acc;
      },
      0
    );
    return countCompleted;
  }

  countPendingTasks(): number {
    const tasks = this.getTasks();
    const countPending = tasks.reduce(
      (acc: number, task: { completed: boolean }) => {
        return task.completed ? acc : acc + 1;
      },
      0
    );
    return countPending;
  }

  generateId(): string {
    // Generar un id único utilizando la fecha actual y un número aleatorio
    const timestamp = new Date().getTime();
    const randomNumber = Math.floor(Math.random() * 1000);
    return `${timestamp}-${randomNumber}`;
  }
}
