import { Component, HostListener, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Leftsidebar } from '../../leftsidebar/leftsidebar';
import { Users } from '../users/users';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, Leftsidebar, Users],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout implements OnInit {

  isLeftSidebarCollapsedLay = signal<boolean>(true);
  screenWidth = signal<number>(window.innerWidth);

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsedLay.set(true);
    }
  }

  ngOnInit(): void {
    this.isLeftSidebarCollapsedLay.set(this.screenWidth() < 768);  // ✅ run once on init
  }

  changeIsLeftSidebarCollapsedLayout(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsedLay.set(isLeftSidebarCollapsed);
  }
}
