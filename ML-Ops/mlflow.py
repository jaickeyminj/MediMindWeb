import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_absolute_error, mean_squared_error

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.neural_network import MLPClassifier
import requests
from io import StringIO

import mlflow

# URLs for the datasets
train_url = "https://raw.githubusercontent.com/jaickeyminj/MediMindWeb/main/Backend/Training.csv"
test_url = "https://raw.githubusercontent.com/jaickeyminj/MediMindWeb/main/Backend/Testing.csv"

# Read the datasets
response_train = requests.get(train_url)
response_test = requests.get(test_url)

# Check if the request was successful
if response_train.status_code == 200 and response_test.status_code == 200:
    # Read the content of the response as a string
    data_train = StringIO(response_train.text)
    data_test = StringIO(response_test.text)

    # Load the CSV data into pandas DataFrames
    df_train = pd.read_csv(data_train)
    df_test = pd.read_csv(data_test)
    # user_url = pd.read_csv("file2.csv")
    Y = df_test.drop(["prognosis"], axis=1)

    df_train.drop('Unnamed: 133', axis=1, inplace=True)
    prognosis_names = {
        0: "(vertigo) Paroymsal Positional Vertigo",
        1: "AIDS",
        2: "Acne",
        3: "Alcoholic hepatitis",
        4: "Allergy",
        5: "Arthritis",
        6: "Bronchial Asthma",
        7: "Cervical spondylosis",
        8: "Chicken pox",
        9: "Chronic cholestasis",
        10: "Common Cold",
        11: "Dengue",
        12: "Diabetes",
        13: "Dimorphic hemmorhoids(piles)",
        14: "Drug Reaction",
        15: "Fungal infection",
        16: "GERD",
        17: "Gastroenteritis",
        18: "Heart attack",
        19: "Hepatitis B",
        20: "Hepatitis C",
        21: "Hepatitis D",
        22: "Hepatitis E",
        23: "Hepatitis F",
        24: "Hyperthyroidism",
        25: "Hypoglycemia",
        26: "Hypothyroidism",
        27: "Impetigo",
        28: "Jaundice",
        29: "Malaria",
        30: "Migraine",
        31: "Osteoarthristis",
        32: "Paralysis (brain hemorrhage)",
        33: "Peptic ulcer diseae",
        34: "Pneumonia",
        35: "Psoriasis",
        36: "Tuberculosis",
        37: "Typhoid",
        38: "Urinary tract infection",
        39: "Varicose veins",
        40: "hepatitis A"
    }

    encoder = LabelEncoder()
    df_train["diagnosis"] = encoder.fit_transform(df_train["prognosis"])

    classification_models = {
        'Logistic Regression': LogisticRegression(),
        'Decision Tree': DecisionTreeClassifier(),
        'Random Forest': RandomForestClassifier(n_jobs=-1, random_state=666),
        'Gradient Boosting': GradientBoostingClassifier(),
        # 'K-Nearest Neighbors': KNeighborsClassifier(),
        'Naive Bayes': GaussianNB(),
        'Neural Network': MLPClassifier()
    }

    y = df_train['diagnosis']
    X = df_train.drop(['diagnosis', 'prognosis'], axis=1)

    # Start MLflow run for the entire script
    mlflow.start_run(run_name="MediMindWeb Model Training")
    try:
        for model_name, model in classification_models.items():
            # Start MLflow run for the current model
            with mlflow.start_run(run_name=model_name,nested=True):
                # Split the data into training and validation sets
                X_train, X_valid, y_train, y_valid = train_test_split(X, y, test_size=0.2, random_state=17)

                # Fit the model on the training data
                model.fit(X_train, y_train)

                # Predict on validation set
                y_valid_pred = model.predict(X_valid)

                # Calculate evaluation metrics
                valid_accuracy = accuracy_score(y_valid, y_valid_pred)
                mae = mean_absolute_error(y_valid, y_valid_pred)
                mse = mean_squared_error(y_valid, y_valid_pred)

                # Log parameters and metrics to MLflow
                mlflow.log_params(model.get_params())
                mlflow.log_metric("Validation Accuracy", valid_accuracy)
                mlflow.log_metric("Mean Absolute Error", mae)
                mlflow.log_metric("Mean Squared Error", mse)

                # Save the model as an artifact
                mlflow.sklearn.log_model(model, "model")

                # Print the evaluation metrics
                print(f"Model: {model_name}")
                print(f"Validation Accuracy: {valid_accuracy}")
                print(f"Mean Absolute Error: {mae}")
                print(f"Mean Squared Error: {mse}")

            # mlflow.end_run()  
    finally:
        # End the MLflow run for the entire script
        mlflow.end_run()
else:
    print("Failed to fetch data from the URLs")

