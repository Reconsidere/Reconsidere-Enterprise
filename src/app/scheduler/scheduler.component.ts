import { AbstractControl } from '@angular/forms';
import { routes } from './../app.routing';
import {
  Component,
  OnInit,
  enableProdMode,
  NgModule,
  ViewChild
} from '@angular/core';
import { Organization } from 'src/models/organization';
import { HttpClient } from '@angular/common/http';
import { SchedulerService } from 'src/services/scheduler.service';
import { Schedule } from 'src/models/schedule';
import { Turn } from 'src/models/turn';
import { UserService, AuthService } from 'src/services';
import { User } from 'src/models';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  msgStatus: string;
  showMessage: boolean;
  users: User[] = [];

  constructor(
    private servive: SchedulerService,
    private userService: UserService
  ) {}
  ngOnInit() {
    const id = JSON.parse(localStorage.getItem('currentOrganizationID'));
    this.userService
      .getAll(id, this.users)
      .pipe()
      .subscribe(users => {
        this.users = users;
      });

    this.servive.get(id).subscribe(x => this.loadGeoroutes(x));
  }

  loadGeoroutes(value) {}

  veryfyBeforeSave(object) {}
}
