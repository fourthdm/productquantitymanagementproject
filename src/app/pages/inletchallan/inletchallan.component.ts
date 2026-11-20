import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import * as XLSX from 'xlsx';

declare var bootstrap: any;
@Component({
  selector: 'app-inletchallan',
  templateUrl: './inletchallan.component.html',
  styleUrls: ['./inletchallan.component.css']
})
export class InletchallanComponent {

  @Input() Customer_Name: any;
  @Input() Company_Name: any;
  @Input() Delivery_Status: any;
  @Input() Work_Status: any;
  @Input() Challan_Status: any;
  @Input() Added_Date: any;
  @Input() Sales_Order_Number: any;

  AllCustomerData: any[] = [];

  AllSalesOrderData : any[]=[];

  AllChallan: any[] = [];
  Updateinletchallanfrom: FormGroup;

  pro: any;

  constructor(private _rest: RestService, private fb: FormBuilder, private _activatedroute: ActivatedRoute) {
    this.Updateinletchallanfrom = this.fb.group({
      Challan_id: [''],
      Customer_Name: [''],
      Company_Name: [''],
      Company_Address: [''],
      GST_No: [''],
      Delivery_Address: [''],

      SubTotal: [''],
      Total_Amount: [''],
      Discount_Amount: [''],
      CGST_amount: [''],
      SGST_amount: [''],
      Grand_Total: [''],

      Mode_of_Transport: [''],
      Transporter_Name: [''],
      Vehicle_Number: [''],
      Remark: [''],

      Work_Status: [''],
      Delivery_Status: [''],
      Challan_Status: [''],

      items: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.AllchallanDetails();
    this.GetAllCustomer();
    this.AllSalesOrderDetails();
  }

  AllSalesOrderDetails() {
    this._rest.AllSalesOrders().subscribe((data: any) => {
      console.log(data);
      this.AllSalesOrderData = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  liked: boolean = false;

  Show() {
    this.liked = !this.liked;
  }

  GetAllCustomer() {
    this._rest.AllCustomer().subscribe((data: any) => {
      console.log(data);
      this.AllCustomerData = data.data;
    }, (err: any) => {
      console.log(err);
    })
  }

  AllchallanDetails() {
    this._rest.AllInletChallan().subscribe((data: any) => {
      console.log(data);
      this.AllChallan = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  printPdf(Challan_id: any) {
    this._rest.GetChallanPDF(Challan_id).subscribe((file: Blob) => {
      const url = window.URL.createObjectURL(file);
      window.open(url, '_blank');
    });
  }

  addProduct(): void {
    this.items.push(this.createProduct());
  }

  createProduct(product?: any): FormGroup {
    const quantity = Number(
      product?.Product_Quantity ?? product?.Ordered_Quantity ?? 1
    );
    const rate = Number(product?.Rate ?? 0);

    return this.fb.group({
      InletProduct_id: [product?.InletProduct_id ?? null],
      Product_id: [product?.Product_id ?? null],
      Product_Name: [product?.Product_Name ?? '', Validators.required],
      HSN_Code: [product?.HSN_Code ?? ''],
      Product_Quantity: [quantity, [Validators.required, Validators.min(1)]],
      Ordered_Quantity: [Number(product?.Ordered_Quantity ?? quantity), [Validators.required, Validators.min(1)]],
      Available_Extra_Stock: [Number(product?.Available_Extra_Stock ?? 0)],
      Stock_Used: [Number(product?.Stock_Used ?? 0)],
      Manufacturing_Required: [Number(product?.Manufacturing_Required ?? quantity)],
      Produced_Quantity: [Number(product?.Produced_Quantity ?? 0), [Validators.min(0)]],
      Damaged_Quantity: [Number(product?.Damaged_Quantity ?? 0), [Validators.min(0)]],
      Faulty_Quantity: [Number(product?.Faulty_Quantity ?? 0), [Validators.min(0)]],
      Good_Quantity: [Number(product?.Good_Quantity ?? 0)],
      Extra_Quantity: [Number(product?.Extra_Quantity ?? 0)],
      ExtraStock_Posted_Quantity: [Number(product?.ExtraStock_Posted_Quantity ?? 0)],
      Rate: [rate, [Validators.required, Validators.min(0)]],
      SubTotal: [{ value: quantity * rate, disabled: true }]
    });
  }

  calculateSubtotal(index: number) {
    const product = this.items.at(index);
    const qty = Number(product.get('Product_Quantity')?.value) || 0;
    const rate = Number(product.get('Rate')?.value) || 0;
    const subtotal = qty * rate;
    product.get('SubTotal')?.setValue(subtotal);
  }

  get items(): FormArray {
    return this.Updateinletchallanfrom.get('items') as FormArray;
  }

  Selectedchallan: any = null;


  editRequirement(Challan_id: any) {
    const data = this.AllChallan.find(r => r.Challan_id === Challan_id);
    if (!data) return;
    this.Selectedchallan = 1;

    this.Updateinletchallanfrom.patchValue({
      Challan_id: data.Challan_id,
      Customer_Name: data.Customer_Name,
      Company_Name: data.Company_Name,
      Company_Address: data.Company_Address,
      GST_No: data.GST_No,
      Discount_Amount: data.Discount_Amount,
      Delivery_Address: data.Delivery_Address,
      Mode_of_Transport: data.Mode_of_Transport,
      Transporter_Name: data.Transporter_Name,
      Vehicle_Number: data.Vehicle_Number,
      Remark: data.Remark,
      Work_Status: data.Work_Status,
      Delivery_Status: data.Delivery_Status,
      Challan_Status: data.Challan_Status
    });
    // ✅ CLEAR OLD ITEMS
    this.items.clear();
    (data.items ?? []).forEach((p: any) => {
      this.items.push(this.createProduct(p));
    });
  }

  removeProduct(index: number) {
    this.items.removeAt(index);
  }

  Update(): void {
    if (this.Updateinletchallanfrom.invalid) {
      this.Updateinletchallanfrom.markAllAsTouched();
      return;
    }
    const formData = this.Updateinletchallanfrom.getRawValue();
    const challanId = formData.Challan_id;
    this._rest.UpdateChallan(challanId, formData).subscribe({
      next: (res: any) => {
        alert(res.message);
        if (res.success) {
          const modalElement = document.getElementById('exampleModal');
          if (modalElement) {
            bootstrap.Modal.getInstance(modalElement)?.hide();
          }
          this.AllchallanDetails();
        }
      },
      error: (error) => {
        console.error('Update failed:', error);
        alert(error.error?.message || 'Challan update failed.');
      }
    });
  }


  selectedchallanId = 0;
  adminPassword = '';
  deletionReason = '';
  isDeleting: boolean = false;

  openDeleteModal(id: number) {
    this.selectedchallanId = id;
  }

  DeleteChallan() {
    if (!this.adminPassword || this.adminPassword.trim() === '') {
      alert('Please enter Admin Password');
      return;
    }

    if (!this.deletionReason || this.deletionReason.trim() === '') {
      alert('Please enter the reason for deletion');
      return;
    }

    if (this.deletionReason.trim().length < 5) {
      alert('Please enter a valid deletion reason');
      return;
    }
    if (!this.selectedchallanId) {
      alert('Invalid Challan');
      return;
    }
    this.isDeleting = true;
    this._rest.DeleteChallan(
      this.selectedchallanId,
      this.adminPassword,
      this.deletionReason.trim()
    )
      .subscribe({

        next: (res: any) => {

          this.isDeleting = false;

          alert(res.message);


          if (res.success) {

            // Refresh challan list
            this.AllchallanDetails();
            // Clear values
            this.adminPassword = '';

            this.deletionReason = '';

            this.selectedchallanId = 0;

            this.liked = false;


            // Close modal
            const modalElement =
              document.getElementById('deleteVendorModal');

            if (modalElement) {

              const modal =
                (window as any).bootstrap.Modal
                  .getInstance(modalElement);
              if (modal) {
                modal.hide();
              }
            }
          }
        },

        error: (err) => {
          this.isDeleting = false;
          console.log(err);
          if (err.error && err.error.message) {
            alert(err.error.message);
          } else {
            alert('Something went wrong while deleting challan');
          }
        }
      });
  }

  DatabyDate() {
    this._rest.challanDatabyDate({ Added_Date: this.Added_Date }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllChallan = data.data;
      } else {
        this.AllChallan = [];
      }
      this.Added_Date = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyChallanStatus() {
    this._rest.DatabyChallanStatus({ Challan_Status: this.Challan_Status }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllChallan = data.data;
      } else {
        this.AllChallan = [];
      }
      this.Challan_Status = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyDeliveryStatus() {
    this._rest.DatabyDeliveryStatus({ Delivery_Status: this.Delivery_Status }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllChallan = data.data;
      } else {
        this.AllChallan = [];
      }
      this.Delivery_Status = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyWorkStatus() {
    this._rest.DatabyWorkStatus({ Work_Status: this.Work_Status }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllChallan = data.data;
      } else {
        this.AllChallan = [];
      }
      this.Work_Status = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyCustomername() {
    this._rest.DatabyCustomerName({ Customer_Name: this.Customer_Name }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllChallan = data.data;
      } else {
        this.AllChallan = [];
      }
      this.Customer_Name = '';
    }, (err: any) => {
      console.log(err);
    })
  }

  DatabyCompanyname() {
    this._rest.DatabyCompanyName({ Company_Name: this.Company_Name }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllChallan = data.data;
      } else {
        this.AllChallan = [];
      }
      this.Company_Name = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabySalesorderNumber() {
    this._rest.InletchallanDatabySaleOrderNumber({ Sales_Order_Number: this.Sales_Order_Number }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllChallan = data.data;
      } else {
        this.AllChallan = [];
      }
      this.Sales_Order_Number = '';
    }, (err: any) => {
      console.log(err);
    })
  }

  exportexcel(): void {
    const data: any[][] = [];
    // Header
    data.push([
      'Sr No',
      'Challan Code',
      'Customer',
      'Company_Name',
      'Company_Address',
      'GST_No',
      'Delivery_Address',
      'Sub_Total',
      'Total_Amount',
      'Discount_Amount',
      'CGST_amount',
      'SGST_amount',
      'Grand_Total',
      'Mode_of_Transport',
      'Transporter_Name',
      'Vehicle_Number',
      'Remark',
      'Work_Status',
      'Delivery_Status',
      'Challan_Status',
      'Added_Date',
      'Updated_Date',

      'Product',
      'HSN_Code',
      'Qty',
      'Rate',
      'Subtotal'
    ]);

    const merges: XLSX.Range[] = [];

    let row = 1;

    this.AllChallan.forEach((challan: any, index: number) => {

      const startRow = row;

      challan.items.forEach((item: any, i: number) => {

        data.push([
          i === 0 ? index + 1 : '',
          i === 0 ? challan.Challan_Code : '',
          i === 0 ? challan.Customer_Name : '',
          i === 0 ? challan.Company_Name : '',
          i === 0 ? challan.Company_Address : '',
          i === 0 ? challan.GST_No : '',
          i === 0 ? challan.Delivery_Address : '',
          i === 0 ? challan.Sub_Total : '',
          i === 0 ? challan.Total_Amount : '',
          i === 0 ? challan.Discount_Amount : '',
          i === 0 ? challan.CGST_amount : '',
          i === 0 ? challan.SGST_amount : '',
          i === 0 ? challan.Grand_Total : '',
          i === 0 ? challan.Mode_of_Transport : '',
          i === 0 ? challan.Transporter_Name : '',
          i === 0 ? challan.Vehicle_Number : '',
          i === 0 ? challan.Remark : '',
          i === 0 ? challan.Work_Status : '',
          i === 0 ? challan.Delivery_Status : '',
          i === 0 ? challan.Challan_Status : '',
          i === 0 ? challan.Added_Date : '',
          i === 0 ? challan.Updated_Date : '',

          item.Product_Name,
          item.HSN_Code,
          item.Product_Quantity,
          item.Rate,
          item.SubTotal
        ]);

        row++;
      });

      const endRow = row - 21;

      if (endRow > startRow) {

        merges.push({ s: { r: startRow, c: 0 }, e: { r: endRow, c: 0 } });

        merges.push({ s: { r: startRow, c: 1 }, e: { r: endRow, c: 1 } });

        merges.push({ s: { r: startRow, c: 2 }, e: { r: endRow, c: 2 } });

      }

    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    worksheet['!merges'] = merges;

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'All Challan');

    XLSX.writeFile(workbook, 'AllChallan.xlsx');
  }

}
