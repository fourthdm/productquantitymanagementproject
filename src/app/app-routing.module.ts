import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './common/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { VendorComponent } from './pages/vendor/vendor.component';
import { ChallansComponent } from './pages/challans/challans.component';
import { SalesorderComponent } from './pages/salesorder/salesorder.component';
import { SalesorderviewComponent } from './views/salesorderview/salesorderview.component';
import { SalesorderdeletedComponent } from './deletedhistory/salesorderdeleted/salesorderdeleted.component';
import { InletchallanComponent } from './pages/inletchallan/inletchallan.component';
import { InletchallanviewComponent } from './views/inletchallanview/inletchallanview.component';
import { ChallanbysaleordernumberComponent } from './views/challanbysaleordernumber/challanbysaleordernumber.component';
import { OutwardchallanComponent } from './pages/outwardchallan/outwardchallan.component';
import { OutwardchallanviewComponent } from './views/outwardchallanview/outwardchallanview.component';
import { DeleteddataComponent } from './pages/deleteddata/deleteddata.component';
import { VendorchallandeletedComponent } from './deletedhistory/vendorchallandeleted/vendorchallandeleted.component';
import { InletchallandeletedComponent } from './deletedhistory/inletchallandeleted/inletchallandeleted.component';
import { SalesorderlistComponent } from './pages/salesorderlist/salesorderlist.component';
import { ProductdetailsComponent } from './pages/productdetails/productdetails.component';

const routes: Routes = [
    { path: ' ', redirectTo: 'login', pathMatch: "full" },
  { path: 'login', component: LoginComponent },
  {
    path: 'Home', component: HomeComponent, children: [
      { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
      { path: 'Dashboard', component: DashboardComponent },
      { path: 'Admin', component: AdminComponent, title: 'Admin pages' },
      { path: 'Customer', component: CustomerComponent },
      { path: 'Vendor', component: VendorComponent },
      { path: 'Challan', component: ChallansComponent },
      { path: 'ProductDetails', component:ProductdetailsComponent },
      { path: 'Salesorder', component: SalesorderComponent },
      { path: 'SalesOrderList', component: SalesorderlistComponent },
      { path: 'SalesorderData/:SalesOrder_id', component: SalesorderviewComponent },
      { path: 'DeletedSalesOrderHistory/:SalesorderDeleted_id', component: SalesorderdeletedComponent },
      { path: 'Inletchallan', component: InletchallanComponent },
      { path: 'InletchallanData/:Challan_id', component: InletchallanviewComponent },
      { path: 'InletchallanDataSaleOrder/:Sales_Order_Number', component: ChallanbysaleordernumberComponent },
      { path: 'OutwardChallan', component: OutwardchallanComponent },
      { path: 'OutwardChallanData/:VendorChallan_id', component: OutwardchallanviewComponent },

      // { path: 'Vendorreceipts/:VendorChallan_id', component: VendorreceiptsComponent },

      { path: 'Deleteddata', component: DeleteddataComponent },
      { path: 'DeletedOutwardChallanHistory/:DeletionHistory_id', component: VendorchallandeletedComponent },
      { path: 'DeletedInletChallanHistory/:Deletionchallan_id', component: InletchallandeletedComponent },
      { path: '**', redirectTo: 'Dashboard' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
