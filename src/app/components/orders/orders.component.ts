import { Component, OnInit } from '@angular/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
import { DataService } from "../../services/data.service";
// import { Product } from "../../models/product.ts";
import * as moment from "moment";
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import { TdLoadingService } from '@covalent/core';
import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';

const NUMBER_FORMAT: (v: any) => any = (v: number) => v;
const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  columns: ITdDataTableColumn[] = [
    { name: 'order_string',  label: 'Order Number', sortable: true, numeric: false},
    { name: 'user_data', label: 'Customer Name', filter: true, sortable: true, format: u => u.name, numeric: false},
    // { name: 'delivery_data', label: 'Delivery', filter: true, sortable: true, hidden: false },
    { name: 'contact_email', label: 'Email', sortable: true, filter: true, numeric: false},
    { name: 'contact_number', label: 'Contact Number', sortable: true, filter: true, numeric: true},
    { name: 'total', label: 'Total (ZAR)', numeric: true, format: DECIMAL_FORMAT, sortable: true},
    { name: 'status', label: 'Status', sortable: true, filter: true,  numeric: true, width: {min: 200}},
    { name: 'createdAt', label: 'Created', format: c => moment(c).format('DD-MM-YYYY'), numeric: true},
    { name: 'view', label: '', sortable: false, filter: false},
  ];

  data: any[];

  filteredData: any[];
  filteredTotal: number;
  loading: boolean = true;
  mustFloat: boolean = true;


  changeStatus(row) {
   console.log(row);
   let status = row.status;
   this._loadingService.register('overlayStarSyntax');
   if(status === 'shipped') {
      this._dialogService.openPrompt({
        message: 'Please enter the shipping number',
        disableClose: true,
        viewContainerRef: this._viewContainerRef, //OPTIONAL
        title: 'Shipping Number', //OPTIONAL, hides if not provided
        value: '', //OPTIONAL
        cancelButton: 'Cancel', //OPTIONAL, defaults to 'CANCEL'
        acceptButton: 'Submit', //OPTIONAL, defaults to 'ACCEPT'
      }).afterClosed().subscribe((newValue: string) => {
        if (newValue) {
          // DO SOMETHING
          this.updateStatus(status, row.order_string, newValue);
        } else {
          this.updateStatus(status, row.order_string, null);
          // DO SOMETHING ELSE
        }
      });
    } else {
      this.updateStatus(status, row.order_string, null);
    }
  }

  updateStatus(status, order_string, tracking_number) {
    this.dataService.updateStatus(status, order_string, tracking_number).then(order => {
      this._loadingService.resolve('overlayStarSyntax');
      this.success("Order updated", "Order status has been changed successfully");
      console.log(order);
    }).catch(ex => {        
      this._loadingService.resolve('overlayStarSyntax');
      console.log("An error occurred", ex);
      this.failed("An error occurred", ex);
    });
  }


  viewOrder(row) {
   console.log(row);
  }

  failed(title, error) {
    var toastOptions:ToastOptions = {
     title: title,
     msg: error
    };

    this.toastyService.warning(toastOptions);
    this._loadingService.resolve('overlayStarSyntax');
  }

  success(title, message) {
    var toastOptions:ToastOptions = {
     title: title,
     msg: message
    };

    this.toastyService.success(toastOptions);
    this._loadingService.resolve('overlayStarSyntax');
  }

  statuses = [
    {value: 'failed', viewValue: 'Failed'},
    {value: 'awaiting_eft', viewValue: 'Awaiting EFT'},
    {value: 'awaiting_payment', viewValue: 'Awaiting Payment'},
    {value: 'payment_pending', viewValue: 'Payment Pending'},
    {value: 'payment_processed', viewValue: 'Payment Processed'},
    // {value: 'processed', viewValue: 'Processed'},
    {value: 'processing', viewValue: 'Processing'},
    {value: 'shipped', viewValue: 'Shipped'},
    {value: 'complete', viewValue: 'Complete'}
  ];

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'order_string';
  selectable: boolean = true;
  multiple: boolean = true;
  clickable: boolean = true;
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  constructor(private _dataTableService: TdDataTableService, public dataService: DataService, private _loadingService: TdLoadingService, private toastyService:ToastyService,
    private toastyConfig: ToastyConfig, private _dialogService: TdDialogService,private _viewContainerRef: ViewContainerRef) {
    this.loading = true;
    dataService.getAllOrders().then(orders=>{
      console.log(orders);
      this.data = orders;
      this.filteredData = orders;
      this.filteredTotal = orders.length;
      this.loading = false;
        this.filter();
    });

  }

  ngOnInit(): void {
  }

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    // console.log(sortEvent)
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  filter(): void {
    let newData: any[] = this.data;
    let excludedColumns: string[] = this.columns
    .filter((column: ITdDataTableColumn) => {
      return ((column.filter === undefined && column.hidden === true) ||
              (column.filter !== undefined && column.filter === false));
    }).map((column: ITdDataTableColumn) => {
      return column.name;
    });
    newData = this._dataTableService.filterData(newData, this.searchTerm, true, excludedColumns);
    this.filteredTotal = newData.length;
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    newData = this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }
}
