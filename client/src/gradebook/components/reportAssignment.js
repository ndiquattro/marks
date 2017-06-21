import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {bindable} from 'aurelia-templating';
import * as d3 from 'd3';

@inject(HttpClient)
export class ReportAssignment {
  @bindable assignment;

  constructor(http) {
    // Initalize http client
    this.http = http;
  }

  bind() {
    this.getScores();
  }

  render(data, divElement) {
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
              .domain([0, 6]);

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
       .attr('cx', (d) => x(d.stuid))
       .attr('cy', (d) => y(d.value));

    // Add the Axes
    svg.append('g').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x));
    svg.append('g').call(d3.axisLeft(y));
  }


  getScores() {
    // Filter Object
    let qobj = {
      filters: [{'name': 'assignid', 'op': 'eq', 'val': this.assignment.id}],
      order_by: [{'field': 'studref__first_name', 'direction': 'asc'}]
    };

    // Get Data
    this.http.createRequest('http://localhost:5000/api/scores')
      .asGet()
      .withParams({q: JSON.stringify(qobj)})
      .send()
      .then(data => {
        this.scores = JSON.parse(data.response).objects;
        this.render(this.scores, '#content');
      });
  }
}
