from rest_framework import serializers
from .models import Transaction
from .events import publish_transaction_event

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['risk_score', 'status', 'created_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be positive")
        return value

    def create(self, validated_data):
        transaction = Transaction.objects.create(**validated_data)
        publish_transaction_event(transaction)
        return transaction