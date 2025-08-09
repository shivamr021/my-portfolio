# Shivam Rathod — Portfolio

A personal, single‑page-per-section portfolio site built with plain HTML, Bootstrap utilities, and a little JavaScript.

## Tech Stack
- HTML5 templates per page
- Bootstrap 4 utilities (via CDN)
- jQuery (for Bootstrap bundle)
- Font Awesome icons
- Google Fonts (Poppins)
- Typed.js for the hero text animation

## Project Structure (top‑level)
- `index.html` — Home
- `about.html` — About
- `skills.html` — Skills
- `projects.html` — Projects
- `certifications.html` — Certifications
- `contact.html` — Contact
- `assets/` — shared images, certificates, CSS
  - `assets/css/style.css`
  - `assets/images/*`
  - `assets/certificates/*`

## Sections (what each page contains)

### Home (`index.html`)
- Fixed navbar linking to all pages
- Hero with profile image, animated role text (Typed.js), social links
- Primary CTAs to About and Projects
- Global footer

### About (`about.html`)
- Intro with profile
- Quick info cards (e.g., Developer / Writer / Learner)
- Timeline: Who Am I, My Journey, What I Do
- Interests & Hobbies tag list
- Stats (Projects, DSA, Certifications)

### Skills (`skills.html`)
- Clickable tab headings that show one category at a time
  - Programming & Web
  - AIML & Data
  - Platforms & Tools
- Each category shows icon tiles for the skills

### Projects (`projects.html`)
- Featured projects presented as highlight rows, each with:
  - Title + short bullet points
  - Tech tags
  - One clear action (GitHub or Try it)
- Currently highlighted:
  - KrishiMitra AI — Try it
  - AI Agent Suite — GitHub
  - DjangoCart — Try it
  - Automotive Data Analysis — GitHub

### Certifications (`certifications.html`)
- Grid of certificate cards (two per row on desktop)
- Each card: clickable image (opens verification) + brief description
- Includes items like AI Essentials, Google Cloud Computing & Gen AI, IBM SkillsBuild Data Fundamentals, Foundations of Cybersecurity, Play It Safe, Computer & OS Security

### Contact (`contact.html`)
- Compact 4‑card contact grid with links
- Currently includes: Codolio, LinkedIn, GitHub, Email

## Running Locally
Open `index.html` directly in a browser, or serve the folder with any static server, for example:

```bash
# Python 3
python -m http.server 8080
# then visit http://localhost:8080
```

## Customization
- Update social/profile links in `index.html` and `contact.html`
- Edit the animated roles in `index.html` (Typed.js strings array)
- Swap images in `assets/images/` and certificate images in `assets/certificates/`
- Favicon is referenced in each page head as `assets/images/Contorted lines.png` (replace file or path as needed)

## Deploying
This is a static site. Host on GitHub Pages, Vercel, Netlify, or any static host.

## Acknowledgments
- Bootstrap, Font Awesome, Google Fonts
- Typed.js for the hero text animation

