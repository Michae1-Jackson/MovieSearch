var watchList = $("#watchlist");
var flicklist = $(".flicklist");
var flickBtns = $(".flick_btn");
var browseList = $("#browselist");

var substrate = $("<img>")
  .attr("src", "assets/images/substrate.png")
  .addClass("not_empty_watchlist");
flicklist.addClass("empty_watchlist");
flickBtns.hide();

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
      console.log(model.browseItems);
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
  let poster = $("<img>")
    .addClass("movie_poster")
    .attr("src", api.posterUrl(movie.poster_path))
    .on("error", (el) =>
      $(el.target)
        .attr("src", "assets/images/No_image_available.svg")
        .addClass("no_poster")
    );
  let overview = $("<p>").text(movie.overview).addClass("movie_overview");
  let content = $("<div>").addClass("movie_content").append(poster, overview);
  return movieBlock.append(title, content);
}

function render() {
  watchList.empty();
  browseList.empty();

  if (model.watchListItems.length) {
    if (flicklist.hasClass("empty_watchlist")) {
      flicklist.removeClass("empty_watchlist");
      flicklist.append(substrate);
      flickBtns.show();
    }
    model.watchListItems.forEach((movie) => {
      let movieBlock = movieBlockCreate(movie);
      let removeBtn = $("<div>")
        .text("I watched it!")
        .addClass(["cool_btn", "remove_from_WL_btn"])
        .click(() => {
          model.watchListItems = model.watchListItems.filter(
            (movieInList) => movieInList.id != movie.id
          );
          render();
        });
      movieBlock.append(removeBtn);
      let flickItem = $("<li>").append(movieBlock).addClass("flick_item");
      watchList.append(flickItem);
    });
  } else {
    if (flicklist.has(".not_empty_watchlist")) {
      flicklist.addClass("empty_watchlist");
      $(".not_empty_watchlist").remove();
      flickBtns.hide();
    }
    let emptyWatchList = $("<div>")
      .text("In your watch list no movies yet. Let`s find some!")
      .addClass("emptyWatchList");
    watchList.append(emptyWatchList);
  }

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
  } else {
    let emptyBrowse = $("<div>")
      .text("No such movies found")
      .addClass("emptyBrowse");
    browseList.append(emptyBrowse);
  }
}
