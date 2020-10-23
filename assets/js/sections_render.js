var watchList = $("#watchlist");
var flickBtns = $(".flick_btn");
var browseList = $("#browselist");
var substrate = $("<img>")
  .attr("src", "assets/images/substrate.png")
  .addClass("watchlist_substrate");
var watchListPlug = $("<div>")
  .text("In your watch list no movies yet. Let`s find some!")
  .addClass("watchlist_plug");
var browsePlug = $("<div>")
  .text("No such movies found")
  .addClass("browse_plug");

var model = {
  watchListItems: [],
  browseItems: [],
};

var api = {
  root: "https://api.themoviedb.org/3",
  token: myApiKey,
  posterUrl: (posterPath) => {
    return `https://image.tmdb.org/t/p/w300/${posterPath}`;
  },
};

$(document).ready(function () {
  discoverMovies(render);
});

$("#search_by_title").submit((event) => {
  event.preventDefault();
  searchByTitle($("#title_input").val(), render);
});

$("#search_by_topic").submit((event) => {
  event.preventDefault();
  searchByTopic($("#topic_input").val(), render);
});

function discoverMovies(callback, keywords) {
  let queryData = { api_key: api.token };
  if (keywords) queryData["with_keywords"] = keywords;
  else queryData["page"] = randInt(1, 500);
  $.ajax({
    url: `${api.root}/discover/movie`,
    data: queryData,
    success: (response) => {
      model.browseItems = response.results;
      // console.log(model.browseItems);
      callback();
    },
  });
}

function searchByTitle(title, callback) {
  $.ajax({
    url: `${api.root}/search/movie`,
    data: {
      api_key: api.token,
      query: title,
    },
    success: (response) => {
      model.browseItems = response.results;
      callback();
    },
  });
}

function searchByTopic(topic, callback) {
  $.ajax({
    url: `${api.root}/search/keyword`,
    data: {
      api_key: api.token,
      query: topic,
    },
    success: (response) => {
      let keywords = response.results.map((res) => res.id).join("|");
      discoverMovies(callback, keywords);
    },
  });
}

function movieBlockCreate(movie) {
  let movieBlock = $("<div>").addClass("movie_block");
  let title = $("<p>").text(movie.title).addClass("movie_title");
  let poster = $("<img>").addClass("movie_poster");
  if (movie.poster_path) poster.attr("src", api.posterUrl(movie.poster_path));
  else
    poster
      .attr("src", "assets/images/no_image_available_new.svg")
      .addClass("no_poster");
  let posterWrap = $("<div>").addClass("poster_wrap");
  let overview = $("<p>").text(movie.overview).addClass("movie_overview");
  let content = $("<div>")
    .addClass("movie_content")
    .append(posterWrap.append(poster), overview);
  return movieBlock.append(title, content);
}

function render() {
  watchList.empty();
  browseList.empty();

  if (model.watchListItems.length) {
    if (model.watchListItems.length == 1) flickOn();
    model.watchListItems.forEach((movie) => {
      let movieBlock = movieBlockCreate(movie);
      let removeBtn = $("<div>")
        .text("I watched it!")
        .addClass(["cool_btn", "remove_from_WL_btn"])
        .click(() => {
          moveList(0, 1);
          model.watchListItems = model.watchListItems.filter(
            (movieInList) => movieInList.id != movie.id
          );
          render();
        });
      movieBlock.append(removeBtn);
      watchList.append($("<li>").append(movieBlock).addClass("flick_item"));
    });
  } else flickOff();

  if (model.browseItems.length) {
    model.browseItems.forEach((movie) => {
      let movieBlock = movieBlockCreate(movie);
      let added = model.watchListItems.filter(
        (movieInList) => movieInList.id == movie.id
      ).length;
      if (!added) {
        let addBtn = $("<div>")
          .text("Add to Watch List")
          .addClass(["cool_btn", "add_to_WL_btn"])
          .click(() => {
            model.watchListItems.push({
              id: movie.id,
              title: movie.title,
              overview: movie.overview,
              poster_path: movie.poster_path,
            });
            render();
            newFlickItem();
          });
        movieBlock.append(addBtn);
      } else
        movieBlock.append(
          $("<div>")
            .text("Aready in your Watch List!")
            .addClass(["cool_btn", "already_in_WL"])
        );
      movieBlock.append($("<div>").addClass("item_del"));
      browseList.append($("<li>").append(movieBlock));
    });
  } else browseList.append(browsePlug);
  flickRender();
}

function flickOn() {
  $(".watchlist_plug").remove();
  $(".flicklist").append(substrate);
  $(".flick_item").eq(0).addClass("cur_item");
  $(".flick_btn--left").on("click", () => moveList(0, 0));
  $(".flick_btn--right").on("click", () => moveList(1, 0));
}

function flickOff() {
  watchList.append(watchListPlug);
  $(".watchlist_substrate").remove();
  $(".flick_btn--left").off("click");
  $(".flick_btn--right").off("click");
}
