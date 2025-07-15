import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Libro } from "./libro/libro";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Libro],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('diariom');
}
