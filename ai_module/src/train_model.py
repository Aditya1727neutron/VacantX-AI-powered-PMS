"""
Train a Random Forest model to predict parking occupancy.
Features: hour, day_of_week, month, zone (encoded), is_weekend, is_semester
Target: occupancy_pct
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import LabelEncoder
import joblib
import os

def train_model():
    """Train and save the occupancy prediction model."""
    # Load data
    data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'parking_logs.csv')
    
    if not os.path.exists(data_path):
        print("No data found. Generating synthetic data first...")
        from preprocess import generate_parking_data
        generate_parking_data()
    
    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} records")
    
    # Encode zone
    le = LabelEncoder()
    df['zone_encoded'] = le.fit_transform(df['zone'])
    
    # Features
    feature_cols = ['hour', 'day_of_week', 'month', 'zone_encoded', 'is_weekend', 'is_semester']
    X = df[feature_cols]
    y = df['occupancy_pct']
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Random Forest
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=12,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"\nModel Performance:")
    print(f"  MAE: {mae:.2f}%")
    print(f"  R2:  {r2:.4f}")
    
    # Feature importance
    importances = dict(zip(feature_cols, model.feature_importances_))
    print(f"\nFeature Importances:")
    for feat, imp in sorted(importances.items(), key=lambda x: -x[1]):
        print(f"  {feat}: {imp:.4f}")
    
    # Save model and encoder
    models_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, 'occupancy_model.pkl')
    encoder_path = os.path.join(models_dir, 'zone_encoder.pkl')
    
    joblib.dump(model, model_path)
    joblib.dump(le, encoder_path)
    
    print(f"\nModel saved -> {model_path}")
    print(f"Encoder saved -> {encoder_path}")
    
    return model, le

if __name__ == '__main__':
    train_model()
