'use strict';

function init() {
  var resize = document.getElementById('resize');
  var left  = document.getElementById('left');
  var right  = document.getElementById('dst');
  var container = document.getElementById('content');
  var src = document.getElementById('src');

  resize.onmousedown = function (e) {
    var preX = e.clientX;
    resize.left = resize.offsetLeft;
    document.onmousemove = function (e) {
      var curX = e.clientX;
      var deltaX = curX - preX;
      var leftWidth = resize.left + deltaX;
      if (leftWidth < 4) leftWidth = 4;
      if (leftWidth > container.clientWidth - 4) leftWidth = container.clientWidth  - 4;
      left.style.width = leftWidth + 'px';
      src.style.width = '100%'; //a hack to make editor width updated.
      resize.style.left = leftWidth;
      right.style.width = (container.clientWidth - leftWidth - 4) + 'px';
    };
    //eslint-disable-next-line
  document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  var lresize = document.getElementById('lresize');
  var lleft  = document.getElementById('explorer_container');
  var lright = document.getElementById('src');
  var lcontainer = document.getElementById('left');

  lresize.onmousedown = function (e) {
    var preX = e.clientX;
    lresize.left = lresize.offsetLeft;
    document.onmousemove = function (e) {
      var curX = e.clientX;
      var deltaX = curX - preX;
      var leftWidth = lresize.left + deltaX;
      if (leftWidth < 4) leftWidth = 4;
      if (leftWidth > lcontainer.clientWidth - 4) leftWidth = lcontainer.clientWidth  - 4;
      lleft.style.width = leftWidth + 'px';
      lresize.style.left = leftWidth;
      lright.style.width = (lcontainer.clientWidth - leftWidth - 4) + 'px';
    };
    //eslint-disable-next-line
  document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}

exports.init = init;
