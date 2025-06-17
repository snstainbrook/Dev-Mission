const airtableApiKey =
  "pat37zUEJfURegPhM.4328ff80c7d0dc9fdca3a1270251097e4fc15f98486c9393b268c27cedbae834";
const baseId = "appmQqoBN13vZcwhM";
const tableName = "Puppies";
const tableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("card-container")) {
    loadPuppyCards();
  } else if (document.getElementById("DogName")) {
    const urlParams = new URLSearchParams(window.location.search);
    const puppyId = urlParams.get("id");
    if (puppyId) loadPuppyProfile(puppyId);
  }
});

// Fetch all puppies from Airtable
async function fetchPuppies() {
  const response = await fetch(tableUrl, {
    headers: {
      Authorization: `Bearer ${airtableApiKey}`,
    },
  });

  const data = await response.json();
  return data.records;
}

// Load cards on index.html
async function loadPuppyCards() {
  const container = document.getElementById("card-container");
  const puppies = await fetchPuppies();

  puppies.forEach((puppy) => {
    const fields = puppy.fields;
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
  <div class="card h-100">
    <img src="${fields.PupImage[0].url}" class="card-img-top" alt="${fields.DogName}">
    <div class="card-body d-flex flex-column">
      <h2 class="card-title text-center">${fields.DogName}</h2>
      <p class="card-text text-center">${fields.Breed}</p>
      <div class="mt-auto d-flex justify-content-center">
        <a href="dog.html?id=${puppy.id}" class="btn btn-primary">Click to learn more about ${fields.DogName}!</a>
      </div>
    </div>
  </div>
`;


    container.appendChild(card);
  });
}

// Load individual profile on dog.html

async function loadPuppyProfile(id) {
  const response = await fetch(`${tableUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${airtableApiKey}`,
    },
  });

  const { fields } = await response.json();

  // Fill text content
  document.getElementById("DogName").textContent = fields.DogName;
  document.getElementById("Age").textContent = `Age: ${fields.Age}`;
  document.getElementById("Breed").textContent = `Breed: ${fields.Breed}`;
  document.getElementById("PupBio").textContent = fields.PupBio;
  document.getElementById("Owner").textContent = `Owner: ${fields.OwnerName}`;

  // Build carousel
  const carouselContainer = document.getElementById("carouselContainer");
  const carouselId = "puppyCarousel";
  const indicators = fields.PupImage.map(
    (_, i) => `
    <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${i}" ${
      i === 0 ? 'class="active"' : ""
    } aria-current="true" aria-label="Slide ${i + 1}"></button>
  `
  ).join("");

  const images = fields.PupImage.map(
    (img, i) => `
    <div class="carousel-item ${i === 0 ? "active" : ""}">
      <img src="${img.url}" class="d-block w-100" alt="Puppy image ${i + 1}">
    </div>
  `
  ).join("");

  carouselContainer.innerHTML = `
    <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">${indicators}</div>
      <div class="carousel-inner">${images}</div>
      <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `;
}
// Build navbar with puppy names and links

async function buildNavbar() {
  const navContainer = document.getElementById("puppyNavLinks");
  if (!navContainer) return;

  const puppies = await fetchPuppies();

  // Create dropdown wrapper
  const dropdownLi = document.createElement("li");
  dropdownLi.className = "nav-item dropdown";

  dropdownLi.innerHTML = `
    <a class="nav-link dropdown-toggle text-white" href="#" id="puppyDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      Puppies
    </a>
    <ul class="dropdown-menu" aria-labelledby="puppyDropdown" id="puppyDropdownMenu">
    </ul>
  `;

  navContainer.appendChild(dropdownLi);

  const dropdownMenu = dropdownLi.querySelector("#puppyDropdownMenu");

  puppies.forEach((puppy) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a class="dropdown-item" href="dog.html?id=${puppy.id}">
        ${puppy.fields.DogName}
      </a>
    `;
    dropdownMenu.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  buildNavbar();
});
