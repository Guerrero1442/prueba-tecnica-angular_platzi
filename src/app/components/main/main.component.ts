import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UpdateTaskDto } from 'src/app/dto/task.dto';
import { TaskService } from 'src/app/services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export default class MainComponent implements OnInit, OnChanges {
  tasks: Task[];
  selectedFilter: string;
  subscription: Subscription;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}
  ngOnChanges(): void {
    console.log(this.tasks, 'tasks');
  }
  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.selectedFilter = data.filter;
      this.filterTasks();
    });
    this.subscription = this.taskService.tasksUpdate$.subscribe(() => {
      this.filterTasks();
    });
  }

  filterTasks() {
    switch (this.selectedFilter) {
      case 'all':
        this.tasks = this.taskService.getTasks();
        break;
      case 'pending':
        this.tasks = this.taskService
          .getTasks()
          .filter((task: { completed: boolean }) => !task.completed);
        break;
      case 'completed':
        this.tasks = this.taskService
          .getTasks()
          .filter((task: { completed: boolean }) => task.completed);
        break;
      default:
        break;
    }
  }
  refreshList() {
    if (this.taskService.getTasks()) {
      this.tasks = this.taskService.getTasks();
    }
  }

  updateTask(event: { id: string; changes: UpdateTaskDto }) {
    this.taskService.update(event.id, event.changes);
    this.refreshList();
  }

  deleteTask(id: Task['id']) {
    this.taskService.delete(id);
    this.refreshList();
  }
}
