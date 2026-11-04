import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { FooterComponent } from './common/footer/footer.component';
import { LoginComponent } from './common/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { VendorComponent } from './pages/vendor/vendor.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InletchallanComponent } from './pages/inletchallan/inletchallan.component';
import { OutwardchallanComponent } from './pages/outwardchallan/outwardchallan.component';
import { ChallansComponent } from './pages/challans/challans.component';
import { SalesorderComponent } from './pages/salesorder/salesorder.component';
import { DeleteddataComponent } from './pages/deleteddata/deleteddata.component';
import { InletchallandeletedComponent } from './deletedhistory/inletchallandeleted/inletchallandeleted.component';
import { VendorchallandeletedComponent } from './deletedhistory/vendorchallandeleted/vendorchallandeleted.component';
import { SalesorderdeletedComponent } from './deletedhistory/salesorderdeleted/salesorderdeleted.component';
import { InletchallanviewComponent } from './views/inletchallanview/inletchallanview.component';
import { OutwardchallanviewComponent } from './views/outwardchallanview/outwardchallanview.component';
import { SalesorderviewComponent } from './views/salesorderview/salesorderview.component';
import { ChallanbysaleordernumberComponent } from './views/challanbysaleordernumber/challanbysaleordernumber.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { SalesorderlistComponent } from './pages/salesorderlist/salesorderlist.component';
import { ProductdetailsComponent } from './pages/productdetails/productdetails.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    AdminComponent,
    CustomerComponent,
    VendorComponent,
    HomeComponent,
    DashboardComponent,
    InletchallanComponent,
    OutwardchallanComponent,
    ChallansComponent,
    SalesorderComponent,
    DeleteddataComponent,
    InletchallandeletedComponent,
    VendorchallandeletedComponent,
    SalesorderdeletedComponent,
    InletchallanviewComponent,
    OutwardchallanviewComponent,
    SalesorderviewComponent,
    ChallanbysaleordernumberComponent,
    SalesorderlistComponent,
    ProductdetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
