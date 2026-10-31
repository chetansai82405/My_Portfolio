
// 1. Mobile Navigation
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );
});

// Close menu after clicking a navigation link
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    });
});


// 2. Scroll Reveal Animation
const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("visible");

                observer.unobserve(entry.target);
            }

        });
    },
    {
        threshold: 0.12
    }
);

// Apply animation to all reveal elements
document.querySelectorAll(".reveal").forEach(element => {
    revealObserver.observe(element);
});


// 3. Active Navigation Highlight
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const activeObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                navLinks.forEach(link => {

                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") ===
                        `#${entry.target.id}`
                    );

                });

            }

        });

    },
    {
        rootMargin: "-35% 0px -55% 0px"
    }
);

// Observe all website sections
sections.forEach(section => {
    activeObserver.observe(section);
});


// 4. Automatically Update Footer Year
document.getElementById("year").textContent =
    new Date().getFullYear();


// ===== Advanced upgrade =====
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(pointer: fine)").matches;

// 5. Scroll progress bar
const bar = document.querySelector(".progress");
addEventListener("scroll", () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
}, { passive: true });

// 6. Typing effect in hero
const typed = document.getElementById("typed");
const words = ["Aspiring Software Developer", "Java Programmer", "Web Builder", "Problem Solver"];
if (!reduce) {
    let w = 0, c = words[0].length, del = true;
    (function tick() {
        const word = words[w];
        typed.textContent = word.slice(0, c);
        if (del) c--; else c++;
        let wait = del ? 45 : 90;
        if (!del && c > word.length) { del = true; wait = 1800; c = word.length; }
        else if (del && c < 0) { del = false; w = (w + 1) % words.length; c = 0; wait = 300; }
        setTimeout(tick, wait);
    })();
}

// 7. Animated stat counters
const countObs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0;
        const t0 = performance.now(), dur = 1400;
        (function step(t) {
            const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (end * eased).toFixed(dec);
            if (p < 1) requestAnimationFrame(step);
        })(t0);
        o.unobserve(el);
    });
}, { threshold: 0.6 });
if (!reduce) document.querySelectorAll("[data-count]").forEach(el => countObs.observe(el));

// 8. Staggered reveal delays
document.querySelectorAll(".skill-card, .project-card, .stat-card, .achievement").forEach((el, i) => {
    el.classList.add("reveal-stagger");
    el.style.setProperty("--d", (i % 4) * 0.08 + "s");
});

// 9. Cursor glow, card spotlight, hero tilt, magnetic buttons
if (fine && !reduce) {
    const glow = document.querySelector(".cursor-glow");
    addEventListener("mousemove", e => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
    });

    document.querySelectorAll(".stat-card, .skill-card, .project-card, .achievement, .contact-panel").forEach(card => {
        card.classList.add("spot");
        card.addEventListener("mousemove", e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty("--mx", e.clientX - r.left + "px");
            card.style.setProperty("--my", e.clientY - r.top + "px");
        });
    });

    const visual = document.querySelector(".hero-visual");
    const hero = document.querySelector(".hero");
    hero.addEventListener("mousemove", e => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        visual.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
    });
    hero.addEventListener("mouseleave", () => visual.style.transform = "");

    document.querySelectorAll(".button, .header-cta").forEach(btn => {
        btn.addEventListener("mousemove", e => {
            const r = btn.getBoundingClientRect();
            btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
        });
        btn.addEventListener("mouseleave", () => btn.style.transform = "");
    });
}

// 10. Particle network background
const canvas = document.getElementById("bg"), ctx = canvas.getContext("2d");
if (!reduce) {
    let W, H, pts = [], mouse = { x: -999, y: -999 };
    const resize = () => {
        W = canvas.width = innerWidth; H = canvas.height = innerHeight;
        pts = Array.from({ length: Math.min(70, Math.floor(W / 20)) }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35
        }));
    };
    resize(); addEventListener("resize", resize);
    addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    (function draw() {
        if (document.hidden) return setTimeout(draw, 500);
        ctx.clearRect(0, 0, W, H);
        pts.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
            ctx.fillStyle = "rgba(45,212,191,.5)";
            ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, 7); ctx.fill();
            for (let j = i + 1; j < pts.length; j++) {
                const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
                if (d < 120) {
                    ctx.strokeStyle = `rgba(110,140,255,${.16 * (1 - d / 120)})`;
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                }
            }
            const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            if (md < 150) {
                ctx.strokeStyle = `rgba(83,197,232,${.3 * (1 - md / 150)})`;
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
            }
        });
        requestAnimationFrame(draw);
    })();
}

// 11. Theme toggle (remembers choice)
const themeBtn = document.querySelector(".theme-toggle");
const setTheme = t => {
    document.documentElement.dataset.theme = t;
    themeBtn.setAttribute("aria-label", t === "light" ? "Switch to dark theme" : "Switch to light theme");
    document.querySelector('meta[name="theme-color"]').content = t === "light" ? "#effaf8" : "#07131f";
    try { localStorage.setItem("theme", t); } catch (e) {}
};
try { if (localStorage.getItem("theme") === "light") setTheme("light"); } catch (e) {}
themeBtn.addEventListener("click", () =>
    setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light"));

// 12. Contact form validation (opens your email app with the message filled in)
const form = document.getElementById("contactForm");
form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll("input, textarea").forEach(f => {
        const err = f.parentElement.querySelector(".err");
        let msg = "";
        if (!f.value.trim()) msg = "This field is required.";
        else if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) msg = "Enter a valid email address.";
        else if (f.name === "message" && f.value.trim().length < 10) msg = "Write at least 10 characters.";
        err.textContent = msg;
        f.classList.toggle("invalid", !!msg);
        if (msg) ok = false;
    });
    if (!ok) return;
    const d = new FormData(form);
    const body = `${d.get("message")}\n\n— ${d.get("name")} (${d.get("email")})`;
    location.href = `mailto:chetansaibayya78@gmail.com?subject=${encodeURIComponent("Portfolio message from " + d.get("name"))}&body=${encodeURIComponent(body)}`;
    form.querySelector(".form-status").textContent = "Opening your email app. Press send to deliver the message.";
    form.reset();
});


