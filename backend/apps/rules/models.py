from django.db import models
from apps.transactions.models import Transaction

class Alert(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='alerts')
    rule_name = models.CharField(max_length=100)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.rule_name} - {self.transaction.reference}"