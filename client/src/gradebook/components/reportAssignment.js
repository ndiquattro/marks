import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {bindable} from 'aurelia-templating';
import {BindingEngine} from 'aurelia-framework';
import {AssignmentService} from '../services/assignmentService';
import * as d3 from 'd3';

@inject(HttpClient, AssignmentService, BindingEngine)
export class ReportAssignment {
  @bindable reload;

  constructor(http, assignment, bindingengine) {
    // Initalize http client
    this.http = http;
    this.assignment = assignment;
    this.bindingengine = bindingengine;
  }

  attached() {
    d3.select('svg').remove();
    this.preProcessData(this.assignment.scores);
    this.renderHistogram(this.assignment.scores, '#content');
    // this.subscription = this.bindingengine.propertyObserver(this.assignment, 'newScores').subscribe(console.log("Change"));
  }

  reloadChanged() {
    // Make New Chat
    this.attached();
  }

  preProcessData(data) {
    return data;
  }

  render(data, divElement) {
    console.log(data);
    data = this.preProcessData(data);

    // Height and width
    let margin = {top: 20, right: 20, bottom: 30, left: 50};
    let width = 500 - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;

    // Define Plot
    let svg = d3.select(divElement)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //Axes
    let x = d3.scaleLinear()
              .range([0, width])
              .domain([0, 40]);

    let y = d3.scaleLinear()
              .range([height, 0])
              .domain([0, 40]);

    // // Scale the range of the data
    // x.domain(d3.extent(data, function(d) { return d.stuid; }));
    // y.domain([0, d3.max(data, function(d) { return d.value; })]);

    // Add the scatter
    svg.selectAll('dot')
       .data(data)
       .enter()
       .append('circle')
       .attr('r', 10)
       .attr('cx', (d) => x(d.value))
       .attr('cy', (d) => y(d.value));

    // Add the Axes
    svg.append('g').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x));
    svg.append('g').call(d3.axisLeft(y));
  }

  renderHistogram(data, divElement) {
    let formatCount = d3.format(',.0f');

    // Height and width
    let margin = {top: 20, right: 20, bottom: 30, left: 50};
    let width = 500 - margin.left - margin.right;
    let height = 300 - margin.top - margin.bottom;

    // Define Plot
    let svg = d3.select(divElement)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);

    let g = svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let x = d3.scaleLinear()
              .domain([0, this.assignment.meta.max])
              .range([0, width]);

    let bins = d3.histogram()
                 .value((d) => d.value)
                 .domain(x.domain())
                 (data);
    console.log(bins);

    let y = d3.scaleLinear()
              .domain([0, d3.max(bins, (d) => d.length)])
              .range([height, 0]);

    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


    let bar = g.selectAll('.bar')
               .data(bins)
               .enter()
               .append('g')
               .attr('class', 'bar')
               .attr('transform', (d) => 'translate(' + x(d.x0) + ',' + y(d.length) + ')')
               .on("mouseover", (d) => {
                  div.transition()
                     .duration(200)
                     .style("opacity", .9);

                  div.html(d.map(item => item.studref.first_name + ': ' + item.value + '<br>'))
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
                })
               .on("mouseout", function(d) {
                 div.transition()
                .duration(500)
                .style("opacity", 0);
                });



    bar.append('rect')
        .attr('x', 1)
        .attr('width', x(bins[0].x1) - x(bins[0].x0) - 1)
        .attr('height', (d) => height - y(d.length));

    bar.append('text')
        .attr('dy', '.75em')
        .attr('y', 6)
        .attr('x', (x(bins[0].x1) - x(bins[0].x0)) / 2)
        .attr('text-anchor', 'middle')
        .text((d) => formatCount(d.length));

    g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x)
                .tickFormat((d) => Math.round((d / this.assignment.meta.max) * 100) + '%')
                );
  }
}
