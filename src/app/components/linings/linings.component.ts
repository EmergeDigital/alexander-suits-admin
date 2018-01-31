import { Component, OnInit } from '@angular/core';
import { TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { IPageChangeEvent } from '@covalent/core';
import { DataService } from "../../services/data.service";

//Formats
const NUMBER_FORMAT: (v: any) => any = (v: number) => v;
const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

@Component({
  templateUrl: './linings.component.html',
  styleUrls: ['./linings.component.scss']
})
export class LiningsComponent implements OnInit {

  private columns: ITdDataTableColumn[] = [
    { name: 'image',  label: 'Fabric', sortable: true, width: 200 },
    { name: 'name',  label: 'Product Name', sortable: true, width: 200 },
    { name: 'article_number',  label: 'Article Number', sortable: true, width: 200 },
    { name: 'description', label: 'Description', filter: true, width: 200  },
    { name: 'price', label: 'Price (ZAR)', numeric: true, format: DECIMAL_FORMAT, sortable: true },
    { name: 'edit', label: '', sortable: false, filter: false},
  ];

  private data: any[] = [];

  private filteredData: any[] = [];
  private filteredTotal: number;
  private loading: boolean = true;

  private searchTerm: string = '';
  private fromRow: number = 1;
  private currentPage: number = 1;
  private pageSize: number = 10;
  private sortBy: string = 'name';
  private selectable: boolean = true;
  private multiple: boolean = true;
  private clickable: boolean = true;
  private selectedRows: any[] = [];
  private sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  constructor(private _dataTableService: TdDataTableService, public dataService: DataService) {
    this.loading = true;
    dataService.getLinings().then(products=>{
      this.data = products;
      this.filteredData = products;
      this.filteredTotal = products.length;
      this.loading = false;
        this.filter();
    });
  }

  public ngOnInit(): void {

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
