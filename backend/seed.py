from models import Experience, Kpi, ProcessStep, Profile, Project, Skill, SocialLink, SeoMeta, Tool, TypographyItem
from repository import experiences_repo, profile_repo, projects_repo, skills_repo, tools_repo

U = "https://images.unsplash.com/"

PROFILE = Profile(
    name="Raka Adinata",
    role="UI/UX Designer",
    hero_subtitle="Merancang pengalaman digital yang jernih, hangat, dan berkelas — dari riset sampai desain sistem yang siap dibangun.",
    experience_start=2021,
    experience_end="Present",
    bio="Halo! Saya UI/UX Designer yang senang menerjemahkan kebutuhan bisnis menjadi antarmuka yang sederhana dan menyenangkan. Berpengalaman menangani produk e-commerce, layanan rumah tangga, dan F&B — dari riset pengguna, wireframe, prototyping, hingga design system dan handoff ke developer.",
    photo_url=f"{U}photo-1681164315669-e351ae412094?w=900&q=80",
    email="hello@rakaadinata.design",
    phone="+62 812-3456-7890",
    location="Bandung, Indonesia",
    social_links=[
        SocialLink(label="Behance", url="https://behance.net"),
        SocialLink(label="Dribbble", url="https://dribbble.com"),
        SocialLink(label="LinkedIn", url="https://linkedin.com"),
        SocialLink(label="Instagram", url="https://instagram.com"),
    ],
    seo=SeoMeta(
        title="Raka Adinata — UI/UX Designer Portfolio",
        description="Portfolio UI/UX Designer: selected projects, case studies, skills, and experience.",
        og_image=f"{U}photo-1558655146-6c222b05fce4?w=1200&q=80",
    ),
)

SKILLS = [
    ("User Research", "hard"), ("Wireframing", "hard"), ("Prototyping", "hard"), ("Design System", "hard"),
    ("Usability Testing", "hard"), ("Interaction Design", "hard"), ("Visual Design", "hard"),
    ("Empathy", "soft"), ("Communication", "soft"), ("Collaboration", "soft"), ("Problem Solving", "soft"),
    ("Time Management", "soft"), ("Adaptability", "soft"),
]

TOOLS = ["Figma", "CorelDRAW", "After Effects", "Blender", "Notion", "Maze"]

EXPERIENCES = [
    Experience(position="UI/UX Designer", company="Lumina Digital Studio", start="2023", end="Present",
               description="Memimpin desain produk e-commerce & layanan on-demand, membangun design system dan riset pengguna berkelanjutan."),
    Experience(position="Product Designer", company="Kopi Kita Group", start="2022", end="2023",
               description="Mendesain aplikasi loyalitas & pemesanan F&B, meningkatkan konversi order 28% melalui redesign checkout."),
    Experience(position="Junior UI Designer", company="Freelance", start="2021", end="2022",
               description="Mengerjakan landing page, brand visual, dan mobile UI untuk UMKM dan startup tahap awal."),
]

