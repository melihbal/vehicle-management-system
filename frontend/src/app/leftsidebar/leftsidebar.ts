import { CommonModule } from '@angular/common';
import { Component, computed, input, OnInit, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router'; 
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { NotExpr } from '@angular/compiler';

@Component({
  selector: 'app-leftsidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './leftsidebar.html',
  styleUrls: ['./leftsidebar.css'],
  host: {
    '[class]': 'hostClasses()'
  }
})


export class Leftsidebar implements OnInit {


  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  //token = localStorage.getItem('token');


  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSideBarCollapsed = output<boolean>();
  userRole: string = '';
  visibleItems : any[] = [];

  items = [
    {
      routeLink: 'dashboard',
      icon: 'fal fa-home',
      label: 'Dashboard',
      visibleTo: ['user', 'admin', 'employee']
    },
    {
      routeLink: 'users',
      icon: 'fal fa-file',
      label: 'Users ',
      visibleTo: ['employee', 'admin']
    }

  ]

  hostClasses = computed(() =>
    this.isLeftSidebarCollapsed() ? 'collapsed' : 'expanded'
  );
  

  toggleCollapse() {
    this.changeIsLeftSideBarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }

  closeSidenav(): void {
    this.changeIsLeftSideBarCollapsed.emit(true);
  }

  refreshTokens() {
    this.http.post('http://localhost:5027/api/User/RefreshToken', {}, { withCredentials: true})
      .subscribe({
        next: () => {
          console.log("Tokens refreshed.")
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  onBottomButtonClick() : void {
    this.http.post('http://localhost:5027/api/User/RevokeToken', {}, { withCredentials: true})
      .subscribe({
        next: (msg) => {
          console.log(msg);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error("Error revoking token.", err);
          this.router.navigate(['/login']);
        }
      })
  }

  ngOnInit(): void {
    this.http.get<any>('http://localhost:5027/api/User/Me', { withCredentials: true })
      .subscribe({
        next: (user) => {
          this.userRole = user.role;
          if (this.userRole == null){
            this.refreshTokens();
            return this.ngOnInit();
          }
          this.visibleItems = this.items.filter(i => i.visibleTo.includes(this.userRole));
          console.log("user: ", user);
        },
        error: (err) => {
          console.error("Not logged in or token expired", err);
        }
      });
  }

  }


