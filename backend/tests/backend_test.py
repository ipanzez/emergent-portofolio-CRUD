"""Backend API tests for Portfolio CMS."""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://creative-vault-184.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_USER = "admin"
ADMIN_PASS = "Admin@12345"


# --- Fixtures ---
@pytest.fixture(scope="session")
def anon():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return s


# --- Auth ---
class TestAuth:
    def test_me_unauth_401(self, anon):
        # use a fresh session without cookies
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_admin_endpoint_requires_auth(self):
        r = requests.get(f"{API}/admin/dashboard")
        assert r.status_code == 401

    def test_login_success_sets_cookies(self):
        s = requests.Session()
        r = s.post(f"{API}/auth/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
        assert r.status_code == 200
        data = r.json()
        assert data["username"] == ADMIN_USER
        assert "id" in data
        # cookies
        assert "access_token" in s.cookies
        assert "refresh_token" in s.cookies

    def test_login_wrong_password_401(self):
        s = requests.Session()
        r = s.post(f"{API}/auth/login", json={"username": ADMIN_USER, "password": "wrong-pass-xyz"})
        assert r.status_code == 401

    def test_me_with_cookie(self, admin_session):
        r = admin_session.get(f"{API}/auth/me")
        assert r.status_code == 200
        assert r.json()["username"] == ADMIN_USER

    def test_refresh(self, admin_session):
        r = admin_session.post(f"{API}/auth/refresh")
        assert r.status_code == 200
        assert r.json()["username"] == ADMIN_USER

    def test_change_password_wrong_current_400(self, admin_session):
        r = admin_session.put(f"{API}/auth/password",
                              json={"current_password": "not-the-password", "new_password": "SomethingElse123"})
        assert r.status_code == 400

    def test_logout_clears_cookies(self):
        s = requests.Session()
        s.post(f"{API}/auth/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
        r = s.post(f"{API}/auth/logout")
        assert r.status_code == 200
        # subsequent /me should be 401
        r2 = s.get(f"{API}/auth/me")
        assert r2.status_code == 401


# --- Public ---
class TestPublic:
    def test_portfolio(self):
        r = requests.get(f"{API}/public/portfolio")
        assert r.status_code == 200
        data = r.json()
        assert "profile" in data
        assert data["profile"]["name"] == "Raka Adinata"
        assert len(data["skills"]) == 13
        assert len(data["tools"]) == 6
        assert len(data["experiences"]) == 3
        assert len(data["projects"]) == 6
        featured = [p for p in data["projects"] if p["featured"]]
        assert len(featured) == 4

    def test_public_project_by_slug(self):
        r = requests.get(f"{API}/public/projects/toko-rasa-ecommerce")
        assert r.status_code == 200
        assert r.json()["slug"] == "toko-rasa-ecommerce"

    def test_public_project_404(self):
        r = requests.get(f"{API}/public/projects/does-not-exist-xxx")
        assert r.status_code == 404


# --- Admin CRUD ---
class TestSkillsCRUD:
    def test_full_crud(self, admin_session):
        payload = {"name": "TEST_Skill_X", "type": "hard", "order": 999}
        r = admin_session.post(f"{API}/admin/skills", json=payload)
        assert r.status_code == 201
        sid = r.json()["id"]
        assert r.json()["name"] == "TEST_Skill_X"

        r = admin_session.get(f"{API}/admin/skills/{sid}")
        assert r.status_code == 200

        r = admin_session.get(f"{API}/admin/skills")
        assert r.status_code == 200 and any(s["id"] == sid for s in r.json())

        payload["name"] = "TEST_Skill_Y"
        r = admin_session.put(f"{API}/admin/skills/{sid}", json=payload)
        assert r.status_code == 200
        assert r.json()["name"] == "TEST_Skill_Y"

        # reorder: pass current list ids
        all_ids = [s["id"] for s in admin_session.get(f"{API}/admin/skills").json()]
        r = admin_session.put(f"{API}/admin/skills/reorder", json={"ids": all_ids})
        assert r.status_code == 200

        r = admin_session.delete(f"{API}/admin/skills/{sid}")
        assert r.status_code == 200
        r = admin_session.delete(f"{API}/admin/skills/{sid}")
        assert r.status_code == 404


class TestToolsCRUD:
    def test_create_delete(self, admin_session):
        r = admin_session.post(f"{API}/admin/tools", json={"name": "TEST_Tool", "icon": "", "order": 99})
        assert r.status_code == 201
        tid = r.json()["id"]
        assert admin_session.delete(f"{API}/admin/tools/{tid}").status_code == 200


class TestExperiencesCRUD:
    def test_create_update_delete(self, admin_session):
        r = admin_session.post(f"{API}/admin/experiences", json={
            "position": "TEST_Position", "company": "TEST_Co", "start": "2020", "end": "2021",
            "description": "x", "order": 99
        })
        assert r.status_code == 201
        eid = r.json()["id"]

        r = admin_session.put(f"{API}/admin/experiences/{eid}", json={
            "position": "TEST_Position2", "company": "TEST_Co", "start": "2020", "end": "2021",
            "description": "x", "order": 99
        })
        assert r.status_code == 200
        assert r.json()["position"] == "TEST_Position2"
        assert admin_session.delete(f"{API}/admin/experiences/{eid}").status_code == 200


class TestProjectsCRUD:
    def test_auto_slug_and_crud(self, admin_session):
        payload = {"title": "TEST Project Auto Slug", "slug": "", "category": "Web", "year": "2025",
                   "overview": "ov", "role": "role", "tools": [], "color_palette": [],
                   "typography": [], "gallery": [], "featured": False, "order": 999}
        r = admin_session.post(f"{API}/admin/projects", json=payload)
        assert r.status_code == 201
        proj = r.json()
        assert proj["slug"] == "test-project-auto-slug"
        pid = proj["id"]

        r = admin_session.get(f"{API}/admin/projects/{pid}")
        assert r.status_code == 200

        # verify public endpoint too
        r = requests.get(f"{API}/public/projects/test-project-auto-slug")
        assert r.status_code == 200

        assert admin_session.delete(f"{API}/admin/projects/{pid}").status_code == 200
        assert admin_session.delete(f"{API}/admin/projects/{pid}").status_code == 404


# --- Case study fields + Reorder ---
class TestProjectCaseStudyFields:
    def test_create_update_with_case_study_fields(self, admin_session):
        payload = {
            "title": "TEST Case Study Proj", "slug": "", "category": "Web", "year": "2025",
            "overview": "ov", "role": "role", "tools": [], "color_palette": [],
            "typography": [], "gallery": [], "featured": False, "order": 999,
            "problem": "The problem statement",
            "goal": "The goal statement",
            "process": [
                {"title": "Discover", "description": "d1"},
                {"title": "Design", "description": "d2"},
            ],
            "kpis": [
                {"value": "80%", "label": "increase"},
                {"value": "2x", "label": "speed"},
            ],
        }
        r = admin_session.post(f"{API}/admin/projects", json=payload)
        assert r.status_code == 201, r.text
        data = r.json()
        pid = data["id"]
        try:
            assert data["problem"] == "The problem statement"
            assert data["goal"] == "The goal statement"
            assert len(data["process"]) == 2
            assert data["process"][0]["title"] == "Discover"
            assert len(data["kpis"]) == 2
            assert data["kpis"][1]["value"] == "2x"

            # update: expand
            payload["process"].append({"title": "Deliver", "description": "d3"})
            payload["kpis"].append({"value": "100", "label": "users"})
            r = admin_session.put(f"{API}/admin/projects/{pid}", json=payload)
            assert r.status_code == 200
            up = r.json()
            assert len(up["process"]) == 3
            assert up["process"][2]["title"] == "Deliver"
            assert len(up["kpis"]) == 3

            # public GET returns fields
            slug = up["slug"]
            r = requests.get(f"{API}/public/projects/{slug}")
            assert r.status_code == 200
            pub = r.json()
            assert pub["problem"] == "The problem statement"
            assert len(pub["process"]) == 3
            assert len(pub["kpis"]) == 3
        finally:
            admin_session.delete(f"{API}/admin/projects/{pid}")

    def test_toko_rasa_has_4_process_and_4_kpis(self):
        r = requests.get(f"{API}/public/projects/toko-rasa-ecommerce")
        assert r.status_code == 200
        d = r.json()
        assert len(d.get("process", [])) == 4, f"process={d.get('process')}"
        assert len(d.get("kpis", [])) == 4, f"kpis={d.get('kpis')}"


class TestReorder:
    def test_projects_reorder(self, admin_session):
        items = admin_session.get(f"{API}/admin/projects").json()
        assert len(items) >= 2
        ids = [p["id"] for p in items]
        # swap first two
        new_ids = [ids[1], ids[0]] + ids[2:]
        r = admin_session.put(f"{API}/admin/projects/reorder", json={"ids": new_ids})
        assert r.status_code == 200
        after = admin_session.get(f"{API}/admin/projects").json()
        after_ids = [p["id"] for p in after]
        assert after_ids[:2] == new_ids[:2]
        # restore
        r = admin_session.put(f"{API}/admin/projects/reorder", json={"ids": ids})
        assert r.status_code == 200
        restored = [p["id"] for p in admin_session.get(f"{API}/admin/projects").json()]
        assert restored == ids

    def test_skills_reorder(self, admin_session):
        items = admin_session.get(f"{API}/admin/skills").json()
        assert len(items) >= 2
        ids = [s["id"] for s in items]
        new_ids = [ids[1], ids[0]] + ids[2:]
        r = admin_session.put(f"{API}/admin/skills/reorder", json={"ids": new_ids})
        assert r.status_code == 200
        after = [s["id"] for s in admin_session.get(f"{API}/admin/skills").json()]
        assert after[:2] == new_ids[:2]
        # also public endpoint reflects new order
        pub = requests.get(f"{API}/public/portfolio").json()["skills"]
        pub_ids = [s["id"] for s in pub]
        assert pub_ids[:2] == new_ids[:2]
        # restore
        admin_session.put(f"{API}/admin/skills/reorder", json={"ids": ids})


# --- Profile ---
class TestProfile:
    def test_get_profile(self, admin_session):
        r = admin_session.get(f"{API}/admin/profile")
        assert r.status_code == 200
        assert r.json()["name"] == "Raka Adinata"

    def test_save_and_revert(self, admin_session):
        original = admin_session.get(f"{API}/admin/profile").json()
        modified = {**original, "hero_subtitle": "TEST subtitle temporary"}
        r = admin_session.put(f"{API}/admin/profile", json=modified)
        assert r.status_code == 200
        assert r.json()["hero_subtitle"] == "TEST subtitle temporary"
        # revert
        r = admin_session.put(f"{API}/admin/profile", json=original)
        assert r.status_code == 200
        assert r.json()["hero_subtitle"] == original["hero_subtitle"]


# --- Upload ---
class TestUpload:
    def test_upload_image_and_download(self, admin_session):
        # Minimal 1x1 PNG
        png = bytes.fromhex(
            "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C489"
            "0000000A49444154789C6300010000000500010D0A2DB40000000049454E44AE426082"
        )
        files = {"file": ("t.png", io.BytesIO(png), "image/png")}
        r = admin_session.post(f"{API}/admin/upload/image", files=files)
        assert r.status_code == 200
        url = r.json()["url"]
        assert url.startswith("/api/uploads/")
        # download
        r2 = requests.get(f"{BASE_URL}{url}")
        assert r2.status_code == 200
        assert len(r2.content) > 0

    def test_upload_image_rejects_non_image(self, admin_session):
        files = {"file": ("t.txt", io.BytesIO(b"hello"), "text/plain")}
        r = admin_session.post(f"{API}/admin/upload/image", files=files)
        assert r.status_code == 400

    def test_upload_cv_rejects_non_pdf(self, admin_session):
        files = {"file": ("t.txt", io.BytesIO(b"hi"), "text/plain")}
        r = admin_session.post(f"{API}/admin/upload/cv", files=files)
        assert r.status_code == 400
