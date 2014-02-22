var area0 = document.getElementById('graph0'),
  area1 = document.getElementById('graph1'),
  areax = document.getElementById('xlabels'),
  headline = document.getElementById('headline'),
  lbl0 = document.getElementById('lbl0'),
  lbl1 = document.getElementById('lbl1');

// DEFAULT EXAMPLE /////////////////////////////////////////////////////

var defaultExample = '#%7B%22area0%22%3A%2258.13%5Cn53.98%5Cn67.00%5Cn89.70%5Cn99.00%5Cn130.28%5Cn166.70%5Cn234.98%5Cn345.44%5Cn443.34%5Cn543.70%5Cn580.13%5Cn605.23%5Cn622.77%5Cn626.20%5Cn628.44%5Cn636.23%5Cn633.68%5Cn624.31%5Cn629.32%5Cn618.63%5Cn599.55%5Cn609.86%5Cn617.62%5Cn614.48%5Cn606.98%5Cn%20%20%20%20%22%2C%22area1%22%3A%223.41%5Cn4.55%5Cn6.78%5Cn7.85%5Cn8.92%5Cn9.92%5Cn10.13%5Cn12.23%5Cn13.45%5Cn16.04%5Cn18.03%5Cn21.02%5Cn22.34%5Cn20.15%5Cn21.26%5Cn31.04%5Cn35.04%5Cn41.02%5Cn43.05%5Cn46.03%5Cn51.03%5Cn53.42%5Cn57.82%5Cn59.01%5Cn56.03%5Cn58.01%5Cn%20%20%20%20%22%2C%22areax%22%3A%22%20%201-May-12%5Cn%20%2030-Apr-12%5Cn%20%2027-Apr-12%5Cn%20%2026-Apr-12%5Cn%20%2025-Apr-12%5Cn%20%2024-Apr-12%5Cn%20%2023-Apr-12%5Cn%20%2020-Apr-12%5Cn%20%2019-Apr-12%5Cn%20%2018-Apr-12%5Cn%20%2017-Apr-12%5Cn%20%2016-Apr-12%5Cn%20%2013-Apr-12%5Cn%20%2012-Apr-12%5Cn%20%2011-Apr-12%5Cn%20%2010-Apr-12%5Cn%20%209-Apr-12%5Cn%20%205-Apr-12%5Cn%20%204-Apr-12%5Cn%20%203-Apr-12%5Cn%20%202-Apr-12%5Cn%20%2030-Mar-12%5Cn%20%2029-Mar-12%5Cn%20%2028-Mar-12%5Cn%20%2027-Mar-12%5Cn%20%2026-Mar-12%5Cn%20%20%20%20%22%2C%22headline%22%3A%22Scandalous%20Headline%22%2C%22lbl0%22%3A%22Global%20Warming%22%2C%22lbl1%22%3A%22Pirates%22%7D'

// RANDOM TOOLS ////////////////////////////////////////////////////////

function observe(element, event, handler) {
  events = event.split(/\s+/);
  for(i in events) {
    element.addEventListener(events[i], handler, false);
  }
}


// AUTOSIZE TEXTAREAS //////////////////////////////////////////////////

function autosizeTextareas() {
  d3.selectAll('textarea')[0].forEach(function(text) {
    autosizeTextarea(text);
  });
}

function autosizeTextarea(text) {
  // via http://stackoverflow.com/a/5346855/1684530
  function resize() {
    text.style.height = 'auto';
    text.style.height = text.scrollHeight+2+'px';
  }

  /* 0-timeout to get the already changed text */
  function delayedResize () {
    window.setTimeout(resize, 0);
  }

  observe(text, 'change',  resize);
  observe(text, 'cut paste drop keydown', delayedResize);

  text.focus();
  text.select();
  resize();
}



// URL HASH HANDLING ///////////////////////////////////////////////////

function putIntoHash() {
  var x = {
    area0: area0.value.trim(),
    area1: area1.value.trim(),
    areax: areax.value.trim(),
    headline: headline.value.trim(),
    lbl0: lbl0.value.trim(),
    lbl1: lbl1.value.trim()
  };

  var s = '#' + encodeURIComponent(JSON.stringify(x));
  window.location.hash = s;
}

