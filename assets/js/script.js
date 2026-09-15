const $ = (id) => document.getElementById(id);
const qs = (selector) => document.querySelector(selector);

const themeToggle = $("themeToggle");
const themebtn = $("theme-btn");
const sidebar = $("sidebar");
const overlay = $("overlay");
const hambtn = $("hamburger");
const closebtn = $("close-btn");

const pages = {
    home: $("home-page"),
    about: $("about-page"),
    contact: $("cont-page"),
    repo: $("repo-page"),
};

const navItems = {
    home: qs(".home"),
    about: qs(".about"),
    contact: qs(".contact"),
    repo: qs(".repo"),
};

/* Hide all pages initially */
Object.values(pages).forEach((page) => {
    page.style.display = "none";
});

function showPage(page) {
    Object.values(pages).forEach((item) => {
        item.style.display = item === pages[page] ? "flex" : "none";
    });

    Object.entries(navItems).forEach(([name, item]) => {
        item.classList.toggle("active", name === page);
    });

    closeSidebar();
}

function home() {
    showPage("home");
}

function about() {
    showPage("about");
}

function contact() {
    showPage("contact");
}

function repo() {
    showPage("repo");
}

function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.style.opacity = "0";
}

function changeTheme() {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    localStorage.setItem("lastThemeDark", isDark);

    closebtn.children[0].setAttribute("stroke", isDark ? "#ffffff" : "#000000");

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme",
    );

    themeToggle.setAttribute(
        "title",
        isDark ? "Switch to light theme" : "Switch to dark theme",
    );
}

function loadTheme() {
    const savedTheme = localStorage.getItem("lastThemeDark");

    if (savedTheme === "true") {
        document.body.classList.add("dark");
    } else if (savedTheme === "false") {
        document.body.classList.remove("dark");
    }

    const isDark = document.body.classList.contains("dark");

    closebtn.children[0].setAttribute("stroke", isDark ? "#ffffff" : "#000000");

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme",
    );

    themeToggle.setAttribute(
        "title",
        isDark ? "Switch to light theme" : "Switch to dark theme",
    );
}

themeToggle.addEventListener("click", changeTheme);
themebtn.addEventListener("click", changeTheme);

hambtn.addEventListener("click", () => {
    sidebar.classList.add("open");
    overlay.style.opacity = "1";
});

closebtn.addEventListener("click", closeSidebar);

loadTheme();

/* Show Home page after everything is initialized */
showPage("home");

const aboutTyping = document.getElementById("aboutTyping");
const skillsGrid = document.getElementById("skillsGrid");

const aboutRoles = [
    "Web Developer",
    "Ethical Hacker",
    "Python Programmer",
    "JavaScript Developer",
    "Node & React Developer"
];

const skills = [
    ["HTML", "HTML"],
    ["CSS", "CSS"],
    ["JS", "JavaScript"],
    ["C", "C"],
    ["PY", "Python"],
    ["BASH", "Bash"],
    ["RE", "React"],
    ["NODE", "Node.js"],
    ["WEB", "Web Development"],
    ["SEC", "Ethical Hacking"],
];

skillsGrid.innerHTML = skills
    .map(
        ([icon, name]) => `
    <div class="skill-item">
        <span class="skill-icon">${icon}</span>
        <span>${name}</span>
    </div>
`,
    )
    .join("");

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeAboutRole() {
    const role = aboutRoles[roleIndex];

    if (!deleting) {
        aboutTyping.textContent = role.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === role.length) {
            deleting = true;
            setTimeout(typeAboutRole, 1500);
            return;
        }

        setTimeout(typeAboutRole, 70);
        return;
    }

    aboutTyping.textContent = role.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % aboutRoles.length;
        setTimeout(typeAboutRole, 350);
        return;
    }

    setTimeout(typeAboutRole, 40);
}

typeAboutRole();

const repositoryGrid = document.getElementById("repositoryGrid");

const githubUsername = "mtech-codes";

const svgStyle = document.createElement("style");

svgStyle.textContent = `
    .repository-icon svg {
        width: 21px;
        height: 21px;
        display: block;
    }

    .repository-link svg {
        width: 16px;
        height: 16px;
        display: block;
    }

    .repository-stat svg {
        width: 14px;
        height: 14px;
        display: block;
        flex-shrink: 0;
    }
`;

document.head.appendChild(svgStyle);

