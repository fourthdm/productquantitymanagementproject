import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-vendordeleted',
  templateUrl: './vendordeleted.component.html',
  styleUrls: ['./vendordeleted.component.css']
})
export class VendordeletedComponent {
  constructor(private _rest: RestService, private _activatedroute: ActivatedRoute) { }

  AllDeletionHistory: any[] = [];


  ngOnInit(): void {
    this.ViewDeletionHistory();
  }

  ViewDeletionHistory() {
    this._activatedroute.params.subscribe(params => {
      const VendorDeletion_id = params['VendorDeletion_id'];
      this._rest.ViewVendorDeletionHistory(VendorDeletion_id).subscribe((data: any) => {
        console.log(data);
        this.AllDeletionHistory = Array.isArray(data.data)
          ? data.data : [data.data];
      })
    })
  }
}
