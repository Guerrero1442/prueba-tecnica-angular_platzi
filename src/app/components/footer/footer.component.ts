import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  tasks: Task[] = [];
  currentUrl: string;
  countTaskPending: number;
  subscription: Subscription;

  constructor(private taskService: TaskService, private route: ActivatedRoute) {
    this.route.url.subscribe((url) => {
      this.currentUrl = url.join('/');
    });
  }

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
    this.countTaskPending = this.taskService.countPendingTasks();
    this.subscription = this.taskService.tasksUpdate$.subscribe(() => {
      this.countTaskPending = this.taskService.countPendingTasks();
    });
  }

  clearCompleted() {
    this.taskService.clearTasks();
  }
}
