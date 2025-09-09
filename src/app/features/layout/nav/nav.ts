import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { User } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, RouterOutlet],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
   @ViewChild('sideMenu', { static: false }) sideMenu!: ElementRef;
  @ViewChild('menuBtn', { static: false }) menuBtn!: ElementRef;
  @ViewChild('closeBtn', { static: false }) closeBtn!: ElementRef;
  user: User | null = null;
  showTestWarning: boolean = false; 
  authorities: string[] = [];
  showConfig = false;

  toggleConfig() {
    this.showConfig = !this.showConfig;
  }

  constructor(
    
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

   ngOnInit(): void {
    this.getUserInfo();
    this.authorities = this.authService.getAuthorities();
  }

  hasRole(role: string): boolean {
    return this.authorities.includes(role);
  }

  getUserInfo(): void {

    this.authService.getUserInfo().subscribe({
      next: (data) => {
      
        this.user = data; 
      },
      error: (err) => {
        
        this.showTestWarning = true; 
      }
    });
  }

  logout(): void {
    this.authService.logout();
    
  }

  private menuClickHandler = () => {
    this.sideMenu.nativeElement.style.display = 'block';
  };

  private closeClickHandler = () => {
    this.sideMenu.nativeElement.style.display = 'none';
  };

  ngAfterViewInit() {
    this.menuBtn?.nativeElement.addEventListener('click', this.menuClickHandler);
    this.closeBtn?.nativeElement.addEventListener('click', this.closeClickHandler);
  }

  ngOnDestroy() {
    this.menuBtn?.nativeElement.removeEventListener('click', this.menuClickHandler);
    this.closeBtn?.nativeElement.removeEventListener('click', this.closeClickHandler);
  }

  activeOption: string = '';
  setActive(option: string) {
    this.activeOption = option;
  }
}
