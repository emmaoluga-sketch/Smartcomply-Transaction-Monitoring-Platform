import logging
from .rules import (
    HighAmountRule,
    FrequentTransactionsRule,
    BlacklistedCountryRule,
    HighRiskCustomerRule,
)
from .models import Alert
from apps.audit.models import AuditLog
from apps.transactions.models import Transaction

logger = logging.getLogger(__name__)

# Register rules - adding a new rule is as simple as appending here
RULES = [
    HighAmountRule(),
    FrequentTransactionsRule(),
    BlacklistedCountryRule(),
    HighRiskCustomerRule(),
]

def evaluate_transaction(transaction):
    customer = transaction.customer
    total_risk = transaction.risk_score
    triggered_rules = []

    for rule in RULES:
        try:
            if rule.evaluate(transaction, customer):
                triggered_rules.append(rule)
        except Exception as e:
            logger.error(f"Error evaluating rule {rule.name}: {e}")

    for rule in triggered_rules:
        # Create alert
        Alert.objects.create(
            transaction=transaction,
            rule_name=rule.name,
            message=rule.message
        )
        total_risk += rule.risk_score_increment
        # Audit log
        AuditLog.objects.create(
            transaction=transaction,
            action=f"Rule triggered: {rule.name}",
            details={'rule': rule.name, 'message': rule.message}
        )

    transaction.risk_score = min(total_risk, 100.0)  # cap at 100
    if triggered_rules:
        transaction.status = Transaction.Status.FLAGGED
    else:
        if transaction.status == Transaction.Status.FLAGGED:
            transaction.status = Transaction.Status.PENDING
    transaction.save()
    logger.info(f"Transaction {transaction.id} risk score updated to {transaction.risk_score}")