async function fetchRepositories() {
    repositoryGrid.innerHTML = `
        <div class="repository-message">
            Loading repositories...
        </div>
    `;

    try {
        const response = await fetch(
            `https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc&per_page=100`,
        );

        if (!response.ok) {
            throw new Error("GitHub API request failed");
        }

        const repositories = await response.json();

        const originalRepositories = repositories.filter((repo) => !repo.fork);

        renderRepositories(originalRepositories);
    } catch (error) {
        repositoryGrid.innerHTML = `
            <div class="repository-message">
                Unable to load repositories.
            </div>
        `;

        console.error(error);
    }
}

function createRepositoryCard(repo) {
    const topics = repo.topics
        .map(
            (topic) => `
            <span class="repository-topic">
                #${topic}
            </span>
        `,
        )
        .join("");

    const createdDate = new Date(repo.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const updatedDate = new Date(repo.updated_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const card = document.createElement("article");

    card.className = "repository-card";
    card.tabIndex = 0;

    card.addEventListener("click", (event) => {
        if (!event.target.closest(".repository-link")) {
            window.open(repo.html_url, "_blank");
        }
    });

    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            window.open(repo.html_url, "_blank");
        }
    });

    card.innerHTML = `
        <div class="repository-top">

            <div class="repository-icon">
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        fill="currentColor"
                        d="M12 .5A11.5 11.5 0 0 0 8.37 23c.58.1.79-.25.79-.56v-2.17c-3.22.7-3.9-1.37-3.9-1.37-.53-1.35-1.3-1.71-1.3-1.71-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.57-.29-5.27-1.29-5.27-5.74 0-1.27.46-2.3 1.2-3.11-.12-.3-.52-1.48.11-3.08 0 0 .98-.31 3.17 1.19a11 11 0 0 1 5.76 0c2.19-1.5 3.17-1.19 3.17-1.19.63 1.6.23 2.78.11 3.08.75.81 1.2 1.84 1.2 3.11 0 4.46-2.71 5.45-5.29 5.73.41.36.78 1.07.78 2.16v3.19c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
                    />
                </svg>
            </div>

            <a
                class="repository-link"
                href="${repo.html_url}"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open ${repo.name}"
            >
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14 5h5v5M19 5l-8 8M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"
                    />
                </svg>
            </a>

        </div>

        <h2 class="repository-name">
            ${repo.name}
        </h2>

        <p class="repository-description">
            ${repo.description || "No description available."}
        </p>

        <div class="repository-topics">
            ${topics || `<span class="repository-topic">No topics</span>`}
        </div>

        <div class="repository-stats">

            <span class="repository-stat">

                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linejoin="round"
                        d="m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.92 1.06-6.2L3 9.53l6.22-.9L12 3Z"
                    />
                </svg>

                ${repo.stargazers_count}

            </span>

            <span class="repository-stat">

                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8 7v10M16 7v10M8 9H6a3 3 0 0 0 0 6h2M16 9h2a3 3 0 0 1 0 6h-2"
                    />
                </svg>

                ${repo.forks_count}

            </span>

            <span class="repository-stat">

                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                    />

                    <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                    />
                </svg>

                ${repo.watchers_count}

            </span>

        </div>

        <div class="repository-bottom">

            <div class="repository-dates">

                <span class="repository-date">
                    Created:
                    <strong>${createdDate}</strong>
                </span>

                <span class="repository-date">
                    Updated:
                    <strong>${updatedDate}</strong>
                </span>

            </div>

            <div class="repository-language">

                <span class="language-dot"></span>

                ${repo.language || "Other"}

            </div>

        </div>
    `;

    return card;
}

function renderRepositories(repositories) {
    repositoryGrid.innerHTML = "";

    if (!repositories.length) {
        repositoryGrid.innerHTML = `
            <div class="repository-message">
                No repositories found.
            </div>
        `;

        return;
    }

    repositories.forEach((repo) => {
        repositoryGrid.appendChild(createRepositoryCard(repo));
    });
}

fetchRepositories();

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const button = contactForm.querySelector(".contact-send");
        const buttonText = button.querySelector("span");
        const oldText = buttonText.textContent;

        button.disabled = true;
        buttonText.textContent = "Sending...";

        try {
            const response = await fetch(
                "https://api.web3forms.com/submit",
                {
                    method: "POST",
                    body: new FormData(contactForm)
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to send message."
                );
            }

            contactForm.reset();
            buttonText.textContent = "Message Sent!";

            setTimeout(() => {
                buttonText.textContent = oldText;
                button.disabled = false;
            }, 2500);

        } catch (error) {
            console.error(error);

            buttonText.textContent = "Failed to Send";

            setTimeout(() => {
                buttonText.textContent = oldText;
                button.disabled = false;
            }, 2500);
        }
    });
}
