import { Component, OnInit } from '@angular/core';
import { CreateTaskDto, UpdateTaskDto } from 'src/app/dto/task.dto';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  tasks: Task[] = [];
  subscription: Subscription;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.refreshList();
    this.subscription = this.taskService.tasksUpdate$.subscribe(() => {
      this.refreshList();
    });
  }

  refreshList() {
    if (this.taskService.getTasks()) {
      this.tasks = this.taskService.getTasks();
    }
  }

  createTask(event: any) {
    const title = event.target.value;
    const task: CreateTaskDto = {
      title: title.trim(),
    };
    if (title.length > 0) {
      this.taskService.create(task);
      console.log('Create task');
      this.refreshList();
      this.router.navigate(['/all']);
      (event.target as HTMLInputElement).value = '';
    }
  }
}
