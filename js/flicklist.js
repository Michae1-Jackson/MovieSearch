var domWatchList = $("#section-watchlist ul");
var domMovieList = $("#section-browse ul");

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
  domWatchList.empty();
  model.watchListItems.forEach((title) => {
    let liMovie = $("<li>", { class: "movieItem" });
    let movieTitle = $("<p>", {
      html: `${title}`,
      class: "movieTitle",
    });
    liMovie.append(movieTitle);
    domWatchList.append(liMovie);
  });

  model.browseItems.forEach((movie) => {
    let liMovie = $("<li>", { class: "movieItem" });
    let movieTitle = $("<p>", {
      html: `${movie.title}`,
      class: "movieTitle",
    });
    let addToWLBtn = $("<button>", {
      html: "Add to Watchlist",
      class: "addToWLBtn",
    }).on("click", (event) => {
      thisMovie = $(event.target).prev().html();
      if (
        !model.watchListItems.filter((movieWL) => movieWL == thisMovie).length
      ) {
        model.watchListItems.push(thisMovie);
      }
      render();
    });
    liMovie.append(movieTitle, addToWLBtn);
    domMovieList.append(liMovie);
  });
}

// When the HTML document is ready, we call the discoverMovies function,
// and pass the render function as its callback
$(document).ready(function () {
  discoverMovies(render);
});
