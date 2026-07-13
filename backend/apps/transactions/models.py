from django.db import models
from apps.customers.models import Customer

class Transaction(models.Model):
    class Type(models.TextChoices):
        DEPOSIT = 'DEPOSIT'
        WITHDRAWAL = 'WITHDRAWAL'
        TRANSFER = 'TRANSFER'

    class Status(models.TextChoices):
        PENDING = 'PENDING'
        COMPLETED = 'COMPLETED'
        FLAGGED = 'FLAGGED'
        REJECTED = 'REJECTED'

    reference = models.CharField(max_length=100, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='transactions')
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    transaction_type = models.CharField(max_length=20, choices=Type.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    risk_score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['reference']),
            models.Index(fields=['customer']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.reference} - {self.amount} {self.currency}"