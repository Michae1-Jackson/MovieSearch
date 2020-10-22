$(window).on("resize", flickRender);

function flickRender() {
  var itemWidth = watchList[0].getBoundingClientRect().width;
  if (watchList.length == 1) {
    $(".flick_item").eq(0).addClass("cur_item");
  }
  $(".flick_item").each((index, item) => {
    $(item).css({ left: index * itemWidth });
  });
  $(".flick_btn--right").off("click", moveListToRight);
  $(".flick_btn--right").on("click", moveListToRight);
  $(".flick_btn--left").off("click", moveListToLeft);
  $(".flick_btn--left").on("click", moveListToLeft);
}

function flickMove(item) {
  if (item.next().length) {
    moveListToRight();
  } else if (item.prev().length) {
    moveListToLeft();
  }
}

function moveListToRight() {
  curItem = $(".cur_item");
  nextItem = curItem.next();
  console.log(curItem);
  shift = nextItem[0].style.left;
  watchList.css({ transform: `translateX(-${shift})` });
  curItem.removeClass("cur_item");
  nextItem.addClass("cur_item");
}

function moveListToLeft() {
  curItem = $(".cur_item");
  prevItem = curItem.prev();
  shift = prevItem[0].style.left;
  watchList.css({ transform: `translateX(-${shift})` });
  curItem.removeClass("cur_item");
  prevItem.addClass("cur_item");
}
