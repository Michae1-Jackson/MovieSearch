var watchList = $("#section_watchlist ul");
var browseList = $("#section_browse ul");
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
  $.ajax({
    url: `${api.root}/discover/movie`,
    data: {
      api_key: api.token,
      page: randInt(1, 100),
      keywords: keywords,
    },
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
  let movieBlock = $("<li>").addClass("movie_block");
  let title = $("<p>").text(movie.title).addClass("movie_title");
  let poster = $("<img>")
    .addClass("movie_poster")
    .attr("src", api.posterUrl(movie.poster_path))
    .on("error", (el) =>
      $(el.target).attr("src", "assets/images/No_image_available.svg")
    );
  let overview = $("<p>").text(movie.overview).addClass("movie_overview");
  let content = $("<div>").addClass("movie_content").append(poster, overview);
  return movieBlock.append(title, content);
}

function render() {
  watchList.empty();
  browseList.empty();
  model.watchListItems.forEach((movie) => {
    let movieBlock = movieBlockCreate(movie);
    let removeBtn = $("<div>")
      .text("I watched it!")
      .addClass(["cool_btn", "remove_from_WL_btn"])
      .click(() => {
        model.watchListItems = model.watchListItems.filter(
          (movieInList) => movieInList.title != movie.title
        );
        render();
      });
    movieBlock.append(removeBtn);
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
        .addClass(["cool_btn", "add_to_WL_btn"])
        .click(() => {
          model.watchListItems.push({
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
    browseList.append(movieBlock, $("<div>").addClass("item_del"));
  });
}
