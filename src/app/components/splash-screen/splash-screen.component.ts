import {Component, HostBinding, input} from '@angular/core';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.scss'
})
export class SplashScreenComponent {

  loading = input(true)

  @HostBinding('class.loading') get loadingClass() {
    return this.loading();
  }

}