import pandas as pd
import numpy as np
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
from metaflow import FlowSpec, step, Parameter, get_metadata

class MediMindWebModelTraining(FlowSpec):
    # Define parameters for URLs
    train_url = Parameter('train_url', default="https://raw.githubusercontent.com/jaickeyminj/MediMindWeb/main/Backend/Training.csv")
    test_url = Parameter('test_url', default="https://raw.githubusercontent.com/jaickeyminj/MediMindWeb/main/Backend/Testing.csv")

    @step
    def start(self):
        # Read data from URLs
        response_train = requests.get(self.train_url)
        response_test = requests.get(self.test_url)

        if response_train.status_code == 200 and response_test.status_code == 200:
            # Load CSV data into pandas DataFrames
            data_train = StringIO(response_train.text)
            data_test = StringIO(response_test.text)
            self.df_train = pd.read_csv(data_train)
            self.df_test = pd.read_csv(data_test)
            self.prognosis_names = {
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
            self.next(self.preprocess)
        else:
            print("Failed to fetch data from the URLs")

    @step
    def preprocess(self):
        # Preprocess data
        self.df_train.drop('Unnamed: 133', axis=1, inplace=True)
        encoder = LabelEncoder()
        self.df_train["diagnosis"] = encoder.fit_transform(self.df_train["prognosis"])
        self.Y = self.df_test.drop(["prognosis"], axis=1)
        self.y = self.df_train['diagnosis']
        self.X = self.df_train.drop(['diagnosis', 'prognosis'], axis=1)
        self.next(self.train_models)

    @step
    def train_models(self):
        classification_models = {
            'Logistic Regression': LogisticRegression(),
            'Decision Tree': DecisionTreeClassifier(),
            'Random Forest': RandomForestClassifier(n_jobs=-1, random_state=666),
            'Gradient Boosting': GradientBoostingClassifier(),
            'Naive Bayes': GaussianNB(),
            'Neural Network': MLPClassifier()
        }

        for model_name, model in classification_models.items():
            # Split the data into training and validation sets
            X_train, X_valid, y_train, y_valid = train_test_split(self.X, self.y, test_size=0.2, random_state=17)

            # Fit the model on the training data
            model.fit(X_train, y_train)

            # Predict on validation set
            y_valid_pred = model.predict(X_valid)

            # Calculate evaluation metrics
            valid_accuracy = accuracy_score(y_valid, y_valid_pred)
            mae = mean_absolute_error(y_valid, y_valid_pred)
            mse = mean_squared_error(y_valid, y_valid_pred)

            # Log parameters and metrics
            self.log(model_name=model_name,
                     validation_accuracy=valid_accuracy,
                     mean_absolute_error=mae,
                     mean_squared_error=mse)

            # Save the model as an artifact
            self.save_model(model, f"{model_name}_model")

    def save_model(self, model, name):
        # Save model implementation
        # For example:
        # model.save(name)
        pass

if __name__ == '__main__':
    # Specify the metadata location
    metadata = get_metadata()
    # Start the Metaflow flow
    MediMindWebModelTraining()
