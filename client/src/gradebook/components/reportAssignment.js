import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {CurrentService} from 'shared/services/currentService';
import * as d3 from 'd3';

@inject(CurrentService, EventAggregator)
export class ReportAssignment {
  constructor(current, eventaggregator) {
    // Initalize http client
    this.current = current;
    this.ea = eventaggregator;
  }

  attached() {
    this.makePlot();
    this.subscriber = this.ea.subscribe('scoreUpdate', resp => this.makePlot());
  }

  detached() {
    this.subscriber.dispose();
  }

  makePlot() {
    // Remove Any Current Plots
    d3.select('svg').remove();

    // Render proper Plot
    if (this.current.assignment.isPoints) {
      this.renderHistogram(this.current.scores, '#content');
    } else {
      this.renderDonut(this.current.scores, '#content');
    }
  }

  renderHistogram(data, divElement) {
    let formatCount = d3.format(',.0f');

    // Height and width
    let margin = {top: 20, right: 20, bottom: 30, left: 50};
    let width = 450 - margin.left - margin.right;
    let height = 300 - margin.top - margin.bottom;

    // Define Plot
    let svg = d3.select(divElement)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);

    let g = svg.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let x = d3.scaleLinear()
              .range([0, width]);

    if (this.current.assignment.max !== 0) {
      x.domain([0, this.current.assignment.max]);
    } else {
      x.domain([0, d3.max(data, (d) => d.value)]);
    }

    let bins = d3.histogram()
                 .value((d) => d.value)
                 .domain(x.domain())(data);

    let y = d3.scaleLinear()
              .domain([0, d3.max(bins, (d) => d.length)])
              .range([height, 0]);

    let div = d3.select('body')
                .append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);


    let bar = g.selectAll('.bar')
               .data(bins)
               .enter()
               .append('g')
               .attr('class', 'bar')
               .attr('transform', (d) => 'translate(' + x(d.x0) + ',' + y(d.length) + ')')
               .on('mouseover', (d) => {
                 div.transition()
                    .duration(200)
                    .style('opacity', 0.9);

                 div.html(d.map(item => item.student.first_name + ': ' + item.value + '<br>').join(''))
                    .style('left', (d3.event.pageX) + 'px')
                    .style('top', (d3.event.pageY - 28) + 'px');
               })
               .on('mouseout', function(d) {
                 div.transition()
                    .duration(500)
                    .style('opacity', 0);
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

    if (this.current.assignment.max !== 0) {
      g.append('g')
          .attr('class', 'axis axis--x')
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(x)
              .tickFormat((d) => Math.round((d / this.current.assignment.max) * 100) + '%'));
    } else {
      g.append('g')
          .attr('class', 'axis axis--x')
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(x));
    }
  }

  renderDonut(data, divElement) {
    // Set Up Data
    let nestdata = d3.nest()
                     .key((d) => d.value).sortKeys(d3.descending)
                     .rollup((g) => {
                       return {'count': g.length,
                               'names': g.map(item => item.student.first_name)
                             };
                     })
                     .entries(data)
                     .map(group => {
                       return {
                         'group': group.key === '1' ? 'Checked' : 'Missing',
                         'count': group.value.count,
                         'names': group.value.names
                       };
                     });

    // Dimensions
    let width = 450;
    let height = 300;
    let radius = Math.min(width, height) / 2;

    // Set up Tool tip
    let tooltip = d3.select(divElement)
                    .append('div')
                    .attr('class', 'tooltip2');

    tooltip.append('div').attr('class', 'label');
    tooltip.append('div').attr('class', 'count');
    tooltip.append('div').attr('class', 'students');
    tooltip.append('div').attr('class', 'percent');

    // Color Scale
    let themeColors = ['#7AC29A', '#EB5E28']
    // let color = d3.scaleOrdinal(d3.schemeCategory10.slice(2, 4));
    let color = d3.scaleOrdinal(themeColors);
    if (nestdata.length === 1 && nestdata[0].group === 'Missing') {
      color = d3.scaleOrdinal(themeColors.slice(1, 2));
    }

    let svg = d3.select(divElement)
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    let donutWidth = 50;

    let arc = d3.arc()
                .innerRadius(radius - donutWidth)
                .outerRadius(radius);

    let pie = d3.pie()
                .value(function(d) { return d.count; })
                .sort((a, b) => a - b);

    let legendRectSize = 18;
    let legendSpacing = 4;

    let path = svg.selectAll('path')
                  .data(pie(nestdata))
                  .enter()
                  .append('path')
                  .attr('d', arc)
                  .attr('fill', function(d, i) {
                    return color(d.data.group);
                  });

    path.on('mouseover', function(d) {
      let percent = Math.round(1000 * d.data.count / data.length) / 10;
      tooltip.select('.label').html(d.data.group);
      tooltip.select('.count').html(d.data.count);
      tooltip.select('.students').html(d.data.names.map(name => name + '<br>').join(''));
      tooltip.select('.percent').html(percent + '%');
      tooltip.style('display', 'block');
    });

    path.on('mouseout', function() {
      tooltip.style('display', 'none');
    });

    let legend = svg.selectAll('.legend')
                    .data(color.domain())
                    .enter()
                    .append('g')
                    .attr('class', 'legend')
                    .attr('transform', function(d, i) {
                      let height2 = legendRectSize + legendSpacing;
                      let offset =  height2 * color.domain().length / 2;
                      let horz = -2 * legendRectSize;
                      let vert = i * height2 - offset;
                      return 'translate(' + horz + ',' + vert + ')';
                    });

    legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', color)
          .style('stroke', color);

    legend.append('text')
          .attr('x', legendRectSize + legendSpacing)
          .attr('y', legendRectSize - legendSpacing)
          .text(function(d, i) { return d; });
  }
}
