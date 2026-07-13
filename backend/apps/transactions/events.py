import redis
import json
import uuid
from django.conf import settings

def publish_transaction_event(transaction):
    r = redis.from_url(settings.REDIS_URL)
    event = {
        'event_id': str(uuid.uuid4()),
        'type': 'transaction.created',
        'transaction_id': transaction.id,
        'amount': str(transaction.amount),
        'customer_id': transaction.customer_id,
        'created_at': transaction.created_at.isoformat(),
    }
    r.xadd('transaction_events', event)