import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_complaints.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override get_db for testing
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    # Create the database tables before tests run
    Base.metadata.create_all(bind=engine)
    yield
    # Drop the database tables after tests finish
    Base.metadata.drop_all(bind=engine)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_create_and_get_complaint():
    complaint_data = {
        "complaint_source": "Test Source",
        "customer_name": "Test Customer",
        "product_name": "Test Product",
        "product_strength": "Test Strength",
        "batch_number": "BATCH-123",
        "manufacturing_date": "2024-01-01",
        "expiry_date": "2026-01-01",
        "quantity_affected": "100",
        "complaint_type": "Quality",
        "complaint_date": "2024-09-01",
        "description": "Test description",
        "initial_severity": "Minor",
        "priority": "Low"
    }

    # Create complaint
    response = client.post("/api/complaints/", json=complaint_data)
    assert response.status_code == 200
    data = response.json()
    assert data["customerName"] == "Test Customer"
    assert "id" in data
    assert "ticketNumber" in data
    
    complaint_id = data["id"]
    
    # Get all complaints
    get_all_response = client.get("/api/complaints/")
    assert get_all_response.status_code == 200
    assert len(get_all_response.json()) > 0
    
    # Get single complaint
    get_single_response = client.get(f"/api/complaints/{complaint_id}")
    assert get_single_response.status_code == 200
    assert get_single_response.json()["customerName"] == "Test Customer"
