import pytest
from apps.transactions.models import Transaction
from apps.customers.models import Customer
from decimal import Decimal

@pytest.mark.django_db
def test_create_transaction(api_client, auth_headers, customer):
    data = {
        'reference': 'TX123',
        'customer': customer.id,
        'amount': '5000.00',
        'currency': 'USD',
        'transaction_type': 'DEPOSIT'
    }
    response = api_client.post('/api/v1/transactions/', data, format='json', **auth_headers)
    assert response.status_code == 201
    assert Transaction.objects.count() == 1