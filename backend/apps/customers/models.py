from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    country = models.CharField(max_length=100)
    is_high_risk = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['country']),
        ]

    def __str__(self):
        return self.name