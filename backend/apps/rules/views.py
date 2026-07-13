from rest_framework import viewsets
from .models import Alert
from .serializers import AlertSerializer

class AlertViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Alert.objects.select_related('transaction').all()
    serializer_class = AlertSerializer
    search_fields = ['rule_name', 'transaction__reference']
    ordering_fields = ['created_at']