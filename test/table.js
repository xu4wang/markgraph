var rows = [], search = document.getElementById('search');

/* Fill array with data
 *
 * Fields:
 * values *array* - value of each field (in case use of table)
 * markup *string* - markup that will be added to the DOM
 * active *bool* - specifies if row is suitable by search phrase
*/
for(var i = 1; i <= 500; i++){
  rows.push({
    values: [i, i*100/500+'%'],
    markup: '<tr>' +
              '<td>' + i + '</td>' +
              '<td>' + (i*100/500+'%') + '</td>' +
            '</tr>',
    active: true
  });
}

/*
* Fetch suitable rows
*/
var filterRows = function(rows) {
  var results = [];
  for(var i = 0, ii = rows.length; i < ii; i++) {
    if(rows[i].active) results.push(rows[i].markup)
  }
  return results;
}

/*
* Init clusterize.js
*/
var clusterize = new Clusterize({
  rows: filterRows(rows),
  scrollId: 'scrollArea',
  contentId: 'contentArea'
});

/*
* Multi-column search
*/
var onSearch = function() {
  for(var i = 0, ii = rows.length; i < ii; i++) {
    var suitable = false;
    for(var j = 0, jj = rows[i].values.length; j < jj; j++) {
      if(rows[i].values[j].toString().indexOf(search.value) + 1)
        suitable = true;
    }
    rows[i].active = suitable;
  }
  clusterize.update(filterRows(rows));
}

let selectedTd;

function highlight(td) {
    if (selectedTd) { // remove the existing highlight if any
      selectedTd.classList.remove('highlight');
    }
    selectedTd = td;
    selectedTd.classList.add('highlight'); // highlight the new td
}

document.getElementById('contentArea').onclick = function(e) {
    var target = e.target;
    if(target.nodeName != 'TD') return;
    highlight(target); // highlight it

    console.log('clicked');
    console.log(target.innerText);
  }

search.oninput = onSearch;