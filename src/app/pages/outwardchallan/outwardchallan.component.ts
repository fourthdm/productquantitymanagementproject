import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { RestService } from 'src/app/services/rest.service';
import * as XLSX from 'xlsx';

declare var bootstrap: any;

@Component({
  selector: 'app-outwardchallan',
  templateUrl: './outwardchallan.component.html',
  styleUrls: ['./outwardchallan.component.css']
})
export class OutwardchallanComponent {

  @Input() Vendor_Name: any;
  @Input() Vendor_CompanyName: any;
  @Input() Product_Status: any;
  @Input() Delivery_Status: any;
  @Input() Challan_Status: any;
  @Input() Added_Date: any;

  AllVendorData: any[] = [];
  AllVendorChallan: any[] = [];

  UpdateVendorchallanform: FormGroup;
  UpdateProductform!: FormGroup;
  pro: any;

  constructor(private _rest: RestService, private fb: FormBuilder, private _activatedroute: ActivatedRoute) {
    this.UpdateVendorchallanform = this.fb.group({
      VendorChallan_id: [''],
      Vendor_Name: [''],
      Vendor_CompanyName: [''],
      Vendor_CompanyAddress: [''],
      VendorGST_No: [''],
      Vendor_Phoneno: [''],
      Vendor_Email: [''],

      SubTotal: [''],
      Total_Amount: [''],
      CGST_amount: [''],
      SGST_amount: [''],
      Grand_Total: [''],

      Mode_of_Transport: [''],
      Transporter_Name: [''],
      Vehicle_Number: [''],
      Remark: [''],

      Product_Status: [''],
      Delivery_Status: [''],
      Challan_Status: [''],

      vendoritems: this.fb.array([
        this.createProduct()
      ])
    });

  }


  get vendorproducts(): FormArray {
    return this.UpdateProductform.get('vendorproducts') as FormArray;
  }
  liked: boolean = false;

  Show() {
    this.liked = !this.liked;
  }

  ngOnInit(): void {
    this.AllchallanDetails();
    this.GetAllVendor();

    this.UpdateProductform = this.fb.group({
      vendorproducts: this.fb.array([])
    });

  }

  GetAllVendor() {
    this._rest.AllVendor().subscribe((data: any) => {
      console.log(data);
      this.AllVendorData = data.data;
    }, (err: any) => {
      console.log(err);
    })
  }

