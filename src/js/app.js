// Fixar hamburgermenyn
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
  });
});

// Hämtar kursdata från extern JSON-fil och sätter upp sökfunktionen
document.addEventListener("DOMContentLoaded", () => {
  fetchCourses();
  document.getElementById("search").addEventListener("input", filterCourses);
});

// Variabel för att hålla kursdata
let courses = [];

// Objekt för att hålla reda på sorteringsordningen för varje kolumn
let sortOrder = {
  code: "asc",
  coursename: "asc",
  progression: "asc",
};

// Funktion för att hämta JSON-data och rendera tabellen
async function fetchCourses() {
  try {
    const response = await fetch(
      "https://webbutveckling.miun.se/files/ramschema_ht24.json"
    );
    const data = await response.json();
    courses = data;
    renderTable(courses); // Visar datan i tabellen
  } catch (error) {
    console.error("Fel vid hämtning av JSON:", error);
  }
}

// Funktion för att rendera kursdata i tabellen
function renderTable(data) {
  const tableBody = document.getElementById("courseTable");
  tableBody.innerHTML = ""; // Rensar gammalt innehåll

  data.forEach((course) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${course.code}</td>
      <td>${course.coursename}</td>
      <td>${course.progression}</td>
      <td><a href="${course.syllabus}" target="_blank">Kursplan</a></td>
    `;
    tableBody.appendChild(row); // Lägger till raden i tabellen
  });
}

// Funktion för att sortera tabellen baserat på kolumn
function sortTable(column) {
  courses.sort((a, b) => {
    let valA = a[column] || ""; // Hanterar null-värden
    let valB = b[column] || "";

    // Hanterar sortering för progression som kan innehålla siffror
    if (column === "progression") {
      return (valA > valB ? 1 : -1) * (sortOrder[column] === "asc" ? 1 : -1);
    }

    return valA.localeCompare(valB) * (sortOrder[column] === "asc" ? 1 : -1);
  });

  // Växlar sorteringsordning
  sortOrder[column] = sortOrder[column] === "asc" ? "desc" : "asc";

  // Renderar den sorterade tabellen
  renderTable(courses);

  // Uppdaterar sorteringsindikatorer (pilar)
  updateSortingIndicators(column);
}

// Funktion för att uppdatera sorteringspilarna i tabellen
function updateSortingIndicators(column) {
  const headers = document.querySelectorAll("th");
  headers.forEach((header) => {
    header.classList.remove("sorted-asc", "sorted-desc"); // Tar bort gamla pilar
    header.textContent = header.getAttribute("data-column-name"); // Återställer rubriktext
  });

  const header = document.querySelector(`th[data-column="${column}"]`);
  const arrow = sortOrder[column] === "asc" ? "⬆" : "⬇";
  header.textContent = `${header.getAttribute("data-column-name")} ${arrow}`;
  header.classList.add(
    sortOrder[column] === "asc" ? "sorted-asc" : "sorted-desc"
  );
}

// Funktion för att filtrera kurser baserat på sökning
function filterCourses() {
  const query = document.getElementById("search").value.toLowerCase();
  const filteredCourses = courses.filter(
    (course) =>
      course.code.toLowerCase().includes(query) ||
      course.coursename.toLowerCase().includes(query)
  );

  renderTable(filteredCourses); // Visar filtrerade resultat
}

// Gör sorteringsfunktionen globalt tillgänglig för HTML-attribut
window.sortTable = sortTable;
