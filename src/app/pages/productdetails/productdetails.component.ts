import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})
export class ProductdetailsComponent implements OnInit {
  pro: any;
  
  Extraproduct: any[] = [];

  constructor(private _rest: RestService) { }

  ngOnInit(): void {
    this.ExtraProduct();
  }
  ExtraProduct() {
    this._rest.ExtraProduct().subscribe((data: any) => {
      console.log(data);
      this.Extraproduct = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

}
