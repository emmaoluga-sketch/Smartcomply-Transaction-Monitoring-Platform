from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from apps.customers.models import Customer
from apps.transactions.models import Transaction
import random

class Command(BaseCommand):
    help = 'Seed the database with test data'

    def handle(self, *args, **kwargs):
        # Create superuser if not exists
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            self.stdout.write('Created admin user')

        # Create test user properly (hashed password)
        if not User.objects.filter(username='testuser').exists():
            User.objects.create_user('testuser', 'test@example.com', 'test123')
            self.stdout.write('Created testuser')

        # Create customers
        customers_data = [
            {'name': 'Alice Johnson', 'email': 'alice@example.com', 'country': 'US', 'is_high_risk': False},
            {'name': 'Bob Smith', 'email': 'bob@example.com', 'country': 'UK', 'is_high_risk': False},
            {'name': 'Charlie Kim', 'email': 'charlie@example.com', 'country': 'North Korea', 'is_high_risk': True},
            {'name': 'Diana Prince', 'email': 'diana@example.com', 'country': 'Iran', 'is_high_risk': True},
        ]
        for c in customers_data:
            Customer.objects.get_or_create(email=c['email'], defaults=c)
        self.stdout.write('Customers seeded')

        # Optional: a few transactions
        if not Transaction.objects.exists():
            customers = Customer.objects.all()
            for i in range(10):
                Transaction.objects.create(
                    reference=f'TX{i:04}',
                    customer=random.choice(customers),
                    amount=random.randint(100, 50000),
                    currency='USD',
                    transaction_type=random.choice(['DEPOSIT', 'WITHDRAWAL', 'TRANSFER']),
                )
            self.stdout.write('Sample transactions created')