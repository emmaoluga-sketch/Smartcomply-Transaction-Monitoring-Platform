import pytest
from apps.transactions.models import Transaction
from apps.customers.models import Customer
from apps.rules.rules import HighAmountRule, BlacklistedCountryRule

@pytest.mark.django_db
def test_high_amount_rule():
    customer = Customer.objects.create(name='A', email='a@b.com', country='US')
    txn = Transaction.objects.create(reference='T1', customer=customer, amount=15000, currency='USD', transaction_type='DEPOSIT')
    rule = HighAmountRule()
    assert rule.evaluate(txn, customer) is True

@pytest.mark.django_db
def test_blacklisted_country_rule():
    customer = Customer.objects.create(name='B', email='b@c.com', country='North Korea')
    txn = Transaction.objects.create(reference='T2', customer=customer, amount=100, currency='USD', transaction_type='TRANSFER')
    rule = BlacklistedCountryRule()
    assert rule.evaluate(txn, customer) is True