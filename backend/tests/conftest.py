import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from apps.customers.models import Customer

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def auth_headers():
    # Use test user seeded
    user = User.objects.create_user('testuser', 'test@example.com', 'test123')
    client = APIClient()
    response = client.post('/api/v1/auth/login/', {'username': 'testuser', 'password': 'test123'})
    token = response.data['access']
    return {'HTTP_AUTHORIZATION': f'Bearer {token}'}

@pytest.fixture
def customer():
    return Customer.objects.create(name='Test Customer', email='test@example.com', country='US')
    