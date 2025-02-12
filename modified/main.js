! function(o, c) {
  var n = c.documentElement,
    t = " w-mod-";
  n.className += t + "js", ("ontouchstart" in o || o.DocumentTouch &&
    c instanceof DocumentTouch) && (n.className += t + "touch")
}(window, document);

function setFontSize() {
  let maxWidth = 1560;
  let windowWidth = $(window).width();
  if (windowWidth >= maxWidth || windowWidth < 992) {
    $('body').removeAttr("style");
  } else {
    let fontSize = (windowWidth / 100) / 16;
    $('body').css('font-size', fontSize + "rem");
  }
}

setFontSize();

window.addEventListener("resize", function() {
  setFontSize();
});