import {bindable, inject} from 'aurelia-framework';
import * as d3 from 'd3';

@inject(Element)
export class TimePlotCustomAttribute {
  @bindable scores;
  @bindable type;

  constructor(element) {
    this.element = element;
  }

  bind() {
    this.timePlot(this.scores, this.type);
  }

  timePlot(data, type) {
    // set the dimensions and margins of the graph
    let margin = {top: 20, right: 20, bottom: 50, left: 50};
    let width = 520 - margin.left - margin.right;
    let height = 300 - margin.top - margin.bottom;

    // Scatter Functions
    let dotCalc;
    if (type === 'Points') {
      dotCalc = function(d, i) {
        return Math.round((d.value / d.assignment.max) * 100);
      };
    } else {
      let _movingSum2 = 0;
      dotCalc = function(d, i) {
        _movingSum2 += d.value;
        return _movingSum2 / (i + 1);
      };
    }

    // parse the date / time
    let parseTime = d3.timeParse('%Y-%m-%d');

    // set the ranges
    let x = d3.scaleTime().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);

    // define the line
    let valueline = d3.line().x(d => x(d.assignment.date));

    if (type === 'Points') {
      valueline = valueline.y(d => y(Math.round((d.value / d.assignment.max) * 100)));
    } else if (type === 'Checks') {
      let _movingSum = 0;
      valueline = valueline.y((d, i) => {
        _movingSum += d.value;
        return y(_movingSum / (i + 1));
      });
    }

    // append the svg obgect
    let svg = d3.select(this.element)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Format the data
    data = data.filter(d => d.assignment.type === type);
    data.forEach(d => d.assignment.date = parseTime(d.assignment.date));

    // Scale the range of the data
    x.domain(d3.extent(data, d => d.assignment.date));
    if (type === 'Points') {
      y.domain([0, 100]);
    } else {
      y.domain([0, 1]);
    }

    // Add the valueline path.
    svg.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', valueline);

    // Add the scatterplot
    svg.selectAll('dot')
       .data(data)
       .enter().append('circle')
       .style('fill', '#F3BB45')
       .attr('r', 5)
       .attr('cx', (d) => x(d.assignment.date))
       .attr('cy', (d, i) => y(dotCalc(d, i)));

    if (type === 'Points') {
      svg.selectAll('dot');
    }

    // Add the X Axis
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%m/%d')).ticks(data.length));

    // Add the Y Axis
    svg.append('g')
       .call(d3.axisLeft(y));
  }
}
