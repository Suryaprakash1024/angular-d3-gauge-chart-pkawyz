import { Component } from '@angular/core';
import * as d3 from "d3";

// declare var d3: any;
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  gaugemap = {};
  range = 240;
  constructor() { }
    ngOnInit() {
    this.draw();
  }

  draw() {
     var self = this;
    var gauge = function (container :any, configuration :any) {
    
      var config= {
        size: 300,
        clipWidth: 300,
        clipHeight: 300,
        ringWidth: 60,
        maxValue: 10,
        transitionMs: 4000,
        ringInset: 20,
        pointerWidth: 10,
        pointerTailLength: 5,
        pointerHeadLengthPercent: 0.9,
        minValue: 0,
        minAngle: -120,
        maxAngle: 120,
        majorTicks: 5,
        labelFormat: d3.format('d'),
        labelInset: 10,
        arcColorFn: d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'))
      };
      var range: number | undefined = undefined;
      var r: string | number | undefined = undefined;
      var pointerHeadLength: number | undefined = undefined;
      var value = 0;

      var svg: any | { append: (arg0: string) => { (): any; new(): any; attr: { (arg0: string, arg1: string): { (): any; new(): any; attr: { (arg0: string, arg1: string): any; new(): any; }; }; new(): any; }; data: { (arg0: number[][][]): { (): any; new(): any; attr: { (arg0: string, arg1: string): { (): any; new(): any; attr: { (arg0: string, arg1: string): any; new(): any; }; }; new(): any; }; }; new(): any; }; }; } | undefined = undefined;
      var arc: any | undefined = undefined;
      var scale: any | { (arg0: any): any; ticks: (arg0: number) => any; } | undefined = undefined;
      var ticks = [0, 5, 7, 10];
      var tickData : number[] = [];
      var pointer: { transition: () => { (): any; new(): any; duration: { (arg0: number): { (): any; new(): any; ease: { (arg0: any): { (): any; new(): any; attr: { (arg0: string, arg1: string): void; new(): any; }; }; new(): any; }; }; new(): any; }; }; } | undefined = undefined;

      var donut = d3.pie();
      var gaugemap: any = {};

      function deg2rad(deg : number) {
        return deg * Math.PI / 180;
      }

      function newAngle(d : number) {
        // var ratio = this.scale(d);
        var newAngle = config.minAngle + (0.5 * 240);
        return newAngle;
      }

      function configure(configuration : any={}) {
        var prop = "";

        range = config.maxAngle - config.minAngle;
        r = config.size / 2;
        pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

        // a linear scale this.gaugemap maps domain values to a percent from 0..1
        scale = d3.scaleLinear()
          .range([0, 1])
          .domain([config.minValue, config.maxValue]);

        // ticks = scale.ticks(config.majorTicks);,
        ticks = [0, 5, 7, 10];
        tickData = [0.5, 0.4, 0.3];
        // tickData = d3.range(config.majorTicks).map(function () { return 1 / config.majorTicks; });

        arc = d3.arc()
          .innerRadius(r - config.ringWidth - config.ringInset)
          .outerRadius(r - config.ringInset)
          .startAngle(function (d : any, i : number) {
            if(i == 0)
            {
              return deg2rad(-120);
            }
            else if(i == 1){
              return deg2rad((tickData[0] * 240)-120);
            }
            else if(i == 2){
              return deg2rad(90 - d * 240);
            }
            return 0;
          })
          .endAngle(function (d:any, i:number) {
            if(i == 0){
              return deg2rad((d *240)-120);
              }
              else if(i == 1){
                return deg2rad(((tickData[0] * 240)-120) + d * 240);
              }
              else if(i == 2){
                return deg2rad(120);
              }
              return 0;
          });
      }
      gaugemap.configure = configure;

      function centerTranslation() {
        r = config.size / 2;
        return 'translate(' + r + ',' + r + ')';
      }

      function isRendered() {
        return (svg !== undefined);
      }
      gaugemap.isRendered = isRendered;

      function render(newValue : any) {
        svg = d3.select(container)
          .append('svg:svg')
          .attr('class', 'gauge')
          .attr('width', config.clipWidth)
          .attr('height', config.clipHeight);

        var centerTx = centerTranslation();
        let r = config.size / 2;
        let pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);
        if(svg)
        var arcs = svg.append('g')
          .attr('class', 'arc')
          .attr('transform', centerTx);

        arcs.selectAll('path')
          .data(tickData)
          .enter().append('path')
          .attr('fill', function (d:any, i:number) {
            return d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'))(d * i);
          })
          .attr('d', arc);
        if(svg)
        var lg = svg.append('g')
          .attr('class', 'label')
          .attr('transform', centerTx);
        lg.selectAll('text')
          .data(ticks)
          .enter().append('text')
          .attr('transform', function (d:any) {
            var ratio = scale(d);
            var newAngle = config.minAngle + (ratio * 240);
            return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - r) + ')';
          })
          .text(config.labelFormat);
          
        var lineData = [[config.pointerWidth / 2, 0],
        [0, -pointerHeadLength],
        [-(config.pointerWidth / 2), 0],
        [0, config.pointerTailLength],
        [config.pointerWidth / 2, 0]];
        var pointerLine = d3.line().curve(d3.curveLinear)
        if(svg)
        var pg = svg.append('g').data([lineData])
          .attr('class', 'pointer')
          .attr('transform', centerTx);

        pointer = pg.append('path')
          .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/)
          .attr('transform', 'rotate(' + config.minAngle + ')');

        update(newValue === undefined ? 0 : newValue);
      }
      gaugemap.render = render;
      function update(newValue : any, newConfiguration? : any) {
        if (newConfiguration !== undefined) {
          // configure(newConfiguration);
        }
        var ratio = 0.5;
        var newAngle = config.minAngle + (ratio * 240);
        if(pointer)
        pointer.transition()
          .duration(config.transitionMs)
          .ease(d3.easeElastic)
          .attr('transform', 'rotate(' + newAngle + ')');
      }
      gaugemap.update = update;

      configure(configuration);

      return gaugemap;
    };

    var powerGauge = gauge('#power-gauge', {
      size: 300,
      clipWidth: 300,
      clipHeight: 300,
      ringWidth: 60,
      maxValue: 10,
      transitionMs: 4000,
    });
    powerGauge.render(6);

  }
}

interface GaugeMap {
  configure?: any;
  isRendered?: any;
  render?: any;
  update?: any;
}