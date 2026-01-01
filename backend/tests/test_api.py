import pytest
from fastapi.testclient import TestClient
from main import app
from app.core.database import Base, engine, SessionLocal
from app.core import models
import uuid

# Setup test database
@pytest.fixture(scope="module")
def test_db():
    # Ensure clean state for module tests
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="module")
def auth_token(client, test_db):
    email = f"test_{uuid.uuid4().hex[:6]}@example.com"
    # Signup
    client.post("/api/v1/auth/signup", json={
        "email": email,
        "password": "password123",
        "first_name": "Test",
        "last_name": "User",
        "role": "Lawyer"
    })
    
    # Create Firm (Required for Enterprise RBAC)
    firm_res = client.post("/api/v1/auth/setup-firm", json={
        "name": "Test Law Firm",
        "jurisdiction": "Global",
        "timezone": "UTC",
        "currency": "USD",
        "practice_areas": ["Criminal"],
        "employee_counts": {"Lawyer": 1}
    })
    firm_id = firm_res.json()["id"]
    
    # Assign User to Firm
    user = test_db.query(models.User).filter(models.User.email == email).first()
    user.firm_id = firm_id
    test_db.commit()

    # Login
    response = client.post("/api/v1/auth/login", data={
        "username": email,
        "password": "password123"
    })
    return response.json()["access_token"]

def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Veritas Legal Intelligence API - Modular Monolith v2"}

def test_signup(client, test_db):
    email = f"signup_{uuid.uuid4().hex[:6]}@example.com"
    response = client.post("/api/v1/auth/signup", json={
        "email": email,
        "password": "password123",
        "first_name": "Signup",
        "last_name": "Test",
        "role": "Lawyer"
    })
    assert response.status_code == 200
    assert response.json()["email"] == email

def test_create_case(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.post("/api/v1/cases/", json={
        "title": "State vs. Test",
        "description": "A test case",
        "case_number": f"TEST-{uuid.uuid4().hex[:4]}",
        "court": "Supreme Court",
        "judge": "Judge Smith",
        "case_types": ["Criminal"],
        "metadata_fields": {}
    }, headers=headers)
    assert response.status_code == 200
    assert response.json()["title"] == "State vs. Test"

def test_get_tasks(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/api/v1/tasks", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_global_search(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}
    response = client.get("/api/v1/search?query=State", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
