$(window).on("resize", flickRender);
var curItemIndex = 0;

function flickRender() {
  var itemWidth = watchList[0].getBoundingClientRect().width;
  $(".flick_item").each((index, item) => {
    $(item).css({ left: index * itemWidth });
  });
  $(".flick_item").eq(curItemIndex).addClass("cur_item");
  arrowsHandler();
}

function newFlickItem() {
  let curItem = $(".flick_item").last();
  let shift = curItem[0].style.left;
  watchList.css({ transform: `translateX(-${shift})` });
  $(".cur_item").removeClass("cur_item");
  curItem.addClass("cur_item");
  arrowsHandler();
}

function moveList(way, del) {
  let shiftItem = $(".cur_item");
  if (del && !shiftItem.next().length && shiftItem.prev().length) {
    shiftItem = shiftItem.prev();
  } else {
    if (way && shiftItem.next().length) {
      shiftItem = shiftItem.next();
    } else if (!del && !way && shiftItem.prev().length) {
      shiftItem = shiftItem.prev();
    }
    $(".cur_item").removeClass("cur_item");
    shiftItem.addClass("cur_item");
  }
  curItemIndex = $(".flick_item").index(shiftItem);
  let shift = shiftItem[0].style.left;
  watchList.css({ transform: `translateX(-${shift})` });
  arrowsHandler();
}

function arrowsHandler() {
  if ($(".cur_item").prev().length) flickBtns.eq(0).show();
  else flickBtns.eq(0).hide();
  if ($(".cur_item").next().length) flickBtns.eq(1).show();
  else flickBtns.eq(1).hide();
}
