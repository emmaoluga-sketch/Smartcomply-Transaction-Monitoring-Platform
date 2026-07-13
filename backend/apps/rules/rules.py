from .engine import BaseRule
from django.utils import timezone
from datetime import timedelta
from apps.transactions.models import Transaction

BLACKLISTED_COUNTRIES = ['North Korea', 'Iran', 'Syria']

class HighAmountRule(BaseRule):
    name = 'high_amount'
    message = 'Transaction amount exceeds threshold'
    risk_score_increment = 30

    def evaluate(self, transaction, customer):
        return transaction.amount > 10000

class FrequentTransactionsRule(BaseRule):
    name = 'frequent_transactions'
    message = 'More than 5 transactions in one hour'
    risk_score_increment = 25

    def evaluate(self, transaction, customer):
        one_hour_ago = timezone.now() - timedelta(hours=1)
        count = Transaction.objects.filter(
            customer=customer,
            created_at__gte=one_hour_ago
        ).count()
        return count > 5

class BlacklistedCountryRule(BaseRule):
    name = 'blacklisted_country'
    message = 'Customer country is blacklisted'
    risk_score_increment = 50

    def evaluate(self, transaction, customer):
        return customer.country in BLACKLISTED_COUNTRIES

class HighRiskCustomerRule(BaseRule):
    name = 'high_risk_customer'
    message = 'Customer is high risk'
    risk_score_increment = 40

    def evaluate(self, transaction, customer):
        return customer.is_high_risk