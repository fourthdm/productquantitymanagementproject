import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';

declare var bootstrap: any;

@Component({
  selector: 'app-salesorderlist',
  templateUrl: './salesorderlist.component.html',
  styleUrls: ['./salesorderlist.component.css']
})
export class SalesorderlistComponent {
  SelectedSalesOrder: any = null;
  AllSaleorders: any[] = [];
  AllCustomerData: any[] = [];
  UpdateSalesOrderform: FormGroup;
  InletChallanForm: FormGroup;
  submitted = false;
  loading = false;

  pro: any;

  constructor(private _rest: RestService, private fb: FormBuilder, private router: Router) {

    this.InletChallanForm = this.fb.group({
      Sales_Order_Number: [''],
      Customer_Name: [''],
      Company_Name: [''],
      Company_Address: [''],
      GST_No: [''],
      Delivery_Address: [''],
      Discount_Amount: [''],
      Mode_of_Transport: [''],
      Transporter_Name: [''],
      Vehicle_Number: ['', Validators.minLength(10)],
      Remark: [''],
      Work_Status: ['In Queue'],
      Delivery_Status: ['Not Delivered'],
      Challan_Status: ['Open'],
      items: this.fb.array([])
    });

    this.UpdateSalesOrderform = this.fb.group({
      SalesOrder_id: [''],
      Customer_Name: [''],
      Company_Name: [''],
      Company_Address: [''],
      GST_No: [''],
      Delivery_Address: [''],
      SubTotal: [''],
      Discount_Amount: [''],
      Total_Amount: [''],
      CGST_amount: [''],
      SGST_amount: [''],
      Grand_Total: [''],
      Remark: [''],
      Sales_Order_Status: [''],
      itemsupdate: this.fb.array([
        this.createUpdatedProduct()
      ])
    })
  }
  ngOnInit(): void {
    this.AllSalesOrderDetails();
  }
  AllSalesOrderDetails() {
    this._rest.AllSalesOrders().subscribe((data: any) => {
      console.log(data);
      this.AllSaleorders = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  liked: boolean = false;
  Show() {
    this.liked = !this.liked;
  }
  selectedSalesorderId = 0;
  adminPassword = '';
  deletionReason = '';
  isDeleting: boolean = false;
  openDeleteModal(id: number) {
    this.selectedSalesorderId = id;
  }
  DeleteSalesorder() {
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
    if (!this.selectedSalesorderId) {
      alert('Invalid SalesOrder');
      return;
    }
    this.isDeleting = true;
    this._rest.DeleteSalesOrder(
      this.selectedSalesorderId,
      this.adminPassword,
      this.deletionReason.trim()
    )
      .subscribe({
        next: (res: any) => {
          this.isDeleting = false;
          alert(res.message);
          if (res.success) {
            // Refresh challan list
            this.AllSalesOrderDetails();
            // Clear values
            this.adminPassword = '';
            this.deletionReason = '';
            this.selectedSalesorderId = 0;
            this.liked = false;
            // Close modal
            const modalElement = document.getElementById('deleteVendorModal');
            if (modalElement) {
              const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
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
            alert('Something went wrong while deleting Salesorder');
          }
        }
      });
  }

  printPdf(SalesOrder_id: any) {
    this._rest.GetSalesOrderPdf(SalesOrder_id).subscribe((file: Blob) => {
      const url = window.URL.createObjectURL(file);
      window.open(url, '_blank')
    });
  }

  addUpdatedProduct() {
    this.itemsupdate.push(
      this.createUpdatedProduct()
    );
  }

  createUpdatedProduct(): FormGroup {
    return this.fb.group({
      SalesOrderItem_id: [],
      Product_Name: ['', Validators.required],
      HSN_Code: [''],
      Ordered_Quantity: [1, Validators.required],
      Rate: [0, Validators.required],
      SubTotal: [{ value: 0, disabled: true }]
    });
  }

  calculateSubtotal(index: number) {
    const product = this.itemsupdate.at(index);
    const qty = Number(product.get('Ordered_Quantity')?.value) || 0;
    const rate = Number(product.get('Rate')?.value) || 0;
    const subtotal = qty * rate;
    product.get('SubTotal')?.setValue(subtotal);
  }

  get itemsupdate(): FormArray {
    return this.UpdateSalesOrderform.get('itemsupdate') as FormArray;
  }

  SelectedSaleorder: any = null;

  editRequirement(SalesOrder_id: any) {
    const data = this.AllSaleorders.find(
      r => Number(r.SalesOrder_id) === Number(SalesOrder_id)
    );
    if (!data) {
      console.error('Sales Order not found:', SalesOrder_id);
      return;
    }
    console.log('Selected Sales Order:', data);
    this.SelectedSaleorder = 1;
    // ------------------------------------
    // Patch Sales Order Main Details
    // ------------------------------------
    this.UpdateSalesOrderform.patchValue({
      SalesOrder_id: data.SalesOrder_id,
      Customer_Name: data.Customer_Name,
      Company_Name: data.Company_Name,
      Company_Address: data.Company_Address,
      Delivery_Address: data.Delivery_Address,
      GST_No: data.GST_No,
      SubTotal: data.SubTotal || 0,
      // Total_Amount: data.Total_Amount || 0,
      Discount_Amount: data.Discount_Amount || 0,
      CGST_amount: data.CGST_amount || 0,
      SGST_amount: data.SGST_amount || 0,
      Grand_Total: data.Grand_Total || 0,
      Remark: data.Remark || '',
      Sales_Order_Status: data.Sales_Order_Status || ''
    });

    // ------------------------------------
    // Clear Existing FormArray
    // ------------------------------------
    this.itemsupdate.clear();

    // ------------------------------------
    // Get Products
    // ------------------------------------
    const products =
      data.itemsupdate ||
      data.items ||
      data.SalesOrderItems ||
      data.products ||
      [];

    console.log('Products to patch:', products);

    // ------------------------------------
    // Patch Products
    // ------------------------------------
    products.forEach((s: any) => {

      const qty = Number(s.Ordered_Quantity) || 0;
      const rate = Number(s.Rate) || 0;

      this.itemsupdate.push(
        this.fb.group({
          SalesOrderItem_id: [s.SalesOrderItem_id || null],

          Product_Name: [
            s.Product_Name || '',
            Validators.required
          ],

          HSN_Code: [
            s.HSN_Code || ''
          ],

          Ordered_Quantity: [
            qty,
            Validators.required
          ],

          Rate: [
            rate,
            Validators.required
          ],

          SubTotal: [
            {
              value: qty * rate,
              disabled: true
            }
          ]
        })
      );

    });

    console.log(
      'FormArray after patch:',
      this.itemsupdate.value
    );
  }

  removeUpdateProduct(index: number) {
    this.itemsupdate.removeAt(index);
  }

  Update() {
    if (this.UpdateSalesOrderform.invalid) {
      this.UpdateSalesOrderform.markAllAsTouched();
      return;
    }
    const SalesOrder_id = this.UpdateSalesOrderform.get('SalesOrder_id')?.value;
    const formData = this.UpdateSalesOrderform.getRawValue();
    console.log('Updating Sales Order:', formData);
    this._rest.UpdateaSaleOrder(
      SalesOrder_id,
      formData
    ).subscribe({
      next: (res: any) => {
        alert(res.message);
        if (res.success) {
          this.AllSalesOrderDetails();
          const modalElement =
            document.getElementById('exampleModal');
          if (modalElement) {
            const modal =
              bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            }
          }
          console.log(
            'Sales Order Updated Successfully'
          );
        }
      },
      error: (error) => {
        console.error(
          'Update Sales Order failed:',
          error
        );
      }
    });
  }


  ConfirmSalesOrder(SalesOrder_id: number): void {
    if (!confirm('Are you sure you want to confirm this Sales Order?')
    ) {
      return;
    }
    this._rest.ConfirmSalesOrder(SalesOrder_id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.AllSalesOrderDetails();
        } else { }
      },
      error: (err) => { console.error(err); }
    });
  }

