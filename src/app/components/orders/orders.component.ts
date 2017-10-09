import { Component, OnInit } from '@angular/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
import { DataService } from "../../services/data.service";
// import { Product } from "../../models/product.ts";
import * as moment from "moment";

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
    { name: 'user_data', label: 'Customer Name', filter: true, format: u => u.name, numeric: false},
    // { name: 'delivery_data', label: 'Delivery', filter: true, sortable: true, hidden: false },
    { name: 'contact_email', label: 'Email', sortable: true, filter: true, numeric: false},
    { name: 'contact_number', label: 'Contact Number', sortable: true, filter: true, numeric: true},
    { name: 'total', label: 'Total (ZAR)', numeric: true, format: DECIMAL_FORMAT, sortable: true},
    { name: 'status', label: 'Status', sortable: true, filter: true,  numeric: true},
    { name: 'createdAt', label: 'Created', sortable: true, format: c => moment(c).format('DD-MM-YYYY'), numeric: true}
  ];

  data: any[];

  filteredData: any[];
  filteredTotal: number;
  loading: boolean = true;
  mustFloat: boolean = true;


  changeStatus(row) {
   console.log(row);
  }

  statuses = [
    {value: 'awaiting_payment', viewValue: 'Awaiting Payment'},
    {value: 'processed', viewValue: 'Processed'},
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

  constructor(private _dataTableService: TdDataTableService, public dataService: DataService) {
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
    console.log(sortEvent)
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
