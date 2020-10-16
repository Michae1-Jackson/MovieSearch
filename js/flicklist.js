var watchList = $("#section_watchlist ul");
var browseList = $("#section_browse ul");
var model = {
  watchListItems: [],
  browseItems: [],
};
var api = {
  root: "https://api.themoviedb.org/3",
  token: myApiKey,
};

$(document).ready(function () {
  discoverMovies(render);
});

$("#movie_search").submit((event) => {
  event.preventDefault();
  searchMovies($("#search_input").val(), render);
});

function discoverMovies(callback) {
  $.ajax({
    url: `${api.root}/discover/movie`,
    data: {
      api_key: api.token,
      page: randInt(1, 100),
    },
    success: (response) => {
      model.browseItems = response.results;
      callback();
    },
  });
}

function searchMovies(searchFilm, callback) {
  $.ajax({
    url: `${api.root}/search/movie`,
    data: {
      api_key: api.token,
      query: searchFilm,
    },
    success: (response) => {
      model.browseItems = response.results;
      callback();
    },
  });
}

function movieBlockCreate(movie) {
  let movieBlock = $("<li>").addClass("movie_block");
  let title = $("<p>").text(movie.title).addClass("movie_title");
  let overview = $("<p>").text(movie.overview).addClass("movie_overview");
  return movieBlock.append(title, overview);
}

function render() {
  watchList.empty();
  browseList.empty();
  model.watchListItems.forEach((movie) => {
    let movieBlock = movieBlockCreate(movie);
    watchList.append(movieBlock, $("<div>").addClass("item_del"));
  });
  model.browseItems.forEach((movie) => {
    let movieBlock = movieBlockCreate(movie);
    let added = model.watchListItems.filter(
      (movieInList) => movieInList.title == movie.title
    ).length;
    if (!added) {
      let addBtn = $("<div>")
        .text("Add to Watch List")
        .addClass("add_to_WL_btn")
        .click(() => {
          model.watchListItems.push({
            title: movie.title,
            overview: movie.overview,
          });
          render();
        });
      movieBlock.append(addBtn);
    } else
      movieBlock.append(
        $("<div>").text("Aready in your Watch List!").addClass("already_in_WL")
      );
    browseList.append(movieBlock, $("<div>").addClass("item_del"));
  });
}