  CreateInletChallan(SalesOrder_id: number): void {
    if (!SalesOrder_id) {
      alert('Sales Order ID is missing.');
      return;
    }

    this._rest.SalesOrderbyId(SalesOrder_id).subscribe({
      next: (res: any) => {
        if (!res?.success) {
          alert(res?.message || 'Unable to retrieve Sales Order.');
          return;
        }

        const order = Array.isArray(res.data)
          ? res.data[0]
          : res.data;

        if (!order) {
          alert('Sales Order not found.');
          return;
        }

        const id = Number(
          order.SalesOrder_id ?? order.Sales_Order_id
        );

        if (!id) {
          alert('Sales Order ID is missing from the response.');
          return;
        }

        // Your backend requires exactly "Confirm".
        if (order.Sales_Order_Status !== 'Confirm') {
          alert('Confirm the Sales Order before creating an Inlet Challan.');
          return;
        }

        this.SelectedSalesOrder = {
          ...order,
          SalesOrder_id: id
        };

        // The Sales Order API must include its salesorderitems.
        if (!Array.isArray(order.items) || order.items.length === 0) {
          console.error('Sales Order items missing:', order);
          alert(
            'Sales Order products were not returned. Update the Sales Order API to include its items.'
          );
          return;
        }

        this.FillInletChallanForm(order);

        const modalElement = document.getElementById(
          'createInletChallanModal'
        );

        const bootstrap = (window as any).bootstrap;

        if (!modalElement || !bootstrap) {
          alert('Unable to open the Inlet Challan modal.');
          return;
        }

        bootstrap.Modal
          .getOrCreateInstance(modalElement)
          .show();
      },
      error: (err: any) => {
        console.error('Sales Order API Error:', err);
        alert(
          err.error?.message || 'Unable to load Sales Order details.'
        );
      }
    });
  }
  get items(): FormArray {
    return this.InletChallanForm.get(
      'items'
    ) as FormArray;
  }

FillInletChallanForm(order: any): void {
  this.items.clear();

  const products = Array.isArray(order.items) ? order.items : [];

  products.forEach((item: any) => {
    const orderedQty = Number(item.Ordered_Quantity) || 0;
    const availableStock = Number(item.Available_Extra_Stock) || 0;
    const rate = Number(item.Rate) || 0;

    const stockUsed = Math.min(orderedQty, availableStock);
    const manufacturingRequired = Math.max(
      orderedQty - stockUsed,
      0
    );

    this.items.push(this.fb.group({
      SalesOrderItem_id: [item.SalesOrderItem_id],
      Product_Name: [item.Product_Name || ''],
      HSN_Code: [item.HSN_Code || ''],

      Product_Quantity: [orderedQty],
      Ordered_Quantity: [{ value: orderedQty, disabled: true }],

      Available_Extra_Stock: [{
        value: availableStock,
        disabled: true
      }],

      Stock_Used: [{
        value: stockUsed,
        disabled: true
      }],

      Manufacturing_Required: [{
        value: manufacturingRequired,
        disabled: true
      }],

      Produced_Quantity: [0],
      Damaged_Quantity: [0],
      Faulty_Quantity: [0],
      Good_Quantity: [{ value: 0, disabled: true }],
      Extra_Quantity: [{ value: 0, disabled: true }],

      Rate: [rate],
      SubTotal: [{
        value: orderedQty * rate,
        disabled: true
      }]
    }));
  });
}

