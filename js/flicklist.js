var domWatchList = $($("#section-watchlist").children()[1]);
var domMovieList = $($("#section-browse").children()[1]);

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
      console.log("We got a response from The Movie DB!");
      console.log(response);

      model.browseItems = response.results;
      // invoke the callback function that was passed in.
      callback();
    },
  });
}

console.log("The script loaded!");
// re-renders the page with new content, based on the current state of the model
function render() {
  while (domWatchList.children().length) domWatchList.children()[0].remove();
  while (domMovieList.children().length) domMovieList.children()[0].remove();
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
      console.log(model.watchListItems);
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
