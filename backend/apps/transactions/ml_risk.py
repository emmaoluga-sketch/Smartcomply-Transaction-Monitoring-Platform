import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest
from apps.transactions.models import Transaction

def train_model():
    transactions = Transaction.objects.all().values('amount', 'created_at', 'customer__is_high_risk')
    df = pd.DataFrame(transactions)
    df['hour'] = df['created_at'].dt.hour
    df['customer_risk'] = df['customer__is_high_risk'].astype(int)
    model = IsolationForest(contamination=0.05)
    model.fit(df[['amount', 'hour', 'customer_risk']])
    joblib.dump(model, 'risk_model.pkl')
    return model

def predict_risk(transaction):
    model = joblib.load('risk_model.pkl')
    features = [[float(transaction.amount), transaction.created_at.hour, int(transaction.customer.is_high_risk)]]
    pred = model.predict(features)
    return pred[0] == -1  # anomaly