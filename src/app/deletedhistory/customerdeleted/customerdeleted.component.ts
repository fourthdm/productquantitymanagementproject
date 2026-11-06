import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-customerdeleted',
  templateUrl: './customerdeleted.component.html',
  styleUrls: ['./customerdeleted.component.css']
})
export class CustomerdeletedComponent {
 constructor(private _rest: RestService, private _activatedroute: ActivatedRoute) { }

  AllDeletionHistory: any[] = [];


 ngOnInit(): void {
    this.ViewDeletionHistory();
  }

    ViewDeletionHistory() {
    this._activatedroute.params.subscribe(params => {
      const CustomerDeletion_id = params['CustomerDeletion_id'];
      this._rest.ViewCustomerDeletionHistory(CustomerDeletion_id).subscribe((data: any) => {
        console.log(data);
        this.AllDeletionHistory = Array.isArray(data.data)
          ? data.data : [data.data];
      })
    })
  }

}
