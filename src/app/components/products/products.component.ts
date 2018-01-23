import { Component, OnInit } from '@angular/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
import { DataService } from "../../services/data.service";
// import { Product } from "../../models/product.ts";

const NUMBER_FORMAT: (v: any) => any = (v: number) => v;
const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  columns: ITdDataTableColumn[] = [
    { name: 'image',  label: 'Fabric', sortable: true, width: 200 },
    { name: 'name',  label: 'Product Name', sortable: true, width: 200 },
    { name: 'article_number',  label: 'Article Number', sortable: true, width: 200 },
    { name: 'description', label: 'Description', filter: true, width: 200  },
    { name: 'category', label: 'Category', filter: true, sortable: true, hidden: false },
    { name: 'price', label: 'Price (ZAR)', numeric: true, format: DECIMAL_FORMAT, sortable: true },
    { name: 'edit', label: '', sortable: false, filter: false},
  ];

  data: any[];

  filteredData: any[];
  filteredTotal: number;
  loading: boolean = true;

  searchTerm: string = '';
  fromRow: number = 1;
  currentPage: number = 1;
  pageSize: number = 10;
  sortBy: string = 'name';
  selectable: boolean = true;
  multiple: boolean = true;
  clickable: boolean = true;
  selectedRows: any[] = [];
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  constructor(private _dataTableService: TdDataTableService, public dataService: DataService) {
    this.loading = true;
    dataService.getProducts().then(products=>{
      this.data = products;
      this.filteredData = products;
      this.filteredTotal = products.length;
      this.loading = false;
        this.filter();
    });

  }

  ngOnInit(): void {
  }

  editProduct(row) {
    console.log(row);
    // this.router.navigate('order', )
   }

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
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
