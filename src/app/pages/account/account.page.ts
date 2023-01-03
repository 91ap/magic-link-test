import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profile, SupabaseService } from 'src/app/supabase.service';

@Component({
  selector: 'app-account',
  templateUrl: `
  <ion-header>
      <ion-toolbar>
        <ion-title>Account</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form>
        <ion-item>
          <ion-label position="stacked">Email</ion-label>
          <ion-input type="email" [value]="session?.user?.email"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Name</ion-label>
          <ion-input type="text" name="username" [(ngModel)]="profile.username"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Website</ion-label>
          <ion-input type="url" name="website" [(ngModel)]="profile.website"></ion-input>
        </ion-item>
        <div class="ion-text-center">
          <ion-button fill="clear" (click)="updateProfile()">Update Profile</ion-button>
        </div>
      </form>

      <div class="ion-text-center">
        <ion-button fill="clear" (click)="signOut()">Log Out</ion-button>
      </div>
    </ion-content>
  `,
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  profile: Profile = {
    username: '',
    avatar_url: '',
    website: '',
  };

  session = this.supabase.session;

  constructor(
    private readonly supabase: SupabaseService,
    private router: Router
  ) {}
  ngOnInit() {
    this.getProfile();
  }

  async getProfile() {
    try {
      let { data: profile, error, status } = await this.supabase.profile;
      if (error && status !== 406) {
        throw error;
      }
      if (profile) {
        this.profile = profile;
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async updateProfile(avatar_url: string = '') {
    const loader = await this.supabase.createLoader();
    await loader.present();
    try {
      await this.supabase.updateProfile({ ...this.profile, avatar_url });
      await loader.dismiss();
      await this.supabase.createNotice('Profile updated!');
    } catch (error) {
      await this.supabase.createNotice(error.message);
    }
  }

  async signOut() {
    console.log('testing?');
    await this.supabase.signOut();
    this.router.navigate(['/'], { replaceUrl: true });
  }
}
