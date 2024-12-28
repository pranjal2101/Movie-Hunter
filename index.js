const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results-container");

const API_KEY = "9da7b9df";

searchBtn.addEventListener("click", () => {
    debugger
    const query = searchInput.value.trim();
    if (query) {
        fetchMovies(query);
    } else {
        alert("Please enter a movie or TV show name!");
    }
});

// Fetch movies based on search query
async function fetchMovies(query) {
    debugger
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
    debugger
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
    debugger
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

// Display detailed information for a specific movie
function displayMovieDetails(movie) {
    debugger
    resultsContainer.innerHTML = `
        <div class="movie-details">
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}" alt="${movie.Title}">
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
}