  SubmitInletChallan(): void {
    if (this.InletChallanForm.invalid) {
      this.InletChallanForm.markAllAsTouched();
      return;
    }
    const formValue = this.InletChallanForm.getRawValue();
    const SalesOrder_id = Number(
      this.SelectedSalesOrder?.SalesOrder_id
    );
    if (!SalesOrder_id) {
      alert('Sales Order ID is missing.');
      return;
    }

    const payload = {
      Mode_of_Transport: formValue.Mode_of_Transport || null,
      Transporter_Name: formValue.Transporter_Name || null,
      Vehicle_Number: formValue.Vehicle_Number || null,
      Remark: formValue.Remark || null
    };
    this._rest.CreateInletChallanFromSalesOrder(
      this.SelectedSalesOrder.SalesOrder_id,
      payload
    ).subscribe({
      next: (res: any) => {
        if (!res?.success) {
          alert(res?.message || 'Unable to create Inlet Challan.');
          return;
        }
        alert(
          `Inlet Challan created successfully!\nChallan Code: ${res.Challan_Code}`
        );

        const modalElement = document.getElementById(
          'createInletChallanModal'
        );

        if (modalElement) {
          (window as any).bootstrap.Modal
            .getInstance(modalElement)?.hide();
        }

        this.AllSalesOrderDetails();
      },
      error: (err: any) => {
        console.error('Create Inlet Challan Error:', err);
        alert(
          err.error?.message || 'Failed to create Inlet Challan.'
        );
      }
    });
  }

  ViewInletChallan(Sales_Order_Number: string): void {
    if (!Sales_Order_Number) {
      console.error('Sales Order Number is missing');
      return;
    }
    const encodedNumber = encodeURIComponent(Sales_Order_Number);
    console.log('Navigating to:', '/Home/InletchallanDataSaleOrder/' + encodedNumber);
    this.router.navigate(['/Home/InletchallanDataSaleOrder', encodedNumber]);
  }


