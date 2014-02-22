var area0 = document.getElementById('graph0'),
  area1 = document.getElementById('graph1'),
  areax = document.getElementById('xlabels'),
  headline = document.getElementById('headline'),
  lbl0 = document.getElementById('lbl0'),
  lbl1 = document.getElementById('lbl1');

// DEFAULT EXAMPLE /////////////////////////////////////////////////////

var defaultExample = 'N4IgzgxghgNgpgBhALhDA9gcxAGnNeARhTQEsA7OKAJ1xBqqVQCYBmBBAHXNYFYPufAeQAs/Lj16EJANnHc5w5gE4OElWu4aEhLaoTNuhViM3lmzM5bXqA7OPUOtT8w4mFCADgN9BN90Jmxg66PNI23Ly2nsq2tpFuEiLsEeT2/tzpqcqJWuGpYv4SvInFyRnkHtaphDL6NZ6mFbX1ZiK2RZmeLvmdlbVFSHgMUMSoHQB0tiLMntEIInPevJkIE54y8WmEEzoyMp4qzAcqrJk7hDkihCIyJjd35xOmhLasrwhvr6G2O3fXt3ugJET08nlYJ2Ux0OyjOaWYExuswWSxRnkyCNM3QhvGxcmUGImm1sqmYyVJIhB8ImOTYFNYFMyrAmbAQsV4MjZ9hkP2ZUmYDyB/yZUyheNxvAhMkyIl2MjEOPFBLSstYAv+guuKxVExKyk57INtmlOriMX5l35hh1ykOkOhp0yvERcUVkrkGydE3eOUIAt9Fi9nktfpDgbSzrmn3eHS+v0yMhZsZj0e+Cee/otAetxqJcdTycytl2+dLcLiz25XI5XJNFdsDqh9q2FabMMbzBbnm9R3tkK6LN77f7aW7rG8i3mk+DA4OKKnSx+3dhHzLOeUiJTa8yG8lAI1wJ3UzdJ5bG/BHvdEtYZ5pqOnaO43im+6FJmYdBGAA8SJd45VYmtP84T/Kk/21P8TT/LY/3RACSSMW13FtUJLkORDwQwsDbQg20oNtGDbTgtDlUuVREOUVDlChCiQOo7Ccgo/DYgo4jqOVaotA4UJrGtaw4WsKlrG1awTWsLZrDg6wOJ0dQdGIPAAAsqAAExgCg4BIAAhUhMEwOBqAAAgAYXQABbAAHABXAAXAyTMU0gLLAQyABlVJcmz0Dc9ByH0ozXNIAAzTS8BgAAjGAmBAAAVagoHIMBSDALyjNMqzyBsugIpgMYQECkLDIAUS/Cy4AgGyEogABPQyAHEDLMhLqpAABfIAAAA==';

// RANDOM TOOLS ////////////////////////////////////////////////////////

function observe(element, event, handler) {
  events = event.split(/\s+/);
  for(i in events) {
    element.addEventListener(events[i], handler, false);
  }
}

function getRadioValue(name) {
  var r = document.getElementsByName(name);
  for (var i = 0; i < r.length; i++) {
    if(r[i].checked) return r[i].value;
  }
  return null;
}

function setRadioValue(name, value) {
  var r = document.getElementsByName(name);
  for (var i = 0; i < r.length; i++) {
    r[i].checked = r[i].value === value;
  }
}

function clean(input) {
  return ((input || '' ) + '').trim();
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
    scale0: getRadioValue('scale0'),
    scale1: getRadioValue('scale1'),
    area0: area0.value.trim(),
    area1: area1.value.trim(),
    areax: areax.value.trim(),
    headline: headline.value.trim(),
    lbl0: lbl0.value.trim(),
    lbl1: lbl1.value.trim()
  };

  var s = '#' + LZString.compressToBase64(JSON.stringify(x));
  window.location.hash = s;
  document.getElementById('sharelink').setAttribute('href', s);
}

function getFromHash() {
  var h = window.location.hash.substring(1);

  if(h === '') h = defaultExample;

  var json = JSON.parse(LZString.decompressFromBase64(h));

  setRadioValue('scale0', clean(json['scale0']));
  setRadioValue('scale1', clean(json['scale1']));
  area0.value = clean(json['area0']);
  area1.value = clean(json['area1']);
  areax.value = clean(json['areax']);
  headline.value = clean(json['headline']);
  lbl0.value = clean(json['lbl0']);
  lbl1.value = clean(json['lbl1']);
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
    margin = 30;

var eighty = Math.round(document.documentElement.clientWidth * 0.9),
    width = Math.min(maxWidth, eighty) - 2*margin - 80,
    height = Math.round(0.5*width - margin);


var svg = d3.select('svg')
  .attr('width', width + 2*margin + 80)
  .attr('height', height + margin + 10)
  .append('g')
    .attr('transform', 'translate(' + (margin + 80) + ',' + 10 + ')');

// RENDER ACTUAL GRAPHS ////////////////////////////////////////////////

function renderSVG() {
  // clear old
  svg.selectAll('g, path').remove();

  // gather data
  var graph0 = area0.value.trim().split('\n').map(parseFloat);
  var graph1 = area1.value.trim().split('\n').map(parseFloat);
  var scale0 = getRadioValue('scale0');
  var scale1 = getRadioValue('scale1');


  var x = d3.scale.linear().domain([-width / 2, width / 2]).range([0, width]),
      y0 = d3.scale[scale0]().range([height, 0]),
      y1 = d3.scale[scale1]().range([height, 0]);

  var yAxisLeft = d3.svg.axis().scale(y0).orient('left').ticks(5),
      yAxisRight = d3.svg.axis().scale(y1).orient('right').ticks(5);

  //
  var valueline0 = d3.svg.line()
    .x(function(d, i) { return x(i); })
    .y(function(d) { return y0(d); });

  var valueline1 = d3.svg.line()
    .x(function(d, i) { return x(i); })
    .y(function(d) { return y1(d); });


  // scale to data
  x.domain([-1, Math.min(graph0.length, graph1.length)]);
  y0.domain(d3.extent(graph0));
  y1.domain(d3.extent(graph1));

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
