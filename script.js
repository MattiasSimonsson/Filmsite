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
        console.log(value);
        if (value.Poster === 'N/A') {
          movieFront.innerHTML += `
          <div class="movie">               
          <div class="noPoster" onclick="renderOmdbSummary('${value.imdbID}')">  
          <p class="noPosterText">${value.Title}</p>           
          </div>              
          </div>
          `;
        } else {
          movieFront.innerHTML += `
            <div class="movie">
            <div class="moviePoster">
            <img id="test" src="${value.Poster}" onclick="renderOmdbSummary('${value.imdbID}')">    
            </div>  
            </div>
            `;
        }
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
    if (data.Poster === 'N/A') {
      movieBack.innerHTML = `
          <div class="movieSumContainer">         
          <div class="posterSummary">  
          <p class="posterSummaryText">${data.Title}</p>           
          </div>       
          <div class="summaryContainer">
          <h2>Title:${data.Title}</h2>
          <p class="imdbRating">IMDB Rating: ${data.imdbRating}/10⭐️</p>
          <p class="info">Year: ${data.Year}</p>
          <p class="info">Genre: ${data.Genre}</p>
          <p class="info">Summary: ${data.Plot}</p>
          <p class="info">Runtime: ${data.Runtime}</p>
          <a class="viewMore" target="_blank" href="https://www.imdb.com/title/${data.imdbID}/"><img src="imdb-logo.png"></a>        
          </div>
          </div>
          `;
    } else {
      movieBack.innerHTML = `
          <div class="movieSumContainer">         
          <img id="poster" src="${data.Poster}">       
          <div class="summaryContainer">
          <h2>Title:${data.Title}</h2>
          <p class="imdbRating">IMDB Rating: ${data.imdbRating}/10⭐️</p>
          <p class="info">Year: ${data.Year}</p>
          <p class="info">Genre: ${data.Genre}</p>
          <p class="info">Summary: ${data.Plot}</p>
          <p class="info">Runtime: ${data.Runtime}</p>
          <a class="viewMore" target="_blank" href="https://www.imdb.com/title/${data.imdbID}/"><img src="imdb-logo.png"></a>        
          </div>
          </div>
          `;
    }

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
      let response = await fetch(
        `http://api.tvmaze.com/search/people?q=${actorToSearchFor[i]}`
      );
      let data = await response.json();

      console.log(data[i]);

      if (data[0].person.image === null) {
        actorContainer.innerHTML += `
          <div class="actor">                 
          <a href="${data[0].person.url}" target="_blank"><img src="http://static.tvmaze.com/images/no-img/no-img-portrait-text.png"></a>                  
         <h2 style="text-align: center;">${data[0].person.name}</h2>
          </div>
          `;
      } else {
        actorContainer.innerHTML += `
        <div class="actor">                  
        <a href="${data[0].person.url}" target="_blank"><img src="${data[0].person.image.medium}"></a>
        <h2 style="text-align: center;">${data[0].person.name}</h2>
        </div>
        `;
      }
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
  searchBar.value = '';
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
