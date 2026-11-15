<div align="center">

# Rahul Raikwar | Portfolio

**A dark, motion-driven developer portfolio with a live WebGL silk background, smooth scrolling and a custom cursor.**

[**Live Demo**](https://portfolio-pi-indol-70ywxe5882.vercel.app/)

</div>

## Live Site

**https://portfolio-pi-indol-70ywxe5882.vercel.app/**

## About

This is my personal portfolio, built to show who I am, what I can build and how to reach me. I am a full stack developer working with the MERN stack, and the site itself is a showcase of the frontend work I enjoy most: smooth scroll-driven animation, custom interactions and a bit of shader code.

## Sections

| Section | What it does |
| --- | --- |
| **Hero** | Name reveal, rotating role list, quick links (GitHub, LinkedIn, Resume) and a live WebGL silk background that follows the cursor |
| **About** | Short introduction and background |
| **Skills** | Tech stack and tools I work with |
| **Projects** | Pinned "Projects" heading over the silk background that fades out as each project slides in, with hover previews and links |
| **Contact** | Ways to get in touch |

## Highlights

- **WebGL silk background.** A custom GLSL fragment shader renders moving cloth with a light that follows the mouse. It runs at a reduced resolution and pauses when it is off screen or the tab is hidden.
- **Scroll-driven animation.** GSAP and ScrollTrigger handle the hero fade-out, the Projects reveal and the staggered text animations.
- **Smooth scrolling.** Lenis powers inertial scrolling and stays in sync with the GSAP ticker.
- **Scroll squeeze effect.** Sections compress slightly based on scroll speed. It is only active on large screens with a mouse or trackpad, so touch devices keep native scrolling.
- **Custom square cursor.** A small neon square with a smooth motion trail that turns into a hollow diamond over links and buttons. It is disabled on touch devices.
- **Loader.** A centered loader preloads the hero image before the page is revealed.
- **Responsive and accessible.** The layout adapts from phones to large desktops, and animations respect `prefers-reduced-motion`.

## Featured Projects

| Project | Stack | Links |
| --- | --- | --- |
| **E-Commerce** | React, Node.js, MongoDB | [Live](https://reva-ecom.vercel.app/) |
| **Fin Track Pro** | HTML, CSS, JavaScript | [Live](https://fin-track-pro-dun.vercel.app/) |
| **Production Hub** | HTML, CSS, JavaScript | [Live](https://productive-hub-nine.vercel.app/) |

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | React |
| Styling | Tailwind CSS |
| Animation | GSAP, ScrollTrigger |
| Smooth scroll | Lenis |
| Graphics | WebGL, GLSL |
| Icons | Lucide React |
| Hosting | Vercel |

## Project Structure

```
portfolio/
├── public/
│   ├── me2.png
│   ├── og-image.png
│   └── resume.pdf
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── HeroSection.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Contact.jsx
│   │   ├── Loader.jsx
│   │   ├── CustomCursor.jsx
│   │   ├── ScrollSqueeze.jsx
│   │   └── PsychedelicText.jsx
│   └── App.jsx
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Run locally

```bash
git clone https://github.com/Rahulraikwar17/portfolio.git
cd portfolio
npm install
npm run dev
```

Open the local URL printed in the terminal.

### Production build

```bash
npm run build
npm run preview
```

## Customization

- **Projects:** edit the `projects` array at the top of `src/components/Projects.jsx` and add the screenshots to `src/assets/images/`.
- **Name and roles:** change `NAME_LINES`, `ROLES` and `LINKS` at the top of `src/components/HeroSection.jsx`.
- **Resume and photo:** replace `public/resume.pdf` and `public/me2.png`.
- **Social preview:** replace `public/og-image.png` (1200 x 630).
- **Scroll squeeze strength:** adjust `maxCompress` and `fullAt` on `<ScrollSqueeze />` in `src/App.jsx`.

### Color theme

| Color | Hex | Used for |
| --- | --- | --- |
| Jet Black | `#000000` | Page background |
| Muted Moss Green | `#6d8f63` | Secondary text, borders |
| Neon Emerald | `#39ff88` | Accents, hover states, cursor |
| Mint White | `#d6ffe6` | Primary text |

## Deployment

The site is deployed on [Vercel](https://vercel.com/). Every push to the main branch triggers a new deployment.

## Contact

- GitHub: [Rahulraikwar17](https://github.com/Rahulraikwar17)
- LinkedIn: [Rahul Raikwar](https://www.linkedin.com/in/rahul-raikwar-7a9674306/)
- Portfolio: [portfolio-pi-indol-70ywxe5882.vercel.app](https://portfolio-pi-indol-70ywxe5882.vercel.app/)

---

<div align="center">

Designed and built by **Rahul Raikwar**

</div>