import { Component, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { DynamicComponent } from './dynamicComponent/dynamicComponent.component';
import { sbdDataTotalBox } from '../shared/components/data-total-box/data-total-box.component';
import { sbdDataTable } from '../shared/components/data-table/data-table.component';
import { LayoutService } from '../layout/layout.service';

declare var $: any;
declare var GridStackUI: any;
declare var _: any;

@Component({
    selector: 'sbd-layout',
    templateUrl: './layout.template.html',
    styleUrls: ['./layout.style.css'],
    entryComponents: [DynamicComponent, sbdDataTable, sbdDataTotalBox],
    encapsulation: ViewEncapsulation.None
})
export class sbdLayoutComponent implements AfterViewInit {

    gridLayoutObj: any;
    gridLayoutItemsData: any;
    
    newItemName: string;
    posNewItem: string = "first";
    editMode: boolean = false;

    constructor(private layoutService:LayoutService) { }

    ngAfterViewInit(): void {
        this.loadData(() => {
            this.initView();
        });
    }

    loadData(cb) {
        // load > compare with ls, save in ls, subscribe to notify if update happens 
        // this.gridLayoutItemsData = (JSON.parse(localStorage.getItem('mvlayout')) !== null ? JSON.parse(localStorage.getItem('layout1')) : this.gridLayoutItemsData);

        this.fetch((res) => {
            this.gridLayoutItemsData = res.data;
            if (typeof cb === 'function') { cb(); }
        });
    }

    fetch(cb) {
        const req = new XMLHttpRequest();
        req.open('GET', `assets/data/display_data2.json`);

        req.onload = () => {
            cb(JSON.parse(req.response));
        };

        req.send();
    }

    
    injectWidgetsComponents() {
        $.each(this.gridLayoutItemsData, (index, widget) => {
            $($("#" + widget.id).detach()).appendTo("#" + widget.id + "_ph");
        });

        setTimeout(() => {
            $(".display__container").fadeIn();
        }, 250);
    }

    initView() {
       // this.calcGridCellsHeightByViewPort();
        this.initGridLayout();

        this.gridLayoutItemsData = GridStackUI.Utils.sort(this.gridLayoutItemsData);

        var gridLayout = $('.grid-stack').data('gridstack');
        gridLayout.removeAll();

        _.each(this.gridLayoutItemsData, function(node) {
            gridLayout.addWidget($('<div><div class="grid-stack-item-content"><div class="widget-container" id="' + node.id + '_ph' + '"></div></div></div>'),
                node.x, node.y, node.w, node.h);
        });

        this.gridLayoutObj = gridLayout;
        this.setEditMode("off");
    }

    toggelEditMode() {
        if (this.editMode === true) {
            this.setEditMode("off");
        } else {
            this.setEditMode("on");
        }
    }

    setEditMode(mode) {
        if (mode === "on") {
            this.gridLayoutObj.movable('.grid-stack-item', true);
            this.gridLayoutObj.resizable('.grid-stack-item', true);
            $(".ui-draggable-handle").css("cursor", "move");
            this.editMode = true;
        }
        else {
            this.gridLayoutObj.movable('.grid-stack-item', false);
            this.gridLayoutObj.resizable('.grid-stack-item', false);
            $(".ui-draggable-handle").css("cursor", "auto");
             $(".grid-stack-item").css("cursor", "auto");       
            this.editMode = false;
        }
    }

    insertItem() {
        let autoPos = (this.posNewItem == "auto" ? " data-gs-auto-position='1' " : ""),
            itemId = (this.newItemName ? this.newItemName : ("item" + Math.floor((Math.random() * 100) + 1)));
        $('.grid-stack').append('<div id="' + itemId + '" data-gs-x="0" data-gs-y="0" data-gs-width="2" data-gs-height="2"' + autoPos + '><div class="grid-stack-item-content" /></div>');
        var grid = $('.grid-stack').data('gridstack');
        grid.makeWidget("#" + itemId);
    }

    initGridLayout() {
        var options = {
            animate: true,
            width: 12,
            height: 0,
            cellHeight: this.layoutService.getGridCellsHeight(),
            verticalMargin: 10,
            resizable: { autoHide: true, handles: 'n, e, s, w' } //or e, se, s, sw, w
        };

        $('.grid-stack').gridstack(options);

        setTimeout(() => {
            this.injectWidgetsComponents();
        }, 1000);
    }

    getGridLayoutItemsData() {
        var layoutItems = [];
        $(".grid-stack").find(".grid-stack-item").each((index, item) => {
            let itemObj = {
                "x": $(item).attr("data-gs-x"),
                "y": $(item).attr("data-gs-y"),
                "w": $(item).attr("data-gs-width"),
                "h": $(item).attr("data-gs-height")
            };

            layoutItems.push(itemObj);
        });
        this.gridLayoutItemsData = layoutItems;
        console.log(layoutItems);
    }

}