  AllchallanDetails() {
    this._rest.ALlvendorChallandata().subscribe((data: any) => {
      // console.log(data);

      this.AllVendorChallan = (data.data || []).sort((a: any, b: any) => {
        return new Date(b.VendorChallan_id).getTime() - new Date(a.VendorChallan_id).getTime();
      })
      console.log(this.AllVendorChallan);

      // this.AllVendorChallan = (data.data || []).sort((a:any, b:any) =>{
      //   return new Date(b.Added_Date).getTime() - new Date(a.Added_Date).getTime();  
      // }))
      // this.AllVendorChallan = data.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  calculateProductRate(productIndex: number) {
    const product = this.vendoritems.at(productIndex);
    const operations = this.getOperations(productIndex);

    let totalOperationRate = 0;

    operations.controls.forEach((op: any) => {
      totalOperationRate += Number(op.get('Rate')?.value || 0);
    });

    product.get('Rate')?.setValue(totalOperationRate, { emitEvent: false });

    const qty = Number(product.get('Product_Quantity')?.value || 0);
    const subtotal = qty * totalOperationRate;

    product.get('SubTotal')?.setValue(subtotal, { emitEvent: false });
  }

  calculateSubtotal(index: number) {
    const product = this.vendoritems.at(index);

    const qty =
      Number(product.get('Product_Quantity')?.value) || 0;

    const rate =
      Number(product.get('Rate')?.value) || 0;
    const subtotal = qty * rate;
    product.get('SubTotal')?.setValue(subtotal);
  }

  Selectedchallan: any = null;

  createProduct(product?: any): FormGroup {
    return this.fb.group({
      VendorProduct_id: [product?.VendorProduct_id || 0],
      Product_Name: [product?.Product_Name || '', Validators.required],
      HSN_Code: [product?.HSN_Code || '', Validators.required],
      Product_Quantity: [product?.Product_Quantity || 1],
      Rate: [product?.Rate || 0],
      SubTotal: [product?.SubTotal || 0],
      operations: this.fb.array(
        product?.operations?.length
          ? product.operations.map((op: any) => this.createOperationGroup(op))
          : [this.createOperationGroup()]
      )
    });
  }

  get vendoritems(): FormArray {
    return this.UpdateVendorchallanform.get('vendoritems') as FormArray;
  }

  editRequirement(VendorChallan_id: any) {
    this._rest.VendorchallanbyId(VendorChallan_id).subscribe({
      next: (res: any) => {
        const data = res.data;

        this.UpdateVendorchallanform.patchValue({
          VendorChallan_id: data.VendorChallan_id,
          Vendor_Name: data.Vendor_Name,
          Vendor_CompanyName: data.Vendor_CompanyName,
          Vendor_CompanyAddress: data.Vendor_CompanyAddress,
          VendorGST_No: data.VendorGST_No,
          Vendor_Phoneno: data.Vendor_Phoneno,
          Vendor_Email: data.Vendor_Email,
          Mode_of_Transport: data.Mode_of_Transport,
          Transporter_Name: data.Transporter_Name,
          Vehicle_Number: data.Vehicle_Number,
          Remark: data.Remark,
          Product_Status: data.Product_Status,
          Delivery_Status: data.Delivery_Status,
          Challan_Status: data.Challan_Status
        });
        this.vendoritems.clear();

        data.vendoritems.forEach((product: any) => {
          this.vendoritems.push(this.createProduct(product));
        });

      },
      error: err => {
        console.log(err);
      }
    });
  }

  Update() {
    if (this.UpdateVendorchallanform.invalid) {
      this.UpdateVendorchallanform.markAllAsTouched();
      return;
    }
    const VendorChallan_id = this.UpdateVendorchallanform.value.VendorChallan_id;
    // const formData = this.UpdateVendorchallanform.value;
    const body = this.UpdateVendorchallanform.getRawValue();
    this._rest.UpdateVendorChallan(VendorChallan_id, body).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.AllchallanDetails();
        if (res.success) {
          // Close modal
          const modalElement = document.getElementById('exampleModal');

          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            }
          }
          console.log('Vendor Challan updated successfully');
        }
      },
      error: (error) => {
        console.error('Update failed:', error);
      }
    });
  }

  getOperations(index: number): FormArray {
    return this.vendoritems.at(index).get('operations') as FormArray;
  }

  createOperationGroup(op?: any): FormGroup {
    return this.fb.group({
      Operation_id: [op?.Operation_id || 0],
      Operation_Name: [op?.Operation_Name || ''],
      Rate: [op?.Rate || 0]
    });
  }

  addProduct() {
    this.vendoritems.push(this.createProduct());
  }

  removeProduct(index: number) {
    this.vendoritems.removeAt(index);
  }

  addOperation(productIndex: number) {
    this.getOperations(productIndex).push(this.createOperationGroup());
  }

  removeOperation(productIndex: number, operationIndex: number) {
    this.getOperations(productIndex).removeAt(operationIndex);
  }

  selectedchallanId = 0;
  adminPassword = '';
  deletionReason = '';
  isDeleting: boolean = false;

  openDeleteModal(id: number) {
    this.selectedchallanId = id;
    this.adminPassword = '';
    this.deletionReason = '';
    this.liked = false;
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


    this._rest.DeleteVendorChallan(
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
    this._rest.VendorChallanbyDate({ Added_Date: this.Added_Date }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendorChallan = (data.data || []).sort((a: any, b: any) => {
          return new Date(b.VendorChallan_id).getTime() - new Date(a.VendorChallan_id).getTime();
        })
        // this.AllVendorChallan = data.data;
      } else {
        this.AllVendorChallan = [];
      }
      this.Added_Date = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyChallanStatus() {
    this._rest.VendorchallanDatabyChallanStatus({ Challan_Status: this.Challan_Status }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendorChallan = (data.data || []).sort((a: any, b: any) => {
          return new Date(b.VendorChallan_id).getTime() - new Date(a.VendorChallan_id).getTime();
        })
        // this.AllVendorChallan = data.data;
      } else {
        this.AllVendorChallan = [];
      }
      this.Challan_Status = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyDeliveryStatus() {
    this._rest.VendorchallanDatabyDeliveryStatus({ Delivery_Status: this.Delivery_Status }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendorChallan = (data.data || []).sort((a: any, b: any) => {
          return new Date(b.VendorChallan_id).getTime() - new Date(a.VendorChallan_id).getTime();
        })
        // this.AllVendorChallan = data.data;
      } else {
        this.AllVendorChallan = [];
      }
      this.Delivery_Status = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyWorkStatus() {
    this._rest.VendorChallanProductStatus({ Product_Status: this.Product_Status }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendorChallan = (data.data || []).sort((a: any, b: any) => {
          return new Date(b.VendorChallan_id).getTime() - new Date(a.VendorChallan_id).getTime();
        })
        // this.AllVendorChallan = data.data;
      } else {
        this.AllVendorChallan = [];
      }
      this.Product_Status = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  DatabyCustomername() {
    this._rest.VendorChallanDatabyVendorName({ Vendor_Name: this.Vendor_Name }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendorChallan = (data.data || []).sort((a: any, b: any) => {
          return new Date(b.VendorChallan_id).getTime() - new Date(a.VendorChallan_id).getTime();
        })
        // this.AllVendorChallan = data.data;
      } else {
        this.AllVendorChallan = [];
      }
      this.Vendor_Name = '';
    }, (err: any) => {
      console.log(err);
    })
  }

  DatabyCompanyname() {
    this._rest.VendorChallanDatabyCompanyName({ Vendor_CompanyName: this.Vendor_CompanyName }).subscribe((data: any) => {
      if (data && data.data && data.data.length > 0) {
        console.log(data);
        this.AllVendorChallan = (data.data || []).sort((a: any, b: any) => {
          return new Date(b.VendorChallan_id).getTime() - new Date(a.VendorChallan_id).getTime();
        })
        // this.AllVendorChallan = data.data;
      } else {
        this.AllVendorChallan = [];
      }
      this.Vendor_CompanyName = '';
    }, (err: any) => {
      console.log(err);
    });
  }

  printPdf(VendorChallan_id: any) {
    this._rest.GetVendorChallanPDF(VendorChallan_id).subscribe((file: Blob) => {
      const url = window.URL.createObjectURL(file);
      window.open(url, '_blank');
    });
  }

  exportexcel(): void {

    const data: any[][] = [];

    // Header
    data.push([
      'Sr No',
      'Vendor Challan Code',
      'Vendor Name',
      'Company Name',
      'Company Address',
      'GST No',
      'Phone',
      'Email',

      'Sub Total',
      'CGST',
      'SGST',
      'Grand Total',

      'Transport Mode',
      'Transporter',
      'Vehicle No',

      'Remark',
      'Product Status',
      'Delivery Status',
      'Challan Status',

      'Added Date',
      'Updated Date',

      'Product Name',
      'HSN Code',
      'Quantity',
      'Product Rate',
      'Product Total',

      'Operation',
      'Operation Rate'
    ]);

    const merges: XLSX.Range[] = [];

    let row = 1;

    this.AllVendorChallan.forEach((challan: any, index: number) => {

      const startRow = row;

      (challan.vendoritems || []).forEach((product: any) => {

        const productStartRow = row;
        // If no operations exist
        if (!product.operations || product.operations.length === 0) {

          data.push([
            row === startRow ? index + 1 : '',
            row === startRow ? challan.VendorChallan_Code : '',
            row === startRow ? challan.Vendor_Name : '',
            row === startRow ? challan.Vendor_CompanyName : '',
            row === startRow ? challan.Vendor_CompanyAddress : '',
            row === startRow ? challan.VendorGST_No : '',
            row === startRow ? challan.Vendor_Phoneno : '',
            row === startRow ? challan.Vendor_Email : '',

            row === startRow ? challan.Sub_Total : '',
            row === startRow ? challan.CGST_amount : '',
            row === startRow ? challan.SGST_amount : '',
            row === startRow ? challan.Grand_Total : '',

            row === startRow ? challan.Mode_of_Transport : '',
            row === startRow ? challan.Transporter_Name : '',
            row === startRow ? challan.Vehicle_Number : '',

            row === startRow ? challan.Remark : '',
            row === startRow ? challan.Product_Status : '',
            row === startRow ? challan.Delivery_Status : '',
            row === startRow ? challan.Challan_Status : '',

            row === startRow ? challan.Added_Date : '',
            row === startRow ? challan.Updated_Date : '',

            product.Product_Name,
            product.HSN_Code,
            product.Product_Quantity,
            product.Rate,
            product.SubTotal,
            '',
            ''
          ]);

          row++;

        } else {
          product.operations.forEach((operation: any) => {

            data.push([
              row === startRow ? index + 1 : '',
              row === startRow ? challan.VendorChallan_Code : '',
              row === startRow ? challan.Vendor_Name : '',
              row === startRow ? challan.Vendor_CompanyName : '',
              row === startRow ? challan.Vendor_CompanyAddress : '',
              row === startRow ? challan.VendorGST_No : '',
              row === startRow ? challan.Vendor_Phoneno : '',
              row === startRow ? challan.Vendor_Email : '',

              row === startRow ? challan.Sub_Total : '',
              row === startRow ? challan.CGST_amount : '',
              row === startRow ? challan.SGST_amount : '',
              row === startRow ? challan.Grand_Total : '',

              row === startRow ? challan.Mode_of_Transport : '',
              row === startRow ? challan.Transporter_Name : '',
              row === startRow ? challan.Vehicle_Number : '',

              row === startRow ? challan.Remark : '',
              row === startRow ? challan.Product_Status : '',
              row === startRow ? challan.Delivery_Status : '',
              row === startRow ? challan.Challan_Status : '',

              row === startRow ? challan.Added_Date : '',
              row === startRow ? challan.Updated_Date : '',

              row === productStartRow ? product.Product_Name : '',
              row === productStartRow ? product.HSN_Code : '',
              row === productStartRow ? product.Product_Quantity : '',
              row === productStartRow ? product.Rate : '',
              row === productStartRow ? product.SubTotal : '',

              operation.Operation_Name,
              operation.Rate
            ]);
            row++;

            const productEndRow = row - 1;

            if (productEndRow > productStartRow) {
              // Merge Product columns
              for (let c = 21; c <= 25; c++) {
                merges.push({
                  s: { r: productStartRow, c },
                  e: { r: productEndRow, c }
                });
              }
            }
          });
        }
        // product.operations.forEach(operation => {
        //   data.push([
        //      operation.Operation_Name,
        //       operation.Rate
        //    ]);
        //   row++;
        // });
      });

      const endRow = row - 1;
      // const endRow = row - 1;
      if (endRow > startRow) {
        // Merge Vendor Details
        for (let c = 0; c <= 20; c++) {
          merges.push({
            s: { r: startRow, c },
            e: { r: endRow, c }
          });
        }
      }
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    worksheet['!merges'] = merges;
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendor Challan');

    XLSX.writeFile(workbook, 'Vendor_Challan_Report.xlsx');

  }

  createVendorProductItem(product: any): FormGroup {

    return this.fb.group({

      VendorProduct_id: [product.VendorProduct_id],

      Product_Name: [product.Product_Name],

      HSN_Code: [product.HSN_Code],

      Product_Quantity: [product.Product_Quantity],

      Received_Quantity: [
        product.Received_Quantity || 0,
        [Validators.required, Validators.min(0)]
      ],

      Pending_Quantity: [product.Pending_Quantity || 0],

      Pending_Reason: [product.Pending_Reason || '']

    });

  }

  calculatePending(index: number) {
    const product = this.vendorproducts.at(index);
    const sentQty = Number(
      product.get('Product_Quantity')?.value || 0
    );
    const receivedQty = Number(
      product.get('Received_Quantity')?.value || 0
    );
    const pendingQty = sentQty - receivedQty;
    product.get('Pending_Quantity')?.setValue(
      pendingQty >= 0 ? pendingQty : 0
    );
  }

  GetVendorChallanProducts(VendorChallan_id: number) {
    this.vendorproducts.clear();
    this._rest.GetVendorChallanProducts(VendorChallan_id).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          res.forEach((product: any) => {
            this.vendorproducts.push(
              this.createVendorProductItem(product)
            );
          });

        } else {
          alert('No products found');
        }
      },

      error: (err: any) => {
        console.error(err);
        alert('Unable to fetch products');
      }
    });
  }

  UpdateProducts() {

  if (this.UpdateProductform.invalid) {
    alert('Please enter valid product quantities');
    return;
  }

  const requests = this.vendorproducts.controls.map((product: any) => {

    const receivedQty = Number(
      product.get('Received_Quantity')?.value
    );

    const sentQty = Number(
      product.get('Product_Quantity')?.value
    );

    const pendingQty = sentQty - receivedQty;

    const data = {
      VendorProduct_id: Number(
        product.get('VendorProduct_id')?.value
      ),
      Received_Quantity: receivedQty,
      Pending_Reason: product.get('Pending_Reason')?.value || '',
      Pending_Quantity: pendingQty
    };
    
    console.log('Updating Product:', data);
    return this._rest.UpdateVendorChallanReceipt(data);
  });

  forkJoin(requests).subscribe({
    next: (res: any) => {
      alert('Product quantities updated successfully!');
      this.vendorproducts.clear();
    },

    error: (err: any) => {
      console.error('Update Error:', err);
      console.error('Backend Response:', err.error);
      alert(err.error?.message || 'Unable to update product quantities');
    }
  });
}

  // UpdateProducts() {
  //   if (this.UpdateProductform.invalid) {
  //     alert('Please enter valid product quantities');
  //     return;
  //   }
  //   const products = this.vendorproducts.getRawValue();
  //   const invalidProduct = products.some((p: any) => {
  //     return (
  //       Number(p.Received_Quantity) < 0 ||
  //       Number(p.Received_Quantity) >
  //       Number(p.Product_Quantity) ||
  //       (
  //         Number(p.Pending_Quantity) > 0 &&
  //         !p.Pending_Reason?.trim()
  //       )
  //     );

  //   });

  //   if (invalidProduct) {
  //     alert('Please check received quantity and pending reason');
  //     return;
  //   }

  //   const requests = products.map((p: any) => {

  //     return this._rest.UpdateVendorChallanReceipt({
  //       VendorProduct_id: p.VendorProduct_id,
  //       Received_Quantity: Number(p.Received_Quantity),
  //       Pending_Reason: p.Pending_Reason
  //     });

  //   });

  //   if (requests.length === 0) {
  //     return;
  //   }

  //   forkJoin(requests).subscribe({

  //     next: (res: any) => {

  //       alert('All Vendor Products Updated Successfully!');

  //       this.vendorproducts.clear();

  //       this.AllchallanDetails(); // Reload your challan list

  //     },

  //     error: (err: any) => {

  //       console.error(err);

  //       alert('Unable to update Vendor Product Quantity');

  //     }

  //   });

  // }

}

