from rest_framework import viewsets
from .models import Customer
from .serializers import CustomerSerializer
from .filters import CustomerFilter

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filterset_class = CustomerFilter
    search_fields = ['name', 'email']
    ordering_fields = ['name', 'created_at']