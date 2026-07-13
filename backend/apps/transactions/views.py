from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Transaction
from .serializers import TransactionSerializer
from .filters import TransactionFilter

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.select_related('customer').all()
    serializer_class = TransactionSerializer
    filterset_class = TransactionFilter
    search_fields = ['reference', 'customer__name']
    ordering_fields = ['amount', 'created_at', 'risk_score']

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        transaction = self.get_object()
        new_status = request.data.get('status')
        if new_status not in [choice[0] for choice in Transaction.Status.choices]:
            return Response({"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        transaction.status = new_status
        transaction.save()
        return Response(TransactionSerializer(transaction).data)