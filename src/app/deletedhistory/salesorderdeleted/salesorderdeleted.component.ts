import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-salesorderdeleted',
  templateUrl: './salesorderdeleted.component.html',
  styleUrls: ['./salesorderdeleted.component.css']
})
export class SalesorderdeletedComponent {

  constructor(private _rest: RestService, private _activatedroute: ActivatedRoute) { }

  AllDeletionHistory: any[] = [];

  ngOnInit(): void {
    this.ViewDeletionHistory();
  }

  ViewDeletionHistory() {
    this._activatedroute.params.subscribe(params => {
      const SalesorderDeleted_id = params['SalesorderDeleted_id'];
      this._rest.ViewSalesOrderDeletionHistory(SalesorderDeleted_id).subscribe((data: any) => {
        console.log(data);
        this.AllDeletionHistory = Array.isArray(data.data)
          ? data.data : [data.data];
      })
    })
  }
}