function getFromHash() {
  var h = window.location.hash.substring(1);

  if(h === '') h = defaultExample;

  var json = JSON.parse(decodeURIComponent(h));

  area0.value = json['area0'].trim() || '';
  area1.value = json['area1'].trim() || '';
  areax.value = json['areax'].trim() || '';
  headline.value = json['headline'].trim() || '';
  lbl0.value = json['lbl0'].trim() || '';
  lbl1.value = json['lbl1'].trim() || '';
}


// SVG TOOLS ///////////////////////////////////////////////////////////

function textOutline(elm, y, text) {
  elm.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', y)
      .style('stroke', 'white')
      .style('stroke-width', '8px')
      .style('text-anchor', 'end')
      .text(text);

  elm.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', y)
      .style('text-anchor', 'end')
      .text(text);
}

function appendPath(data, color) {
  svg.append('path')
    .attr('class', 'line')
    .attr('d', data)
    .style('stroke', color);
}

// SVG BASIC SETUP /////////////////////////////////////////////////////

var maxWidth = 800,
    margin = 50;

var eighty = Math.round(document.documentElement.clientWidth * 0.8),
    width = Math.min(maxWidth, eighty) - 2*margin,
    height = Math.round(0.5*width - margin);

var x = d3.scale.linear().domain([-width / 2, width / 2]).range([0, width]),
    y0 = d3.scale.linear().range([height, 0]),
    y1 = d3.scale.linear().range([height, 0]);

var yAxisLeft = d3.svg.axis().scale(y0).orient('left').ticks(5),
    yAxisRight = d3.svg.axis().scale(y1).orient('right').ticks(5);

var valueline0 = d3.svg.line()
  .x(function(d, i) { return x(i); })
  .y(function(d) { return y0(d); });

var valueline1 = d3.svg.line()
  .x(function(d, i) { return x(i); })
  .y(function(d) { return y1(d); });


var svg = d3.select('svg')
  .attr('width', width + 2*margin)
  .attr('height', height + margin)
  .append('g')
    .attr('transform', 'translate(' + margin + ',' + 0 + ')');

// RENDER ACTUAL GRAPHS ////////////////////////////////////////////////

function renderSVG() {
  svg.selectAll('g, path').remove();

  var graph0 = area0.value.trim().split('\n').map(parseFloat);
  var graph1 = area1.value.trim().split('\n').map(parseFloat);

  // scale to data
  x.domain([0, Math.min(graph0.length, graph1.length) - 1]);
  y0.domain([0, d3.max(graph0)]);
  y1.domain([0, d3.max(graph1)]);

  // draw graphs
  appendPath(valueline0(graph0), 'steelblue');
  appendPath(valueline1(graph1), 'red');

  // y0 and y1 axis / labels
  var a0 = svg.append('g')
    .attr('class', 'y axis')
    .style('fill', 'steelblue')
    .call(yAxisLeft);

  textOutline(a0, 14+5, lbl0.value);

  var a1 = svg.append('g')
    .attr('transform', 'translate(' + width + ' ,0)')
    .attr('class', 'y axis')
    .style('fill', 'red')
    .call(yAxisRight);

  textOutline(a1, -14+5, lbl1.value);

  // x axis / labels
  var xlabels = areax.value.trim().split('\n');
  var xAxis = d3.svg.axis().scale(x).ticks(5)
    .tickFormat(function(idx) { return xlabels[idx] || '' });
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);
}


// UPDATE HANDLING /////////////////////////////////////////////////////

function update() {
  document.getElementById('title').innerHTML = headline.value;
  renderSVG();
  putIntoHash();
}

d3.selectAll('input, textarea')[0].forEach(function(input) {
  observe(input, 'change drop paste cut', update);
});





// INIT SETUP //////////////////////////////////////////////////////////

getFromHash();

autosizeTextareas();

update();
