const APIURL = "https://api.github.com/users/";

const main = document.querySelector("#main");

const getUser = async (username) => {
    const response = await fetch(APIURL + username);
    const data = await response.json();
    console.log(data);
    const card = `
   <div class = "profile-container">
   <div class = "profile-info">
       <div class = "profile-image"> 
           <img src = "${data.avatar_url}" alt = "user image">
       </div>
       
   <div class = "profile-details">
        <h2> ${data.name}</h2>
        <p> ${data.bio}</p>
        <p> <i class='fas fa-map-marker-alt'></i> ${data.location}</p>
        <p> Twitter: ${data.twitter_username} <a href="https://twitter.com/userhandle"  style="text-decoration:none"></a></p>
   </div>
   
   </div>
   <div class = "github">  
       <a href="https://github.com/supuna97" target = "_blank"  style="text-decoration:none"ravi >https://github.com/supuna97/ </a>
   </div>
</div>
   `
    main.innerHTML = card;
}

function fetchRepositories(username, page = 1, perPage = 10) {
    const repoUrl = `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`;
    return fetch(repoUrl)
        .then(response => response.json())
        .catch(error => {
            console.error("Error fetching repositories:", error);
            throw error;
        });
}

function createRepositoryCard(repo) {
    const card = document.createElement("div");
    card.classList.add("repository-card");

    const title = document.createElement("h3");
    title.textContent = repo.name;

    const description = document.createElement("p");
    description.textContent = repo.description || "No description available.";

    const technologies = document.createElement("tech");
    technologies.textContent = `${repo.language || "Not specified."}`;

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(technologies);

    return card;
}

function displayRepositories(username, page, perPage) {
    const repositoriesContainer = document.getElementById("repositories");
    repositoriesContainer.innerHTML = ''; // Clear previous repositories

    fetchRepositories(username, page, perPage)
        .then(repositories => {
            repositories.forEach(repo => {
                const card = createRepositoryCard(repo);
                repositoriesContainer.appendChild(card);
            });
        })
        .catch(error => console.error("Error displaying repositories:", error));
    const searchBar = document.getElementById("searchBar");
    searchBar.addEventListener("input", handleSearch);
}


let currentPage = 1;
let repositoriesPerPage = 10;
const totalPages = 9;


function goToPage(page) {
    currentPage = page;
    displayRepositories("supuna97", currentPage, repositoriesPerPage);
    updatePaginationButtons();
}

function goToPrevious() {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

function goToNext() {
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}

function updatePaginationButtons() {
    const buttons = document.querySelectorAll('.pagination button');
    buttons.forEach(button => {
        button.removeAttribute('disabled');
        if (parseInt(button.textContent) === currentPage) {
            button.setAttribute('disabled', 'true');
        }
    });

    document.querySelector('.pagination button:first-child').disabled = currentPage === 1;
    document.querySelector('.pagination button:last-child').disabled = currentPage === totalPages;
}


function handleSearch() {
    const searchTerm = document.getElementById("searchBar").value.toLowerCase();
    const repositoriesContainer = document.getElementById("repositories");

    const repositoryCards = repositoriesContainer.getElementsByClassName("repository-card");

    for (const card of repositoryCards) {
        const title = card.querySelector("h3").textContent.toLowerCase();
        const shouldShow = title.includes(searchTerm);
        card.style.display = shouldShow ? "block" : "none";
    }
}

getUser("supuna97");
displayRepositories("supuna97", 1, 10);