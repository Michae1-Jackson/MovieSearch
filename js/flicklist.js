<<<<<<< HEAD
var api = {
  root: "https://api.themoviedb.org/3",
  token: "96981688b770f7bc9fdff26c4166c6f3",
};

/** Makes an AJAX request to themoviedb.org,
 * asking for some movies
 * if successful, prints the results to the console */
function testTheAPI() {
=======
var model = {
  watchlistItems: [],
  browseItems: [],
};

var api = {
  root: "https://api.themoviedb.org/3",
  token: myApiKey,
};

/**
 * Makes an AJAX request to themoviedb.org, asking for some movies
 * if successful, updates the model.browseItems appropriately, and then invokes
 * the callback function that was passed in
 */
function discoverMovies(callback) {
>>>>>>> studio1
  $.ajax({
    url: api.root + "/discover/movie",
    data: {
      api_key: api.token,
    },
    success: function (response) {
      console.log("We got a response from The Movie DB!");
      console.log(response);
<<<<<<< HEAD
=======

      model.browseItems = response.results;
      // invoke the callback function that was passed in.
      callback();
>>>>>>> studio1
    },
  });
}

<<<<<<< HEAD
console.log("The script loaded!");
testTheAPI();
=======
/**
 * re-renders the page with new content, based on the current state of the model
 */
function render() {
  // TODO 7
  // clear everything from both lists

  // TODO 6
  // for each movie on the user's watchlist, insert a list item into the <ul> in the watchlist section

  // for each movie on the current browse list,
  model.browseItems.forEach(function (movie) {
    // TODO 3
    // insert a list item into the <ul> in the browse section
    // TODO 4
    // the list item should include a button that says "Add to Watchlist"
    // TODO 5
    // when the button is clicked, this movie should be added to the model's watchlist and render() should be called again
  });
}

// When the HTML document is ready, we call the discoverMovies function,
// and pass the render function as its callback
$(document).ready(function () {
  discoverMovies(render);
});
>>>>>>> studio1
