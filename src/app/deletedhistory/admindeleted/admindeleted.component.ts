import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-admindeleted',
  templateUrl: './admindeleted.component.html',
  styleUrls: ['./admindeleted.component.css']
})
export class AdmindeletedComponent {
  constructor(private _rest: RestService, private _activatedroute: ActivatedRoute) { }

  AllDeletionHistory: any[] = [];


  ngOnInit(): void {
    this.ViewDeletionHistory();
  }

  ViewDeletionHistory() {
    this._activatedroute.params.subscribe(params => {
      const AdminDeletion_id = params['AdminDeletion_id'];
      this._rest.ViewAdminDeletionHistory(AdminDeletion_id).subscribe((data: any) => {
        console.log(data);
        this.AllDeletionHistory = Array.isArray(data.data)
          ? data.data : [data.data];
      })
    })
  }

}
