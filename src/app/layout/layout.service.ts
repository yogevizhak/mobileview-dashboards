import { Injectable } from '@angular/core';
declare var $: any;

@Injectable()
export class LayoutService {

    viewPortHeight: number;
    gridCellsHeight: number;

    constructor() {
        this.setViewPortHeight();
        this.setGridCellsHeight();
    }

    setViewPortHeight() {
        this.viewPortHeight = Math.round($(window).height());
    }

    setGridCellsHeight(cb?) {
        this.gridCellsHeight = this.calcGridCellsHeightByViewPort(this.viewPortHeight);
        if (typeof cb == 'function') { cb(this.gridCellsHeight); }
    };

    getGridCellsHeight() {
        return (this.gridCellsHeight ? this.gridCellsHeight : this.setGridCellsHeight((gc) => { return gc; }));
    }

    calcGridCellsHeightByViewPort(viewPortHeight: number): number {
        //https://en.wikipedia.org/wiki/Display_resolution

        //start with the most preffered screen resolutions
        if (this.viewPortHeight > 900 && this.viewPortHeight <= 1080) { return 35; }
        if (this.viewPortHeight > 1080 && this.viewPortHeight <= 1200) { return 40; }
        if (this.viewPortHeight > 1200 && this.viewPortHeight <= 1440) { return 50; }
        if (this.viewPortHeight > 1440 && this.viewPortHeight <= 1600) { return 50; }

        //medium preffered
        if (this.viewPortHeight > 720 && this.viewPortHeight <= 768) { return 20; }
        if (this.viewPortHeight > 768 && this.viewPortHeight <= 800) { return 25; }
        if (this.viewPortHeight > 800 && this.viewPortHeight <= 900) { return 30; }

        //low preffered
        if (this.viewPortHeight > 0 && this.viewPortHeight <= 480) { return 5; }
        if (this.viewPortHeight > 480 && this.viewPortHeight <= 560) { return 10; }
        if (this.viewPortHeight > 560 && this.viewPortHeight <= 600) { return 15; }
        if (this.viewPortHeight > 600 && this.viewPortHeight <= 720) { return 15; }
        if (this.viewPortHeight > 1600 && this.viewPortHeight <= 2160) { return 55; }
        if (this.viewPortHeight > 2160 && this.viewPortHeight <= 4320) { return 60; }
    }
}