  LoadExtraStock(productForm: FormGroup): void {

    const productName = String(
      productForm.get('Product_Name')?.value || ''
    ).trim();

    const hsnCode = String(
      productForm.get('HSN_Code')?.value || ''
    ).trim();

    if (!productName) {
      return;
    }

    this._rest.GetProductExtraStock(
      productName,
      hsnCode
    ).subscribe({
      next: (res: any) => {

        const available = Number(
          res.Available_Quantity
        ) || 0;

        productForm.patchValue({
          Available_Extra_Stock: available
        }, { emitEvent: false });

        const index = this.items.controls.indexOf(productForm);

        if (index !== -1) {
          this.CalculateStock(index);
        }
      },

      error: (err: any) => {
        console.error('Stock fetch error:', err);

        productForm.patchValue({
          Available_Extra_Stock: 0
        }, { emitEvent: false });

        const index = this.items.controls.indexOf(productForm);

        if (index !== -1) {
          this.CalculateStock(index);
        }
      }
    });
  }

  CalculateStock(index: number): void {

    const product = this.items.at(index) as FormGroup;

    const ordered = Number(
      product.get('Ordered_Quantity')?.value
    ) || 0;

    const available = Number(
      product.get('Available_Extra_Stock')?.value
    ) || 0;

    const stockUsed = Math.min(
      ordered,
      available
    );

    const manufacturingRequired = Math.max(
      0,
      ordered - stockUsed
    );

    product.patchValue({
      Stock_Used: stockUsed,
      Manufacturing_Required: manufacturingRequired
    }, { emitEvent: false });

    this.CalculateProduction(index);
  }

  GetItemTotal(index: number): number {
    const item = this.items.at(index);

    const quantity = Number(item.get('Product_Quantity')?.value) || 0;
    const rate = Number(item.get('Rate')?.value) || 0;

    return quantity * rate;
  }

  GetSubTotal(): number {
    return this.items.controls.reduce((total, control) => {
      const quantity = Number(control.get('Product_Quantity')?.value) || 0;
      const rate = Number(control.get('Rate')?.value) || 0;
      return total + quantity * rate;
    }, 0);
  }

  GetTotalAmount(): number {
    const subtotal = this.GetSubTotal();
    const discount =
      Number(this.InletChallanForm.get('Discount_Amount')?.value) || 0;

    return Math.max(subtotal - discount, 0);
  }

  GetCGST(): number {
    return this.GetTotalAmount() * 0.09;
  }

  GetSGST(): number {
    return this.GetTotalAmount() * 0.09;
  }

  GetGrandTotal(): number {
    return this.GetTotalAmount() + this.GetCGST() + this.GetSGST();
  }

  calculateGrandTotal(): void {
    if (!this.InletChallanForm) {
      return;
    }

    this.InletChallanForm.patchValue({
      Sub_Total: this.GetSubTotal(),
      Total_Amount: this.GetTotalAmount()
    }, { emitEvent: false });
  }
  CalculateProduction(index: number): void {
    const item = this.items.at(index);

    const produced = Number(
      item.get('Produced_Quantity')?.value
    ) || 0;

    const damaged = Number(
      item.get('Damaged_Quantity')?.value
    ) || 0;

    const faulty = Number(
      item.get('Faulty_Quantity')?.value
    ) || 0;

    const manufacturingRequired = Number(
      item.get('Manufacturing_Required')?.value
    ) || 0;

    if (
      produced < 0 ||
      damaged < 0 ||
      faulty < 0 ||
      damaged + faulty > produced
    ) {
      item.patchValue({
        Good_Quantity: 0,
        Extra_Quantity: 0
      }, { emitEvent: false });

      return;
    }

    const good = produced - damaged - faulty;

    const extra = Math.max(
      good - manufacturingRequired,
      0
    );

    item.patchValue({
      Good_Quantity: good,
      Extra_Quantity: extra
    }, { emitEvent: false });
  }

  SaveProduction(product: any): void {

    const payload = {
      Produced_Quantity: Number(product.Produced_Quantity) || 0,
      Damaged_Quantity: Number(product.Damaged_Quantity) || 0,
      Faulty_Quantity: Number(product.Faulty_Quantity) || 0
    };

    this._rest.UpdateInletProductProduction(
      product.InletProduct_id,
      payload
    ).subscribe({
      next: (res: any) => {

        if (res.success) {

          alert(
            `Production updated successfully.\n` +
            `Good Quantity: ${res.Good_Quantity}\n` +
            `Extra Quantity: ${res.Extra_Quantity}\n` +
            `Added to Stock: ${res.Added_To_Stock}`
          );

          // Refresh the inlet product / production list here.
        }
      },

      error: (err: any) => {
        alert(
          err.error?.message ||
          'Production update failed'
        );
      }
    });
  }

}
