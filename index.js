const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results-container");

const API_KEY = "9da7b9df";

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query);
    } else {
        alert("Please enter a movie or TV show name!");
    }
});

// Fetch movies based on search query
async function fetchMovies(query) {
    const url = `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            resultsContainer.innerHTML = `<p>${data.Error}</p>`;
        }
    } catch (error) {
        console.error("Error:", error);
        resultsContainer.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    }
}

// Display search results
function displayMovies(movies) {
    resultsContainer.innerHTML = ""; // Clear previous results
    movies.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button class="details-button" data-id="${movie.imdbID}">View Details</button>
        `;
        resultsContainer.appendChild(movieCard);
    });

    // Add event listeners to "View Details" buttons
    const detailButtons = document.querySelectorAll(".details-button");
    detailButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const imdbID = button.getAttribute("data-id");
            fetchMovieDetails(imdbID);
        });
    });
}

// Fetch detailed data for a specific movie
async function fetchMovieDetails(imdbID) {
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.Response === "True") {
            displayMovieDetails(data);
        } else {
            alert(data.Error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again later.");
    }
}

const movieId = "1kYbJ0nmC9c5LNIF";
// Display detailed information for a specific movie
function displayMovieDetails(movie) {
    resultsContainer.innerHTML = `
        <div class="movie-details container">
            <div class="row">
                <div class="col-12 col-sm-4 col-md-4 col-lg-4">
                    <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}" alt="${movie.Title}">
                </div>
                <div class="col-12 col-sm-8 col-md-8 col-lg-8" id="trailer-container">
                    <div id="trailer-window">
                        <iframe width="100%" height="315" src="https://www.youtube.com/embed/fqc364gMbxI?si=Qv0DI8LT7ZrpvKQl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
            <h2>${movie.Title}</h2>
            <p><strong>Year:</strong> ${movie.Year}</p>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <button id="back-button">Back to Search Results</button>
        </div>
    `;

    // Add event listener to "Back" button
    const backButton = document.getElementById("back-button");
    backButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        fetchMovies(query); // Reload the search results
    });

    // Add event listener to "Play Trailer" button
    const playTrailerBtn = document.getElementById("play-trailer-btn");
    const trailerWindow = document.getElementById("trailer-window");
    trailerWindow.classList.toggle("active");
    // playTrailerBtn.addEventListener("click", () => {
    //     trailerWindow.classList.toggle("active");
    // });
}

const newReleaseContainer = document.getElementById("newRelease-container");
const TMDB_API_KEY = "e1e4c1f42f8c3b23a383b23e159a3890";

async function fetchNewReleases() {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.results.length > 0) {
            displayNewReleases(data.results);
        } else {
            newReleaseContainer.innerHTML = `<p>No new releases found.</p>`;
        }
    } catch (error) {
        console.error("Error:", error);
        newReleaseContainer.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    }
}

function displayNewReleases(movies) {
    newReleaseContainer.innerHTML = ""; // Clear previous results
    movies.forEach((movie) => {
                const movieCard = document.createElement("div");
                movieCard.classList.add("movie-card");
                movieCard.innerHTML = `
            <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : "https://via.placeholder.com/200"}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.release_date}</p>
            <button class="details-button" data-id="${movie.id}">View Details</button>
        `;
        newReleaseContainer.appendChild(movieCard);
    });

    // Add event listeners to "View Details" buttons
    const detailButtons = document.querySelectorAll(".details-button");
    detailButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const movieID = button.getAttribute("data-id");
            fetchNewMovieDetails(movieID);
        });
    });
}

async function fetchNewMovieDetails(movieID) {
    const url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${TMDB_API_KEY}&language=en-US`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data) {
            displayNewMovieDetails(data);
        } else {
            alert("No details found.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again later.");
    }
}

function displayNewMovieDetails(movie) {
    newReleaseContainer.innerHTML = `
        <div class="movie-details container">
            <div class="row">
                <div class="col-6">
                    <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : "https://via.placeholder.com/300"}" alt="${movie.title}">
                </div>
                <div class="col-6">
                    <h2>${movie.title}</h2>
                    <p><strong>Release Date:</strong> ${movie.release_date}</p>
                    <p><strong>Overview:</strong> ${movie.overview}</p>
                    <p><strong>Genres:</strong> ${movie.genres.map(genre => genre.name).join(", ")}</p>
                    <button id="back-button">Back to New Releases</button>
                </div>
            </div>
        </div>
    `;

    // Add event listener to "Back" button
    const backButton = document.getElementById("back-button");
    backButton.addEventListener("click", () => {
        fetchNewReleases(); // Reload new releases
    });
}

// Fetch new releases when page loads
fetchNewReleases();