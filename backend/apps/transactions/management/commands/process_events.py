import redis
import json
import logging
import hashlib
from django.core.management.base import BaseCommand
from django.conf import settings
from apps.transactions.models import Transaction
from apps.rules.evaluator import evaluate_transaction

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Process transaction events from Redis Stream'

    def handle(self, *args, **kwargs):
        r = redis.from_url(settings.REDIS_URL)
        stream_key = 'transaction_events'
        group_name = 'transaction_processor'
        consumer_name = 'worker-1'

        # Create consumer group if not exists
        try:
            r.xgroup_create(stream_key, group_name, id='0', mkstream=True)
        except redis.exceptions.ResponseError as e:
            if 'BUSYGROUP' in str(e):
                pass
            else:
                raise

        logger.info("Starting event processor...")
        while True:
            try:
                events = r.xreadgroup(group_name, consumer_name, {stream_key: '>'}, count=1, block=5000)
                if not events:
                    continue
                for stream, messages in events:
                    for msg_id, msg_data in messages:
                        event = {k.decode(): v.decode() for k, v in msg_data.items()}
                        logger.info(f"Processing event {msg_id}: {event}")
                        transaction_id = event.get('transaction_id')
                        if transaction_id:
                            try:
                                transaction = Transaction.objects.get(id=transaction_id)
                                evaluate_transaction(transaction)

                                # Compute SHA‑256 hash of reference + amount (bonus: performance‑critical processing)
                                hash_input = f"{transaction.reference}-{transaction.amount}"
                                hash_hex = hashlib.sha256(hash_input.encode()).hexdigest()
                                logger.info(f"Transaction hash for {transaction.reference}: {hash_hex}")

                                r.xack(stream_key, group_name, msg_id)
                            except Transaction.DoesNotExist:
                                logger.error(f"Transaction {transaction_id} not found")
                                r.xack(stream_key, group_name, msg_id)
                        else:
                            r.xack(stream_key, group_name, msg_id)
            except KeyboardInterrupt:
                logger.info("Worker stopped")
                break
            except Exception as e:
                logger.exception("Error in event loop")