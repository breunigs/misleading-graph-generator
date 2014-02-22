// AUTOSIZE TEXTAREAS //////////////////////////////////////////////////

function autosizeTextarea(elementId) {
  // via http://stackoverflow.com/a/5346855/1684530
  function observe(element, event, handler) {
    element.addEventListener(event, handler, false);
  }

  var text = document.getElementById(elementId);
  function resize() {
    text.style.height = 'auto';
    text.style.height = text.scrollHeight+2+'px';
  }

  /* 0-timeout to get the already changed text */
  function delayedResize () {
    window.setTimeout(resize, 0);
  }

  observe(text, 'change',  resize);
  observe(text, 'cut',     delayedResize);
  observe(text, 'paste',   delayedResize);
  observe(text, 'drop',    delayedResize);
  observe(text, 'keydown', delayedResize);

  text.focus();
  text.select();
  resize();
}

autosizeTextarea('graph0');
autosizeTextarea('graph1');
autosizeTextarea('xlabels');


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

var maxWidth = 800,
    margin = 50;

var eighty = Math.round(document.documentElement.clientWidth * 0.8),
    width = Math.min(maxWidth, eighty) - 2*margin,
    height = Math.round(0.5*width - margin);

var x = d3.scale.linear().domain([-width / 2, width / 2]).range([0, width]),
    y0 = d3.scale.linear().range([height, 0]);
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

var area0 = document.getElementById('graph0'),
  area1 = document.getElementById('graph1'),
  areax = document.getElementById('xlabels'),
  headline = document.getElementById('headline'),
  lbl0 = document.getElementById('lbl0'),
  lbl1 = document.getElementById('lbl1');

window.update = function() {
  svg.selectAll('g, path').remove();

  var graph0 = area0.value.trim().split('\n').map(parseFloat);
  var graph1 = area1.value.trim().split('\n').map(parseFloat);

  // scale to data
  x.domain([0, Math.min(graph0.length, graph1.length) - 1]);
  y0.domain([0, d3.max(graph0)]);
  y1.domain([0, d3.max(graph1)]);

  // draw graphs
  svg.append('path')
    .attr('class', 'line')
    .attr('d', valueline0(graph0))
    .style('stroke', 'steelblue');

  svg.append('path')
    .attr('class', 'line')
    .attr('d', valueline1(graph1))
    .style('stroke', 'red');

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
  var  xAxis = d3.svg.axis().scale(x).ticks(5)
    .tickFormat(function(idx) { return xlabels[idx] || '' });
  svg.append('g').attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')').call(xAxis);
}


window.update();

// UPDATE ON EDITS /////////////////////////////////////////////////////

function changeListener(elementId, callback) {
  var element = document.getElementById(elementId);
  element.addEventListener('change', callback, false);
  element.addEventListener('drop', callback, false);
  element.addEventListener('paste', callback, false);
  element.addEventListener('cut', callback, false);
}

changeListener('graph0', window.update);
changeListener('graph1', window.update);
changeListener('xlabels', window.update);
changeListener('lbl0', window.update);
changeListener('lbl1', window.update);
changeListener('headline', function() {
  var t = headline.value;
  document.getElementById('title').innerHTML = t;
});
