# EmpaAva Project Page

This repository contains the GitHub Pages project homepage for:

**EmpaAva: An Open-source Agentic 3D-Avatar Empathetic Live Chatbot**

The page is a static academic project site for an EMNLP/ACL-style demo paper. It
does not run an online inference backend and does not require a database or
server-side code.

## Structure

```text
.
|-- index.html
|-- static/
|   |-- css/
|   |   `-- style.css
|   |-- js/
|   |   `-- main.js
|   |-- images/
|   `-- videos/
`-- README.md
```

Expected media paths:

```text
static/images/teaser.png
static/images/workflow.png
static/images/avatar_gallery.png
static/images/interface_walkthrough.png
static/images/case_study.png
static/videos/demo_booth.mp4
static/videos/demo_case1.mp4
static/videos/demo_case2.mp4
```

## Local Preview

Open `index.html` directly in a browser, or run a tiny static server:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000/
```

## GitHub Pages Deployment

1. Push this repository to `https://github.com/1114531938/EmpaAva`.
2. Open the repository on GitHub.
3. Go to `Settings` -> `Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Select branch `main` and folder `/ (root)`.
6. Save the settings.

After deployment, the page should be available at:

```text
https://1114531938.github.io/EmpaAva/
```

## Related Code

The system implementation is hosted at:

```text
https://github.com/1114531938/EmpaAva_System
```
