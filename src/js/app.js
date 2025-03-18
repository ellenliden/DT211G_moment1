//Fixar hamburgermenyn

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  fetchCourses();
  document.getElementById("search").addEventListener("input", filterCourses);
});

let courses = [];
let sortOrder = {
  code: "asc",
  coursename: "asc",
  progression: "asc",
};

async function fetchCourses() {
  try {
    const response = await fetch(
      "https://webbutveckling.miun.se/files/ramschema_ht24.json"
    );
    const data = await response.json();
    courses = data; // Direkt tilldela arrayen
    renderTable(courses);
  } catch (error) {
    console.error("Fel vid hämtning av JSON:", error);
  }
}

function renderTable(data) {
  const tableBody = document.getElementById("courseTable");
  tableBody.innerHTML = "";

  data.forEach((course) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${course.code}</td>
          <td>${course.coursename}</td>
          <td>${course.progression}</td>
          <td><a href="${course.syllabus}" target="_blank">Kursplan</a></td>
      `;
    tableBody.appendChild(row);
  });
}

function sortTable(column) {
  courses.sort((a, b) => {
    if (a[column] < b[column]) return sortOrder[column] === "asc" ? -1 : 1;
    if (a[column] > b[column]) return sortOrder[column] === "asc" ? 1 : -1;
    return 0;
  });

  sortOrder[column] = sortOrder[column] === "asc" ? "desc" : "asc";
  renderTable(courses);
}

function filterCourses() {
  const query = document.getElementById("search").value.toLowerCase();
  const filteredCourses = courses.filter(
    (course) =>
      course.code.toLowerCase().includes(query) ||
      course.coursename.toLowerCase().includes(query)
  );

  renderTable(filteredCourses);
}
