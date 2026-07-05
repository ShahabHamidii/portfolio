# Shahab Hamidi — Portfolio Website

A single-page portfolio site built with Django — dark/light mode, an interactive
particle-network hero, a custom cursor, and a contact form backed by a real
database.

**Live:** _add your deployed URL here once it's live_

---

## Features

- 🌓 **Dark / light theme toggle** — persisted in `localStorage`, respects the visitor's system preference on first visit
- 🕸️ **Interactive hero background** — a canvas particle network that links to nearby dots *and* to the cursor itself
- 🖱️ **Custom cursor** — a small diamond marker that turns into a text caret over paragraphs and a soft ring over clickable elements
- ⌨️ **Typewriter subtitle** — rotates through a few short lines about what I do
- 📊 **Skills section** — tabbed categories with progress bars that animate in every time they scroll into view
- 📄 **Resume download** — serves the PDF directly from static files
- ✉️ **Working contact form** — validated server-side and saved to the database (viewable from the Django admin), not just a `mailto:` link
- 📱 Fully responsive, with reduced-motion-friendly fallbacks on touch devices

## Tech stack

| Layer      | Choice                                   |
|------------|-------------------------------------------|
| Backend    | Django 6                                  |
| Database   | PostgreSQL (SQLite for local dev)          |
| Static     | WhiteNoise (compressed, hashed filenames)  |
| Server     | Gunicorn                                   |
| Frontend   | Vanilla HTML / CSS / JS — no framework, no build step |
| Fonts      | JetBrains Mono, Inter, Source Code Pro     |

No React, no bundler — every animation (the canvas network, the typewriter, the
scroll-reveal, the theme toggle) is plain JavaScript, on purpose.

## Project structure

```
portfolio_project/
├── manage.py
├── requirements.txt
├── Procfile                     # gunicorn start command for deployment
├── portfolio_site/              # Django project (settings, urls, wsgi)
└── main/                        # the one app powering the whole site
    ├── views.py                 # all page content lives in one context dict
    ├── models.py                # ContactMessage model
    ├── admin.py
    ├── templates/main/index.html
    └── static/main/
        ├── css/style.css
        ├── js/script.js
        └── files/Shahab_Hamidi_Resume.pdf
```

## Getting started

```bash
git clone https://github.com/ShahabHamidii/<this-repo>.git
cd portfolio_project
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # then fill in the values below
python manage.py migrate
python manage.py createsuperuser # optional, lets you view contact messages at /admin
python manage.py runserver
```

Visit `http://127.0.0.1:8000`.

## Environment variables

| Variable               | Example                             | Notes                                 |
|--------------------------|---------------------------------------|------------------------------------------|
| `DJANGO_DEBUG`          | `True` / `False`                     | Always `False` in production            |
| `DJANGO_SECRET_KEY`     | `django-insecure-...`                | Generate a real one for production      |
| `ALLOWED_HOSTS`         | `yourdomain.com,www.yourdomain.com`  | Comma-separated, no spaces              |
| `CSRF_TRUSTED_ORIGINS`  | `https://yourdomain.com`             | Required behind HTTPS reverse proxies   |
| `DB_NAME`               | `portfolio`                          | Postgres database name                  |
| `DB_USER`               | `portfolio_user`                     | Postgres user                           |
| `DB_PASSWORD`           | `••••••••`                           | Postgres password                       |
| `DB_HOST`               | `localhost`                          | Postgres host                           |
| `DB_PORT`               | `5432`                               | Postgres port                           |

## Deployment

The repo ships with a `Procfile` and WhiteNoise for static files, so it's ready
for any platform that runs a `Procfile` (Render, Railway) or a plain VPS with
Gunicorn behind Nginx. Typical build/start commands:

```bash
# build
pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput

# start
gunicorn portfolio_site.wsgi
```

## Contact

- Email: shahabhamidi83@gmail.com
- GitHub: [github.com/ShahabHamidii](https://github.com/ShahabHamidii)
- LinkedIn: [linkedin.com/in/shahabhamidii](https://linkedin.com/in/shahabhamidi)

## License

This is my personal portfolio source code, shared for reference. Feel free to
borrow ideas, but please don't republish it as your own site verbatim.
