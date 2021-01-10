const apiKey = 'd4836a43';
const searchMovie = document.getElementById('searchBar');
const searchAgain = document.getElementById('searchAgain');
const movieContainer = document.querySelector('.movieContainer');
const movieFront = document.querySelector('.movieFront');
const movieBack = document.querySelector('.movieBack');
const actorContainer = document.querySelector('.actorContainer');

const renderOmdbData = async (search) => {
  try {
    let response = await fetch(
      `http://www.omdbapi.com/?s=${search}&apikey=${apiKey}`
    );
    let data = await response.json();

    movieFront.innerHTML = '';
    if (data.Search) {
      for (let i = 0; i < 10; i++) {
        const value = data.Search[i];

        movieFront.innerHTML += `
          <div class="movie">
          <img id="poster" src="${value.Poster}" onclick="renderOmdbSummary('${value.imdbID}')">      
          </div>
          `;
      }
    } else {
      movieFront.innerHTML = `
        <div class="errorMessage">Movie not found, try again!</div>
        `;
      movieBack.innerHTML = '';
      actorContainer.innerHTML = '';
    }
  } catch (err) {
    console.log(err);
  }
};

const renderOmdbSummary = async (imdbID) => {
  try {
    let response = await fetch(
      `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`
    );
    let data = await response.json();
    // console.log(data);
    movieBack.innerHTML = `
        <div class="movieSumContainer">  
        <div class="posterDiv">
        <img id="poster" src="${data.Poster}">
        </div>
        <div class="summaryContainer">
        <h2>Title:${data.Title}</h2>
        <p class="imdbRating">IMDB Rating: ${data.imdbRating}/10⭐️</p>
        <p class="info">Year: ${data.Year}</p>
        <p class="info">Genre: ${data.Genre}</p>
        <p class="info">Summary: ${data.Plot}</p>
        <p class="info">Runtime: ${data.Runtime}</p>
        <a class="viewMore" target="_blank" href="https://www.imdb.com/title/${data.imdbID}/">View more..</a>        
        </div>
        </div>
        `;

    let actorToSearchFor = data.Actors.split(',', 5);
    console.log(actorToSearchFor);
    searchMovie.style.display = 'none';
    searchAgain.style.display = 'block';
    renderActors(actorToSearchFor);
    movieFront.innerHTML = '';
  } catch (err) {
    console.log(err);
  }
};

const renderActors = async (actorToSearchFor) => {
  for (let i = 0; i < actorToSearchFor.length; i++) {
    try {
      console.log(actorToSearchFor[i]);
      let response = await fetch(
        `http://api.tvmaze.com/search/people?q=${actorToSearchFor[i]}`
      );
      let data = await response.json();

      actorContainer.innerHTML += `
      <div class="actor">      
      <img src="${data[0].person.image.original}">
      <h2 style="text-align: center;">${data[0].person.name}</h2>
      </div>
      `;

      console.log(data[0].person.image.original);
    } catch (err) {
      console.log(err);
    }
  }
};

searchAgain.addEventListener('click', () => {
  searchAgain.style.display = 'none';
  movieBack.innerHTML = '';
  actorContainer.innerHTML = '';
  searchMovie.style.display = 'block';
});

searchBar.addEventListener('keyup', () => {
  if (searchBar.value.length > 2) {
    let input = searchBar.value;
    renderOmdbData(input);
  }
  if (searchBar.value.length < 3) {
    movieFront.innerHTML = '';
    movieBack.innerHTML = '';
    actorContainer.innerHTML = '';
  }
});

const flipPoster = () => {};
