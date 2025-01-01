const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results-container");
const newReleaseContainer = document.getElementById("newRelease-container");
const dropdownContent = document.querySelector(".dropdown-content");
const bollywoodBtn = document.getElementById('bollywoodButton');
const hollywoodBtn = document.getElementById('hollywoodButton');

// const movieId = "1kYbJ0nmC9c5LNIF";    

const OMDB_API_KEY = "9da7b9df";
const TMDB_API_KEY = "e1e4c1f42f8c3b23a383b23e159a3890";

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query);
    } else {
        alert("Please enter a movie or TV show name!");
    }
});

async function searchMovies(query) {
    debugger
    resultsContainer.innerHTML = "";

    const url = `https://www.omdbapi.com/?s=${query}&apikey=${OMDB_API_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.Response === "True") {
            const filteredMovies = data.Search.filter(movie =>
                movie.Year >= 1990 && movie.Type === "movie"
            );
            const sortedMovies = filteredMovies.sort((a, b) => b.Year - a.Year);
            displayMovies(sortedMovies);
        } else {
            resultsContainer.innerHTML = `<p>${data.Error}</p>`;
        }
    } catch (error) {
        console.error("Error:", error);
        resultsContainer.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    }
}

function displayMovies(movies, isNewRelease = false) {
    const container = isNewRelease ? newReleaseContainer : resultsContainer;
    newReleaseContainer.innerHTML = "";

    movies.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        const poster = isNewRelease
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200";
        const title = isNewRelease ? movie.title : movie.Title;
        const year = isNewRelease ? movie.release_date : movie.Year;

        movieCard.innerHTML = `
            <img src="${poster}" alt="${title}">
            <h3>${title}</h3>
            <p>${year}</p>
            <button class="details-button" data-id="${isNewRelease ? movie.id : movie.imdbID}">View Details</button>
        `;

        container.appendChild(movieCard);
    });

    const detailButtons = document.querySelectorAll(".details-button");
    detailButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const movieID = button.getAttribute("data-id");
            fetchMovieDetails(movieID, isNewRelease);
        });
    });
}

async function fetchMovieDetails(movieID, isNewRelease = false) {
    newReleaseContainer.innerHTML = "";
    const url = isNewRelease
    ? `https://api.themoviedb.org/3/movie/${movieID}?api_key=${TMDB_API_KEY}&language=en-US`
    : `https://www.omdbapi.com/?i=${movieID}&apikey=${OMDB_API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data) {
            displayMovieDetails(data,isNewRelease);
        } else {
            alert(data.Error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again later.");
    }
}

function displayMovieDetails(movie, isNewRelease = false) {
    const fields = [
        { label: 'Year', value: isNewRelease ? movie.release_date : movie.Released },
        { label: 'Genre', value: isNewRelease ? movie.genres.map(g => g.name).join(", ") : movie.Genre },
        { label: 'Director', value: isNewRelease ? movie.director : movie.Director },
        { label: 'Actors', value: isNewRelease ? movie.actors : movie.Actors },
        { label: 'Plot', value: isNewRelease ? movie.overview : movie.Plot }
    ];

    const poster = isNewRelease
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300";

    let detailsHTML = `
        <div class="movie-details container">
            <div class="row">
                <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                    <img src="${poster}" alt="${isNewRelease ? movie.title : movie.Title}">
                </div>
                <div class="col-12 col-sm-12 col-md-8 col-lg-8">
                    <h2>${isNewRelease ? movie.title : movie.Title}</h2>
    `;

    fields.forEach(field => {
        if (field.value) {
            detailsHTML += `<p><strong>${field.label}:</strong> ${field.value}</p>`;
        }
    });

    detailsHTML += `
                    <div>
                        <div id="trailer-window">
                            <iframe width="100%" height="315" src="https://www.youtube.com/embed/fqc364gMbxI?si=Qv0DI8LT7ZrpvKQl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                        </div>
                        <button id="back-button">Back</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    resultsContainer.innerHTML = detailsHTML;

    const backButton = document.getElementById("back-button");
    backButton.addEventListener("click", () => {
        fetchNewReleases();
    });
}


async function fetchNewReleases() {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.results.length > 0) {
            displayMovies(data.results, true); 
        } else {
            newReleaseContainer.innerHTML = `<p>No new releases found.</p>`;
        }
    } catch (error) {
        console.error("Error:", error);
        newReleaseContainer.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    }
}

fetchNewReleases();

dropdownContent.addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-button")) {
        debugger
        const genre = e.target.getAttribute("data-genre");
        fetchMoviesByGere(genre);
    }
})

async function fetchMoviesByGere(genre) {
    debugger
    const response = await fetch(`https://www.omdbapi.com/?apikey=9da7b9df&s=${genre}`);
    const data = await response.json();

    if (data.Response = "True") {
        displayMovies(data.Search);
    } else {
        resultsContainer.innerHTML = `<p> no movies found for genre : ${genre}</p>`;
    }
}

document.querySelector('.bollywoodSection').addEventListener('click', (e) => {
    debugger
    if (e.target.classList.contains('bollywoodButton') && e.target.getAttribute('data-category') === 'Bollywood') {
        fetchBollywoodMovies();
    }
});

async function fetchBollywoodMovies() {
    debugger
    const response = await fetch(`https://www.omdbapi.com/?apikey=9da7b9df&s=indian`);
    const data = await response.json();

    if (data.Response = "True") {
        const bollywoodMovies = [];
        for (const movie of data.Search) {
            const detailsResponse = await fetch(`https://www.omdbapi.com/?apikey=9da7b9df&i=${movie.imdbID}`)
            const movieDetails = await detailsResponse.json();
            if (movieDetails.Country && movieDetails.Country.includes("India") && parseInt(movieDetails.Year) >= 2020) {
                bollywoodMovies.push(movieDetails);
            }
        }
        displayMovies(bollywoodMovies);
    } else {
        resultsContainer.innerHTML = `<p>No Bollywood movies found.</p>`;
    }

}

document.querySelector('.hollywoodSection').addEventListener('click', (e) => {
    debugger
    if (e.target.classList.contains('hollywoodButton') && e.target.getAttribute('data-category') === 'Hollywood') {
        fetchHollywoodMovies();
    }
});

async function fetchHollywoodMovies() {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=9da7b9df&s=movie`);
        const data = await response.json();

        if (data.Response === "True") {
            const hollywoodMovies = [];

            const movieDetailsPromises = data.Search.map(movie =>
                fetch(`https://www.omdbapi.com/?apikey=9da7b9df&i=${movie.imdbID}`).then(res => res.json())
            );
            const movieDetailsArray = await Promise.all(movieDetailsPromises);

            for (const movieDetails of movieDetailsArray) {
                if (
                    movieDetails.Country &&
                    (movieDetails.Country.includes("United States") || movieDetails.Country.includes("United Kingdom")) || movieDetails.Country.includes("Canada") &&
                    parseInt(movieDetails.Year) >= 2000
                ) {
                    hollywoodMovies.push(movieDetails);
                }
            }

            displayMovies(hollywoodMovies);
        } else {
            resultsContainer.innerHTML = `<p>No Hollywood movies found.</p>`;
        }
    } catch (error) {
        console.error("Error fetching Hollywood movies:", error);
        resultsContainer.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    }
}

