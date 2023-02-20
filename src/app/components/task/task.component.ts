import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UpdateTaskDto } from 'src/app/dto/task.dto';
import { Task } from 'src/app/models/task.model';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent {
  @ViewChild('editInput') editInputRef!: ElementRef<HTMLInputElement>;
  isEditing = false;
  @Input() task: Task;
  @Output() update: EventEmitter<{ id: string; changes: UpdateTaskDto }> =
    new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor() {}

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    const tasks: Task[] = JSON.parse(
      localStorage.getItem('mydayapp-angular') || '[]'
    );
    if (this.isEditing === true) {
      this.isEditing = false;
      this.task.title = tasks.find((t) => t.id === this.task.id)?.title || '';
    }
  }

  activateEditMode() {
    this.isEditing = true;
    setTimeout(() => this.editInputRef.nativeElement.focus());
  }

  updateTaskTitle() {
    const taskTitleUpdate: UpdateTaskDto = {
      title: this.task.title.trim(),
    };
    if (this.task.title.length > 0) {
      this.isEditing = !this.isEditing;
      this.update.emit({ id: this.task.id, changes: taskTitleUpdate });
    }
  }

  updateTaskCompleted() {
    const taskCompletedUpdate: UpdateTaskDto = {
      completed: this.task.completed,
    };
    this.update.emit({ id: this.task.id, changes: taskCompletedUpdate });
  }

  deleteTask() {
    this.delete.emit(this.task.id);
  }
}
