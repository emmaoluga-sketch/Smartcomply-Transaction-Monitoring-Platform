from django.db import models
from apps.transactions.models import Transaction

class AuditLog(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='audit_logs')
    action = models.CharField(max_length=255)
    details = models.JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['transaction']),
            models.Index(fields=['timestamp']),
        ]

    def __str__(self):
        return f"{self.action} - {self.transaction.reference}"