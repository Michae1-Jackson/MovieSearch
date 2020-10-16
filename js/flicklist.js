var domWatchList = $("#section_watchlist ul");
var domMovieList = $("#section_browse ul");

var model = {
  watchListItems: [],
  browseItems: [],
};
var api = {
  root: "https://api.themoviedb.org/3",
  token: myApiKey,
};

/* Makes an AJAX request to themoviedb.org, asking for some movies if successful, updates the model.browseItems appropriately, and then invokes the callback function that was passed in */
function discoverMovies(callback) {
  $.ajax({
    url: `${api.root}/discover/movie`,
    data: {
      api_key: api.token,
      page: randInt(1, 100),
    },
    success: function (response) {
      model.browseItems = response.results;
      callback();
    },
  });
}

console.log("The script loaded!");
// re-renders the page with new content, based on the current state of the model
function render() {
  domWatchList.empty();
  domMovieList.empty();
  model.watchListItems.forEach((movie) => {
    let liMovie = $("<li>", { class: "movie_item" });
    let movieTitle = $("<p>", {
      html: `${movie.title}`,
      class: "movie_title",
    });
    let movieOverview = $("<p>", {
      html: `${movie.overview}`,
      class: "movie_overview",
    });
    liMovie.append(movieTitle, movieOverview);
    domWatchList.append(liMovie, $("<div>", { class: "item_del" }));
  });

  model.browseItems.forEach((movie) => {
    let liMovie = $("<li>", { class: "movie_item" });
    let movieTitle = $("<p>", {
      html: `${movie.title}`,
      class: "movie_title",
    });
    let movieOverview = $("<p>", {
      html: `${movie.overview}`,
      class: "movie_overview",
    });
    liMovie.append(movieTitle, movieOverview);
    let added = model.watchListItems.filter(
      (movie) => movie.title == movieTitle.html()
    ).length;
    if (!added) {
      liMovie.append(
        $("<div>", {
          html: "Add to Watch List",
          class: "add_to_WL_btn",
        }).click(() => {
          model.watchListItems.push({
            title: movieTitle.html(),
            overview: movieOverview.html(),
          });
          render();
        })
      );
    } else {
      liMovie.append(
        $("<div>", {
          html: "Aready in your Watch List!",
          class: "already_in_WL",
        })
      );
    }
    domMovieList.append(liMovie, $("<div>", { class: "item_del" }));
  });
}

// When the HTML document is ready, we call the discoverMovies function,
// and pass the render function as its callback
$(document).ready(function () {
  discoverMovies(render);
});
