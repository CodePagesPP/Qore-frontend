import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorModal } from './features/layout/error-modal/error-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('qore-frontend');
}
