import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet,Navbar,Sidebar],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout {

}
