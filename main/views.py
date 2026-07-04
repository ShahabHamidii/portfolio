from django.shortcuts import render, redirect
from django.contrib import messages
from django.templatetags.static import static
from django.db import DatabaseError
from .models import ContactMessage


def index(request):
    if request.method == "POST":
        name = request.POST.get("name", "").strip()
        email = request.POST.get("email", "").strip()
        message_text = request.POST.get("message", "").strip()

        if name and email and message_text:
            try:
                ContactMessage.objects.create(name=name, email=email, message=message_text)
                messages.success(request, "Message sent — thanks! I'll get back to you soon.")
            except DatabaseError:
                messages.error(
                    request,
                    "The database isn't set up yet. Run `python manage.py migrate` and try again.",
                )
        else:
            messages.error(request, "Please fill in every field before sending.")
        return redirect("/#contact")

    context = {
        "resume_url": static("main/files/Shahab_Hamidi_Resume.pdf"),
        "name": "Shahab Hamidi",
        "role": "Backend Developer",
        "location": "Tehran, Iran",
        "phone": "+98 919-414-2393",
        "email": "shahabhamidi83@gmail.com",
        "github": "github.com/ShahabHamidii",
        "linkedin": "linkedin.com/in/shahabhamidii",
        "typewriter_lines": [
            "Building Scalable Backend Applications",
            "RESTful API Developer",
            "Clean Architecture Enthusiast",
            "Python · Django · PostgreSQL · Docker",
        ],
        "summary": (
            "Backend developer focused on Python, Django and building secure, well-modeled REST APIs."
        ),
        "summary_paragraphs": [
            "I'm a backend developer who likes the part most people skip — the data model, the edge cases, what happens when something goes wrong at 2am.",
            "Right now I'm building backend systems at IPCO and studying Software Engineering at Kharazmi University, but most of what I actually know came from taking projects apart and rebuilding them until they held up: a multi-vendor marketplace, a JWT-secured REST API, a database designed from scratch.",
            "Security is a default for me, not a patch — OWASP, hashing, clean permissions — and I try to write code a teammate can still read six months later. I'm early in my career, and I like it that way: I ask questions, I ship, and I improve fast.",
        ],
        "interests": [
            "Back-End Development", "Cyber Security", "Open Source",
            "Problem Solving", "Linux",
        ],
        "skill_groups": [
            {
                "id": "backend",
                "label": "Backend",
                "skills": [
                    {"name": "Python", "level": 90},
                    {"name": "Django", "level": 85},
                    {"name": "Django REST Framework", "level": 85},
                    {"name": "REST APIs", "level": 85},
                    {"name": "Java", "level": 50},
                ],
            },
            {
                "id": "databases",
                "label": "Databases",
                "skills": [
                    {"name": "PostgreSQL", "level": 80},
                    {"name": "MySQL", "level": 75},
                    {"name": "SQLite", "level": 70},
                ],
            },
            {
                "id": "devops",
                "label": "DevOps",
                "skills": [
                    {"name": "Docker", "level": 70},
                    {"name": "Linux", "level": 75},
                    {"name": "Git", "level": 80},
                    {"name": "CI/CD", "level": 55},
                    {"name": "Kubernetes", "level": 40},
                ],
            },
            {
                "id": "concepts",
                "label": "Other Skills",
                "skills": [
                    {"name": "Redis", "level": 55},
                    {"name": "Celery", "level": 55},
                    {"name": "System Design", "level": 60},
                    {"name": "Design Patterns", "level": 60},
                    {"name": "SOLID / Clean Architecture", "level": 65},
                ],
            },
        ],
        "job": {
            "title": "Backend Developer — IPCO",
            "period": "Current",
            "bullets": [
                "Developing scalable backend applications",
                "Building secure RESTful APIs",
                "Database modeling & optimization",
                "Dockerized development workflow",
                "Git-based collaboration workflow",
                "Applying SOLID principles & clean architecture",
            ],
        },
        "experience": [
            {
                "title": "Multi Vendor Marketplace",
                "period": "Personal Project",
                "repo": "",
                "stack": "Python, Django (MVT), Django ORM, Docker, MySQL, HTML/CSS/JS",
                "features": [
                    "Multi-vendor architecture with independent storefronts for each vendor",
                    "Product management: CRUD, categories, inventory, images",
                    "Session-based cart & checkout with order generation and invoicing",
                    "Role-based authentication for Customer / Vendor / Admin",
                    "Vendor dashboard to manage products, orders and inventory",
                    "Sales analytics and performance reports",
                ],
                "challenges": [
                    "Isolating vendor data so each vendor only sees their own records",
                    "Modeling database relationships for multi-vendor support",
                    "Handling a session-based cart across multiple vendors at once",
                    "Building a role-based permission system with Django groups",
                ],
            }
        ],
        "projects": [
            {
                "name": "Ads REST API",
                "stack": "Django, DRF, JWT, Swagger",
                "tags": ["CRUD", "Filtering", "Pagination", "Permissions", "OpenAPI"],
                "repo": "https://github.com/ShahabHamidii/Django-REST-Framework-Ads-API",
            },
            {
                "name": "FlowTeam",
                "stack": "Django, Bootstrap",
                "tags": ["Responsive", "Landing Page", "SEO"],
                "repo": "https://github.com/ShahabHamidii/FlowTeam",
            },
            {
                "name": "DataBaseProject",
                "stack": "SQL, Database Design",
                "tags": ["Schema Design", "Normalization", "Queries"],
                "repo": "https://github.com/ShahabHamidii/DataBaseProject",
            },
        ],
        "certifications": [
            "Python Programming — Matabkhoneh",
            "Django Framework — CodeYad",
            "Task-Oriented Course in Security — Quera",
        ],
        "education": [
            {
                "degree": "Bachelor of Software Engineering",
                "school": "Kharazmi University of Tehran",
                "period": "Sep 2023 – Present",
            },
            {
                "degree": "Exceptional Talent Program",
                "school": "National Organization for Development of Exceptional Talents (NODET)",
                "period": "",
            },
        ],
    }
    return render(request, "main/index.html", context)
