import pytest
from django.contrib.auth.models import User

@pytest.mark.django_db
def test_login_success(api_client):
    User.objects.create_user('john', 'john@example.com', 'pass123')
    response = api_client.post('/api/v1/auth/login/', {'username': 'john', 'password': 'pass123'})
    assert response.status_code == 200
    assert 'access' in response.data