import { Component, ViewEncapsulation, Injector, OnInit } from '@angular/core';
import { StringFilterPipe } from './../../pipes/filterSearch.pipe';

declare var $: any;

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SbdGridTable implements OnInit {

  id: string; //component *UI* Identifier
  renderGrid: boolean = true;
  isFlipping: boolean = false;
  autoPagingInterval: any;
  autoPagingIntervalTime: number = 5000;
  querySearch: string = '';

  /* grid-table options */
  title: string;
  rows = [];
  columns = [];
  rowsCopy = [];
  minWidth: number;
  minHeight: number = 100; //default for grid-table -- 260! (current for grid1 is not good)
  limit: number;
  optional = {
    loaded: false,
    includePagination: false,
    autoPaginate: false,
    filterable: true,
    queryValue: ''
  };

  constructor(private injector: Injector) { }

  ngOnInit() {
    this.optional.filterable = true;
    this.injectComponentData();
    this.initGridComponent();
  }

  injectComponentData() {
    try {
      this.optional.queryValue = "";
      this.id = this.injector.get('id');
      this.title = this.injector.get('title');
      this.limit = this.injector.get('limit');
      this.rows = this.injector.get('rows');
      this.columns = this.injector.get('columns');
      this.rowsCopy.push(this.rows[0]);
      this.minWidth = (80 * this.columns.length);

      this.checkOptionalAttributes();
    } catch (e) {
      console.log(e);
    };
  }

  initGridComponent() {
    setTimeout(() => {
      var containerSelector = "#" + this.id;
      var gridContainerHeight = ($($(containerSelector).find(".sbd-grid-table").parents('.grid-stack-item')[0]).height() - 50);
      var neededRowLimit = Math.round(gridContainerHeight / 50);
      this.limit = (neededRowLimit - 1);

      //set optional or defaults
      if (this.optional.loaded) {
        if (this.optional.includePagination) {
          this.initGridPagination();
          if (this.optional.autoPaginate) {
            this.initAutoPagingInterval();
          }
        }

      }//end 

      setTimeout(() => { this.setupBodyScroll(); this.setComponentMinWidth(); }, 500);
    }, 1000);
  }

  setComponentMinWidth() {
    //first static block
    this.updateStaticComponentMinWidth();
    this.updateStaticComponentMinHeight();

    //dynamic block when resize
    $('.grid-stack').on('resizestop', (event, ui) => {
      debugger;
      if ($(ui.element[0]).find('.grid-table-component').length) {
        
        var orgw = $(ui.element[0]).attr('data-gs-width'),
          orgh = $(ui.element[0]).attr('data-gs-height'),
          cmp = $(ui.element[0]),
          orgWidth = ui.originalSize.width;
        setTimeout(() => {
          if (ui.size.width < this.minWidth) { this.updateComponentMinSizes(cmp, 'w', orgw); }
          if (ui.size.height < this.minHeight) { this.updateComponentMinSizes(cmp, 'h', orgw); }
          this.updateStaticComponentMinWidth();
          this.updateStaticComponentMinHeight();
          this.setupBodyScroll();
        }, 250);
      }
    });
  }

  updateComponentMinSizes(cmp, what, value) {
    setTimeout(() => {
      switch (what) {
        case "w":
          $(cmp).attr("data-gs-width", value);
          break;
        case "h":
          $(cmp).attr("data-gs-height", value);
          break;
      }
    }, 250);
  }

  updateStaticComponentMinWidth() {
    var containerSelector = "#" + this.id + "_ph";
    $(containerSelector).parents(".grid-stack-item").css('min-width', this.minWidth + "px");
  }

  updateStaticComponentMinHeight() {
    var containerSelector = "#" + this.id + "_ph";
    $(containerSelector).parents(".grid-stack-item").css('min-height', this.minHeight + "px");
  }

  checkOptionalAttributes() {
    var custom = () => { try { this.injector.get('optional') } catch (e) { return null; } };
    if (custom) {
      this.optional = $.extend(this.optional, custom);
    }
  }

  setupBodyScroll(cd?) {
    var scrollBodyHeight = ($('#' + this.id + "_ph").parent().height()) - ($(".sbd-grid-table-head-fixed").find('thead').height() - 15);

    $('#' + this.id + "_ph").find(".sbd-grid-table-head-fixed").find('.sbd-grid-table-body').hide();
    $('#' + this.id + "_ph").find(".sbd-grid-table-body-scroll").css("margin-top", "-32px");
    $('#' + this.id + "_ph").find(".sbd-grid-table-body-scroll").find('thead').hide();

    $('#' + this.id + "_ph").find(".sbd-grid-table-body-scroll").css("height", (scrollBodyHeight - 30) + "px");

    $('#' + this.id + "_ph").find(".sbd-grid-table-body-scroll").focus();
    $("tr").hover(function (el) { $(el.target).parent().find('td').first().css({ 'border-left': '5px solid #60b7c0', 'padding-left': '5px' }); },
      function (el) { $(el.target).parent().find('td').first().css({ 'border-left': '0', 'padding-left': '10px' }); });
  }

  initGridPagination() {
    let containerSelector = "#" + this.id;
    $(containerSelector).find('.table-paging').paging({ limit: this.limit });
  }

  initAutoPagingInterval() {
    var containerSelector = "#" + this.id;
    $(containerSelector).find(".paging-nav").find('a').removeClass('selected-page');
    $(containerSelector).find(".paging-nav").find('*[data-page="0"]').addClass('selected-page');

    var paginationButtonsCount = $(containerSelector).find(".paging-nav").find('a').length,
      paginateFirstButton = $(containerSelector).find(".paging-nav").find('*[data-page="0"]'),
      paginateNextButton = $(containerSelector).find(".paging-nav").find('*[data-direction="1"]');

    if (paginationButtonsCount > 3) {
      this.autoPagingInterval = setInterval(() => {
        this.Paginate();
        if ($(containerSelector).find(".paging-nav").find('.selected-page').attr('data-page') == paginationButtonsCount - 3) {
          $(paginateFirstButton).click();
        } else {
          $(paginateNextButton).click();
        }
      }, this.autoPagingIntervalTime);
    } else {
      $(containerSelector).find(".paging-nav").hide();
    }
  }

  Paginate() {
    var containerSelector = "#" + this.id;
    $(containerSelector).find(".sbd-grid-table-body").addClass('flipping');
    setTimeout(() => {
      $(containerSelector).find(".sbd-grid-table-body").removeClass('flipping');
    }, 1500);
  }
}