// 13. Escape closes the mobile menu
addEventListener("keydown", e => {
    if (e.key === "Escape") { nav.classList.remove("open"); menuButton.setAttribute("aria-expanded", "false"); }
});


// ===== Aurora upgrade: ring cursor, tilt, skill filters, command menu =====
// 14. Ring cursor that grows over links and buttons
if (fine && !reduce) {
    const ring = document.createElement("div");
    ring.className = "cur-ring";
    document.body.appendChild(ring);
    let rx = 0, ry = 0, tx = 0, ty = 0;
    addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; });
    (function follow() {
        rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
        ring.style.left = rx + "px"; ring.style.top = ry + "px";
        requestAnimationFrame(follow);
    })();
    document.addEventListener("mouseover", e =>
        ring.classList.toggle("hover", !!e.target.closest("a, button, .project-card, .skill-card, input, textarea")));

    // 3D tilt on cards
    document.querySelectorAll(".project-card, .skill-card, .stat-card").forEach(card => {
        card.classList.add("tilt");
        card.addEventListener("mousemove", e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `perspective(700px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-4px)`;
        });
        card.addEventListener("mouseleave", () => card.style.transform = "");
    });
}

// 15. Skill category filter
const cats = { "Programming": "Languages", "Web technologies": "Web", "Database & tools": "Tools", "Core concepts": "Concepts" };
const skillCards = document.querySelectorAll(".skill-card");
skillCards.forEach(c => c.dataset.cat = cats[c.querySelector("h3").textContent.trim()] || "");
const filters = document.createElement("div");
filters.className = "skill-filters";
["All", ...new Set(Object.values(cats))].forEach((name, i) => {
    const b = document.createElement("button");
    b.textContent = name; b.className = i ? "" : "on";
    b.addEventListener("click", () => {
        filters.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b));
        skillCards.forEach(c => c.classList.toggle("dim", name !== "All" && c.dataset.cat !== name));
    });
    filters.appendChild(b);
});
document.querySelector(".skill-groups").before(filters);

// 16. Command menu (Ctrl/Cmd + K)
const cmd = document.createElement("div");
cmd.className = "cmd";
cmd.innerHTML = '<div class="cmd-box" role="dialog" aria-label="Quick menu"><input placeholder="Jump to a section or run an action..." aria-label="Search commands"><ul></ul></div>';
document.body.appendChild(cmd);
const cmdInput = cmd.querySelector("input"), cmdList = cmd.querySelector("ul");
const go = id => () => document.getElementById(id).scrollIntoView({ behavior: "smooth" });
const open = url => () => window.open(url, "_blank", "noopener");
const actions = [
    ["Go to Home", "Section", go("home")], ["Go to About", "Section", go("about")],
    ["Go to Skills", "Section", go("skills")], ["Go to Projects", "Section", go("projects")],
    ["Go to Education", "Section", go("education")], ["Go to Contact", "Section", go("contact")],
    ["Switch theme", "Action", () => themeBtn.click()],
    ["Download CV", "Action", () => { location.href = "assets/Chetan-Sai-Bayya-Resume.pdf"; }],
    ["Send an email", "Action", () => { location.href = "mailto:chetansaibayya78@gmail.com"; }],
    ["Open GitHub", "Link", open("https://github.com/chetansai82405")],
    ["Open LinkedIn", "Link", open("https://www.linkedin.com/in/chetansaibayya78/")],
    ["Open LeetCode", "Link", open("https://leetcode.com/u/chetansaibayya/")]
];
let shown = [], sel = 0;
const render = () => {
    const q = cmdInput.value.toLowerCase().trim();
    shown = actions.filter(a => a[0].toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(shown.length - 1, 0));
    cmdList.innerHTML = shown.length ? "" : '<div class="cmd-empty">No match. Try "projects" or "email".</div>';
    shown.forEach((a, i) => {
        const li = document.createElement("li");
        li.className = i === sel ? "sel" : "";
        li.innerHTML = `<span>${a[0]}</span><small>${a[1]}</small>`;
        li.addEventListener("click", () => run(i));
        li.addEventListener("mousemove", () => { sel = i; render(); });
        cmdList.appendChild(li);
    });
};
const toggleCmd = on => {
    cmd.classList.toggle("open", on);
    if (on) { cmdInput.value = ""; sel = 0; render(); cmdInput.focus(); }
};
const run = i => { const a = shown[i]; if (a) { toggleCmd(false); a[2](); } };
cmdInput.addEventListener("input", () => { sel = 0; render(); });
cmd.addEventListener("click", e => { if (e.target === cmd) toggleCmd(false); });
document.querySelector(".cmd-btn").addEventListener("click", () => toggleCmd(true));
addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); toggleCmd(!cmd.classList.contains("open")); }
    if (!cmd.classList.contains("open")) return;
    if (e.key === "Escape") toggleCmd(false);
    if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % shown.length; render(); }
    if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + shown.length) % shown.length; render(); }
    if (e.key === "Enter") run(sel);
});
