from flask import Flask, jsonify, request
import mlflow
import pandas as pd
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

import nltk
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('stopwords')

file_name="file.csv"

app = Flask(__name__)

# Path to the MLFlow logged model
logged_model = 'E:\\Computer System Design\\Final Project\\Web\\MediMindWeb\\Backend-Python\\mlruns\\0\\96b39312b6a347dc8dc8299eafa9a0f7\\artifacts\\Logistic Regression_model'


model_urls = [
    'E:\\Computer System Design\\Final Project\\Web\\MediMindWeb\\Backend-Python\\mlruns\\0\\96b39312b6a347dc8dc8299eafa9a0f7\\artifacts\\Logistic Regression_model',
    'E:\\Computer System Design\\Final Project\\Web\\MediMindWeb\\Backend-Python\\mlruns\\0\\4611a12ea18e4bd388c55dd3b0251ba1\\artifacts\\Neural Network_model',
    'E:\\Computer System Design\\Final Project\\Web\\MediMindWeb\\Backend-Python\\mlruns\\0\\1ce959957e834d438c76d502e74a6470\\artifacts\\Naive Bayes_model',
    'E:\\Computer System Design\\Final Project\\Web\\MediMindWeb\\Backend-Python\\mlruns\\0\\06297adce47a4eb3a11e13ab87f966d5\\artifacts\\SVM_model',
    'E:\\Computer System Design\\Final Project\\Web\\MediMindWeb\\Backend-Python\\mlruns\\0\\2fd14a508a62492bbae1515d69a9393c\\artifacts\\Gradient Boosting_model',
    'E:\\Computer System Design\\Final Project\\Web\\MediMindWeb\\Backend-Python\\mlruns\\0\\f26c0d62760e443cbddb8bed5072f7ae\\artifacts\\Random Forest_model',
    'E:\\Computer System Design\\Final Project\\Web\\MediMindWeb\\Backend-Python\\mlruns\\0\\41cb613cadff434bb073a7b2011a676f\\artifacts\\Decision Tree_model'
]

# Load models as PyFuncModels
# loaded_models = [mlflow.pyfunc.load_model(path) for path in model_urls ]

# # Load model as a PyFuncModel
loaded_model1 = mlflow.pyfunc.load_model(model_urls[0])
loaded_model2 = mlflow.pyfunc.load_model(model_urls[1])
loaded_model3 = mlflow.pyfunc.load_model(model_urls[2])
loaded_model4 = mlflow.pyfunc.load_model(model_urls[3])
loaded_model5 = mlflow.pyfunc.load_model(model_urls[4])
loaded_model6 = mlflow.pyfunc.load_model(model_urls[5])
loaded_model7 = mlflow.pyfunc.load_model(model_urls[6])

# Dictionary mapping diagnosis indices to diagnosis names
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

# Initialize WordNet Lemmatizer
wordnet_lemmatizer = WordNetLemmatizer()

# Sample dataset columns (symptoms)
dataset_columns = ['itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering',
                   'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue',
                   'muscle_wasting', 'vomiting', 'burning_micturition', 'spotting_ urination',
                   'fatigue', 'weight_gain', 'anxiety', 'cold_hands_and_feets', 'mood_swings',
                   'weight_loss', 'restlessness', 'lethargy', 'patches_in_throat', 'irregular_sugar_level',
                   'cough', 'high_fever', 'sunken_eyes', 'breathlessness', 'sweating', 'dehydration',
                   'indigestion', 'headache', 'yellowish_skin', 'dark_urine', 'nausea', 'loss_of_appetite',
                   'pain_behind_the_eyes', 'back_pain', 'constipation', 'abdominal_pain', 'diarrhoea',
                   'mild_fever', 'yellow_urine', 'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload',
                   'swelling_of_stomach', 'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision',
                   'phlegm', 'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose',
                   'congestion', 'chest_pain', 'weakness_in_limbs', 'fast_heart_rate',
                   'pain_during_bowel_movements', 'pain_in_anal_region', 'bloody_stool',
                   'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps', 'bruising', 'obesity',
                   'swollen_legs', 'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid',
                   'brittle_nails', 'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts',
                   'drying_and_tingling_lips', 'slurred_speech', 'knee_pain', 'hip_joint_pain',
                   'muscle_weakness', 'stiff_neck', 'swelling_joints', 'movement_stiffness',
                   'spinning_movements', 'loss_of_balance', 'unsteadiness', 'weakness_of_one_body_side',
                   'loss_of_smell', 'bladder_discomfort', 'foul_smell_of urine', 'continuous_feel_of_urine',
                   'passage_of_gases', 'internal_itching', 'toxic_look_(typhos)', 'depression',
                   'irritability', 'muscle_pain', 'altered_sensorium', 'red_spots_over_body',
                   'belly_pain', 'abnormal_menstruation', 'dischromic _patches', 'watering_from_eyes',
                   'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum', 'rusty_sputum',
                   'lack_of_concentration', 'visual_disturbances', 'receiving_blood_transfusion',
                   'receiving_unsterile_injections', 'coma', 'stomach_bleeding', 'distention_of_abdomen',
                   'history_of_alcohol_consumption', 'fluid_overload', 'blood_in_sputum',
                   'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples',
                   'blackheads', 'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails',
                   'inflammatory_nails', 'blister', 'red_sore_around_nose', 'yellow_crust_ooze']


@app.route('/')
def hello_world():
    return 'Hello, world!'


@app.route('/predict')
def predict_diagnosis():
    predicted_diagnosis_indices = loaded_model5.predict(pd.DataFrame(pd.read_csv(file_name)))

    # Map predicted indices to diagnosis names
    predicted_diagnosis_names = [prognosis_names.get(idx, "Unknown Diagnosis") for idx in predicted_diagnosis_indices]

    # Return predicted diagnosis names as JSON
    return jsonify({"predictions": predicted_diagnosis_names})


@app.route('/analyze')
def analyze_symptoms():
    # Get user input from request data
    user_input = "I fever"

    # Tokenize and lemmatize user input
    tokens = word_tokenize(user_input)
    lemmatized_tokens = [wordnet_lemmatizer.lemmatize(token.lower()) for token in tokens]

    # Now, match the lemmatized tokens with dataset columns
    matched_symptoms = []
    for symptom in dataset_columns:
        if symptom in lemmatized_tokens:
            matched_symptoms.append(symptom)

    # Create a dictionary with all columns set to 0
    symptom_dict = {symptom: 0 for symptom in dataset_columns}

    # Set matched symptoms to 1
    for symptom in matched_symptoms:
        symptom_dict[symptom] = 1

    # Convert the dictionary to a DataFrame with a single row
    symptom_df = pd.DataFrame([symptom_dict], columns=dataset_columns)

    # Save DataFrame to CSV
    symptom_df.to_csv(file_name, index=False)

    # Call prediction route to get the result
    response = predict_diagnosis()

    return response


if __name__ == '__main__':
    app.run(debug=True,port = 8000)