PROJECTS = [
    Project(
        title="Toko Rasa — E-Commerce App", slug="toko-rasa-ecommerce", category="E-Commerce", year="2024",
        cover_url=f"{U}photo-1558655146-6c222b05fce4?w=1400&q=80",
        overview="Redesign aplikasi belanja UMKM dengan fokus pada discovery produk yang cepat, checkout ringkas, dan rasa percaya melalui ulasan yang transparan.",
        problem="Pengguna kesulitan menemukan produk (rata-rata 48 detik) dan 61% meninggalkan keranjang di langkah pembayaran karena form terlalu panjang dan tidak ada indikator progres.",
        goal="Memangkas waktu discovery di bawah 20 detik, menyederhanakan checkout menjadi maksimal 3 langkah, dan meningkatkan kepercayaan lewat ulasan terverifikasi.",
        process=[
            ProcessStep(title="Research", description="8 wawancara pengguna, analisis funnel, dan competitive audit 5 aplikasi belanja lokal."),
            ProcessStep(title="Define", description="Menyusun persona, journey map, dan memetakan 3 pain point prioritas."),
            ProcessStep(title="Design", description="Wireframe lo-fi → hi-fi di Figma, membangun design system komponen."),
            ProcessStep(title="Test & Iterate", description="Usability test 2 putaran dengan 10 partisipan via Maze, iterasi checkout dan filter."),
        ],
        kpis=[Kpi(value="+31%", label="Checkout completion"), Kpi(value="19s", label="Waktu menemukan produk"), Kpi(value="4.7/5", label="Skor kepuasan"), Kpi(value="-38%", label="Cart abandonment")],
        role="Lead Product Designer — research, UX flow, UI, prototyping, handoff.",
        tools=["Figma", "Maze", "After Effects"],
        color_palette=["#FFDADC", "#E62129", "#731014", "#111827", "#F9FAFB"],
        typography=[TypographyItem(name="Roboto", usage="Heading & UI"), TypographyItem(name="Inter", usage="Body text")],
        gallery=[f"{U}photo-1512941937669-90a1b58e7e9c?w=1200&q=80", f"{U}photo-1551288049-bebda4e38f71?w=1200&q=80", f"{U}photo-1460925895917-afdab827c52f?w=1200&q=80"],
        link="https://behance.net", outcome="Checkout completion naik 31%, waktu menemukan produk turun dari 48s ke 19s pada usability test.",
        featured=True, order=0,
    ),
    Project(
        title="RumahKu — Home Services", slug="rumahku-home-services", category="Home Services", year="2024",
        cover_url=f"{U}photo-1556228453-efd6c1ff04f6?w=1400&q=80",
        overview="Platform pemesanan jasa rumah tangga (bersih-bersih, AC, tukang) dengan alur booking 3 langkah dan tracking teknisi real-time.",
        role="UI/UX Designer — end-to-end.",
        tools=["Figma", "Blender", "Notion"],
        color_palette=["#0F172A", "#2563EB", "#93C5FD", "#F1F5F9"],
        typography=[TypographyItem(name="Roboto", usage="Seluruh antarmuka")],
        gallery=[f"{U}photo-1556228453-efd6c1ff04f6?w=1200&q=80", f"{U}photo-1522202176988-66273c2fd55f?w=1200&q=80"],
        link="https://behance.net", outcome="Booking berhasil pada percobaan pertama 92% (dari 64%).",
        featured=True, order=1,
    ),
    Project(
        title="Sajian — F&B Ordering", slug="sajian-fnb-ordering", category="F&B", year="2023",
        cover_url=f"{U}photo-1504674900247-0877df9cc836?w=1400&q=80",
        overview="Aplikasi pemesanan dine-in & takeaway dengan menu visual, rekomendasi kontekstual, dan loyalty points.",
        role="Product Designer — UX research & UI.",
        tools=["Figma", "CorelDRAW"],
        color_palette=["#FFF7ED", "#F97316", "#7C2D12", "#1C1917"],
        typography=[TypographyItem(name="Roboto", usage="UI"), TypographyItem(name="Playfair Display", usage="Menu heading")],
        gallery=[f"{U}photo-1504674900247-0877df9cc836?w=1200&q=80"],
        link="https://behance.net", outcome="Rata-rata nilai order naik 18% setelah rekomendasi menu diterapkan.",
        featured=True, order=2,
    ),
    Project(
        title="Sehatin — Telehealth Dashboard", slug="sehatin-telehealth", category="Healthcare", year="2023",
        cover_url=f"{U}photo-1763718528755-4bca23f82ac3?w=1400&q=80",
        overview="Dashboard dokter untuk konsultasi online: antrean pasien, rekam medis ringkas, dan resep digital.",
        role="UI Designer — design system & dashboard UI.",
        tools=["Figma", "Notion"],
        color_palette=["#ECFDF5", "#10B981", "#064E3B", "#111827"],
        typography=[TypographyItem(name="Roboto", usage="UI")],
        gallery=[f"{U}photo-1551288049-bebda4e38f71?w=1200&q=80"],
        link="", outcome="Waktu input resep turun 40% berdasarkan uji internal.",
        featured=True, order=3,
    ),
    Project(
        title="Kelana — Travel Landing Page", slug="kelana-travel-landing", category="Landing Page", year="2022",
        cover_url=f"{U}photo-1460925895917-afdab827c52f?w=1400&q=80",
        overview="Landing page destinasi wisata lokal dengan storytelling visual dan CTA pemesanan.",
        role="Visual & UI Designer.", tools=["Figma", "After Effects"],
        color_palette=["#0EA5E9", "#0C4A6E", "#F0F9FF"], typography=[TypographyItem(name="Roboto", usage="UI")],
        gallery=[], link="", outcome="", featured=False, order=4,
    ),
    Project(
        title="Nusa Brand Identity", slug="nusa-brand-identity", category="Branding", year="2022",
        cover_url=f"{U}photo-1522202176988-66273c2fd55f?w=1400&q=80",
        overview="Identitas visual untuk brand kriya lokal: logo, palet, dan panduan penggunaan.",
        role="Brand Designer.", tools=["CorelDRAW", "Blender"],
        color_palette=["#FFDADC", "#E62129", "#731014"], typography=[TypographyItem(name="Roboto", usage="Guideline")],
        gallery=[], link="", outcome="", featured=False, order=5,
    ),
]


async def seed_content() -> None:
    if await profile_repo.col.count_documents({}) == 0:
        await profile_repo.save(PROFILE)
    if await skills_repo.count() == 0:
        for i, (name, kind) in enumerate(SKILLS):
            await skills_repo.create(Skill(name=name, type=kind, order=i))
    if await tools_repo.count() == 0:
        for i, name in enumerate(TOOLS):
            await tools_repo.create(Tool(name=name, order=i))
    if await experiences_repo.count() == 0:
        for i, exp in enumerate(EXPERIENCES):
            exp.order = i
            await experiences_repo.create(exp)
    if await projects_repo.count() == 0:
        for project in PROJECTS:
            await projects_repo.create(project)
