import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import * as XLSX from 'xlsx';
declare var bootstrap: any;

@Component({
  selector: 'app-inletchallanview',
  templateUrl: './inletchallanview.component.html',
  styleUrls: ['./inletchallanview.component.css']
})
export class InletchallanviewComponent {

  AllChallan: any[] = [];
  Updateinletchallanfrom: FormGroup;

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
    this.ByChallanid();
    this.loadHistory();
  }

  liked: boolean = false;

  Show() {
    this.liked != this.liked;
  }

  History: any = [];
  HeaderHistory: any = [];
  ProductHistory: any = [];

  loadHistory() {

    this._activatedroute.params.subscribe(params => {

      const Challan_id = params['Challan_id'];

      this._rest.GetInletHistory(Challan_id).subscribe((res: any) => {

        this.History = res.data || res;
        // this.HeaderHistory = res.data || res;
        // this.ProductHistory = res.data || res;

        this.HeaderHistory = res.headerHistory;
        this.ProductHistory = res.productHistory;

        this.HeaderHistory = this.HeaderHistory.map((x: any) => ({

          ...x,

          old_header: JSON.parse(x.old_header),

          new_header: JSON.parse(x.new_header)

        }));

        this.ProductHistory = this.ProductHistory.map((x: any) => ({

          ...x,

          old_product: x.old_product ? JSON.parse(x.old_product) : null,

          new_product: x.new_product ? JSON.parse(x.new_product) : null

        }));

        console.log(this.History);
      });

    });
  }

  ByChallanid() {
    this._activatedroute.params.subscribe(params => {
      const Challan_id = params['Challan_id'];
      this._rest.InletchallanbyId(Challan_id).subscribe((data: any) => {
        console.log(data);
        this.AllChallan = Array.isArray(data.data)
          ? data.data : [data.data];
      })
    })
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
    const quantity = Number(product?.Product_Quantity ?? product?.Ordered_Quantity ?? 1);
    const rate = Number(product?.Rate ?? 0);

    return this.fb.group({
      // Keep this ID for existing rows. Leave null for a new product.
      InletProduct_id: [product?.InletProduct_id ?? null],
      Product_Name: [product?.Product_Name ?? '', Validators.required],
      HSN_Code: [product?.HSN_Code ?? ''],
      Product_Quantity: [quantity, [Validators.required, Validators.min(0)]],
      Rate: [rate, [Validators.required, Validators.min(0)]],
      SubTotal: [{ value: quantity * rate, disabled: true }],
      Produced_Quantity: [Number(product?.Produced_Quantity ?? 0), [Validators.min(0)]],
      Damaged_Quantity: [Number(product?.Damaged_Quantity ?? 0), [Validators.min(0)]],
      Faulty_Quantity: [Number(product?.Faulty_Quantity ?? 0), [Validators.min(0)]]
    });
  }

  calculateSubtotal(index: number) {
    const product = this.items.at(index);
    const qty =
      Number(product.get('Product_Quantity')?.value) || 0;
    const rate =
      Number(product.get('Rate')?.value) || 0;
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
          this.ByChallanid();
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
            this.ByChallanid();
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

}