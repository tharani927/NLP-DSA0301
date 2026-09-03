# Intelligent Customer Support Ticket Classification and Urgency Detection System

## 📌 Project Overview

This project develops an end-to-end **Natural Language Processing (NLP)** system for automatically analysing customer-support tickets.

The system takes a customer-support ticket containing a subject and description, preprocesses the text, extracts linguistic features, classifies the ticket into an issue category, and estimates its urgency. The project also compares two different classification approaches:

1. **Rule-Based Keyword Classification**
2. **TF-IDF + Logistic Regression**

The objective is to make helpdesk triage faster, more consistent, and suitable for near-real-time support environments.

---

## 🎯 Objectives

- Automatically classify customer-support tickets into predefined issue categories.
- Detect the urgency/priority level of a ticket.
- Clean and normalise noisy customer-written text.
- Mask obvious personally identifiable information (PII).
- Apply NLP techniques such as tokenisation and POS tagging.
- Convert text into numerical features using **TF-IDF with unigram/bigram representation**.
- Compare a transparent rule-based classifier with a statistical machine-learning classifier.
- Evaluate both approaches using accuracy, precision, recall, F1-score, and processing time.
- Select the most suitable approach using multiple engineering criteria.

---

## 🧠 NLP Pipeline

The implemented pipeline follows these stages:

```text
Raw Customer Support Ticket
            ↓
Text Cleaning & PII Masking
            ↓
Tokenisation & Sentence Splitting
            ↓
POS Tagging & Linguistic Feature Extraction
            ↓
N-gram / TF-IDF Feature Representation
            ↓
 ┌─────────────────────────────────────┐
 │      Classification Alternatives    │
 │                                     │
 │  1. Rule-Based Keyword Classifier   │
 │  2. TF-IDF + Logistic Regression    │
 └─────────────────────────────────────┘
            ↓
Urgency Detection
            ↓
Evaluation & Comparison
            ↓
Category + Urgency + Confidence Score
```

### Main NLP Components

**1. Text Preprocessing**
- Removes HTML tags and unwanted text artefacts.
- Normalises whitespace and case.
- Removes unnecessary punctuation.
- Masks obvious email addresses, phone numbers, and ticket/account/order IDs using regular expressions.

**2. Tokenisation**
- Splits text into sentences and word tokens using NLTK.

**3. POS Tagging**
- Applies Part-of-Speech tagging.
- Extracts nouns, proper nouns, verbs, and adjectives as useful linguistic cues.

**4. TF-IDF and N-grams**
- Uses unigram and bigram features.
- Converts cleaned text into numerical TF-IDF vectors.

**5. Classification**
- Rule-based classification uses predefined keywords.
- Statistical classification uses TF-IDF features with Logistic Regression.

**6. Urgency Detection**
The baseline urgency detector uses keyword/action cues.

Examples of high-urgency indicators:
- `urgent`
- `critical`
- `immediately`
- `emergency`
- `security breach`
- `system down`
- `failed`
- `failure`

Medium-urgency indicators include:
- `soon`
- `delayed`
- `problem`
- `unable`
- `issue`
- `not working`

Tickets without urgency cues are assigned **Low** urgency.

---

## 📊 Dataset

The project uses the **Customer Support Ticket Dataset** from Kaggle.

### Dataset Details

| Property | Details |
|---|---|
| Dataset | Customer Support Ticket Dataset |
| Records | 8,469 |
| Training set | 6,775 (80%) |
| Test set | 1,694 (20%) |
| Issue categories | 5 |
| Urgency levels | 4 |
| Language | English |
| Split | Stratified 80/20 train-test split |

Relevant fields include:

- Ticket ID
- Ticket Type
- Ticket Subject
- Ticket Description
- Ticket Priority
- Ticket Status
- Resolution
- Ticket Channel

The implementation combines **Ticket Subject** and **Ticket Description** to form the input text.

> **Important:** The dataset file is expected to be named `customer_support_tickets.csv`.

---

## 🛠️ Technologies Used

- **Python 3.x**
- **NLTK** – tokenisation, POS tagging, stop words and linguistic processing
- **Python `re`** – regular-expression preprocessing and PII masking
- **scikit-learn** – TF-IDF, Logistic Regression and evaluation metrics
- **pandas** – dataset loading and data processing
- **matplotlib** – visualisation
- **Jupyter Notebook / Google Colab** – development and demonstration

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone <YOUR-GITHUB-REPOSITORY-URL>
cd <YOUR-PROJECT-FOLDER>
```

### 2. Install the required Python packages

```bash
pip install pandas nltk scikit-learn matplotlib
```

### 3. Download required NLTK resources

Run the following once in Python/Google Colab if required:

```python
import nltk

nltk.download("punkt")
nltk.download("averaged_perceptron_tagger")
nltk.download("averaged_perceptron_tagger_eng")
```

If WordNet lemmatisation is used in the final implementation, also run:

```python
nltk.download("wordnet")
```

### 4. Add the dataset

Place:

```text
customer_support_tickets.csv
```

in the same working directory as the implementation.

---

## ▶️ How to Run

Open the project in **Jupyter Notebook or Google Colab** and execute the cells in order.

The implementation performs:

1. Dataset loading
2. Missing-value handling
3. Text combination
4. Regex-based cleaning and PII masking
5. Tokenisation and sentence splitting
6. POS tagging
7. Feature extraction
8. Train/test splitting
9. Rule-based prediction
10. TF-IDF vectorisation
11. Logistic Regression training
12. Statistical prediction
13. Accuracy/precision/recall/F1 evaluation
14. Confusion-matrix generation
15. Urgency prediction
16. Confidence-score calculation
17. Final engineering decision
18. CSV export of model comparison results

The implementation also accepts a sample customer-support ticket and produces a predicted category, urgency, and confidence score.

---

## 🔎 Classification Approaches

### Approach 1 — Rule-Based Classifier

The rule-based approach assigns categories using manually defined keywords.

Examples:

| Category | Example Keywords |
|---|---|
| Billing inquiry | bill, billing, payment, invoice, charged, charge |
| Technical issue | error, crash, bug, technical, not working, login, unable, failed |
| Cancellation request | cancel, cancellation, terminate, termination |
| Refund request | refund, money back, return, reimbursement |
| Product inquiry | product, feature, specification, model, information |

**Advantages**
- Easy to understand and interpret.
- Very fast.
- No model training required.
- Simple to implement.

**Limitations**
- Depends heavily on predefined keywords.
- Struggles with synonyms and unseen wording.
- Requires manual maintenance and refinement.

---

### Approach 2 — TF-IDF + Logistic Regression

The statistical approach:

1. Cleans the ticket text.
2. Generates unigram and bigram TF-IDF features.
3. Limits the feature vocabulary to the configured maximum.
4. Trains a Logistic Regression classifier.
5. Predicts the ticket category.
6. Uses `predict_proba()` to obtain a confidence score.

**Advantages**
- Learns patterns from labelled data.
- Handles variations in customer language better than keyword rules.
- Provides stronger overall classification performance in the reported experiment.

**Limitations**
- Requires labelled training data.
- Less directly interpretable than keyword rules.
- Requires model training and feature extraction.

---

## 📈 Experimental Results

The reported experiment compared both approaches on the held-out test set.

| Metric | Rule-Based | TF-IDF + Logistic Regression |
|---|---:|---:|
| Accuracy | 82.35% | **91.42%** |
| Macro Precision | 80.76% | **90.87%** |
| Macro Recall | 78.94% | **90.21%** |
| Macro F1-score | 79.72% | **90.53%** |
| Avg. processing time/ticket | 0.42 ms | 0.68 ms |

The statistical approach achieved substantially better classification performance while remaining within the project's near-real-time requirement.

### Final Engineering Decision

**TF-IDF + Logistic Regression** was selected as the final classification approach because it achieved better accuracy, precision, recall and F1-score while maintaining very low per-ticket processing time.

---

## ⚠️ Limitations

- The system is currently designed for English-language text.
- The dataset is text-only and may not represent every real-world helpdesk environment.
- Class imbalance can affect statistical classification performance.
- Very short or ambiguous tickets can be difficult to classify.
- Tickets containing multiple issue types can create classification ambiguity.
- Sarcasm, negation, informal language and abbreviations may reduce accuracy.
- Keyword-based urgency detection can overestimate or underestimate urgency.
- The rule-based classifier requires ongoing manual maintenance.

---

## 🔐 Privacy and Responsible AI

Customer-support tickets may contain personal information. The preprocessing stage therefore masks obvious identifiers such as:

- Email addresses
- Phone numbers
- Ticket/account/order IDs

The project uses locally run, open-source tools rather than sending ticket text to paid third-party APIs.

A confidence score is also produced so that low-confidence predictions can be reviewed by a human support agent instead of relying entirely on automated decisions.

---

## ♻️ Sustainability

The project intentionally uses lightweight classical NLP and machine-learning techniques such as:

- Regular expressions
- NLTK
- TF-IDF
- Logistic Regression

These approaches require considerably fewer computational resources than large deep-learning/transformer models and are appropriate for a moderate-scale helpdesk use case.

---

## 🚀 Future Improvements

Possible extensions include:

1. Replace keyword-only urgency detection with a supervised **Ticket Priority classifier**.
2. Compare Logistic Regression with **Multinomial Naïve Bayes** and **Linear SVM**.
3. Use class weighting or resampling when class imbalance is detected.
4. Report per-class precision, recall and F1-score.
5. Introduce a lightweight hybrid system where high-confidence predictions are automated and ambiguous tickets are sent for human review.
6. Perform a larger user study with simulated helpdesk staff.
7. Expand and continuously improve the PII-masking rules.
8. Perform a formal bias and fairness audit across ticket categories.

---

## 📁 Output

The implementation generates/uses evaluation outputs including:

- Classification metrics
- Confusion matrix
- POS-tagging results
- Sample predictions
- Confidence scores
- Model comparison results

The model comparison table can be exported as:

```text
model_comparison_results.csv
```

---

## 👥 Team Members

| Team Member | Primary Contribution |
|---|---|
| **M. Tharani** | Problem definition & requirements analysis; dataset sourcing and documentation; overall report compilation and formatting |
| **M. Lalitha Sri** | NLP pipeline design; regex-based text preprocessing and POS-tagging implementation |
| **P. Teja Sri** | TF-IDF/N-gram statistical approach, machine-learning classifier, quantitative evaluation and metrics |
| **A. Anusha** | Rule-based classifier, comparative/error analysis, ethical and societal considerations, engineering decision |

---

## 📚 Academic Context

**Course:** DSA0301 – Natural Language Processing (Slot A)  
**Department:** Computer Science and Engineering  
**Project:** Intelligent Customer Support Ticket Classification and Urgency Detection System

The project demonstrates the application of multiple NLP concepts in an end-to-end system, including preprocessing, POS tagging, TF-IDF representation, text classification, evaluation, error analysis, privacy considerations and engineering decision-making.

---

## 📖 References

- Jurafsky, D., & Martin, J. H. *Speech and Language Processing*.
- NLTK Documentation
- spaCy Documentation
- scikit-learn Documentation
- pandas Documentation
- matplotlib Documentation

---

## ⭐ Project Summary

**Input:** Customer-support ticket text

**Processing:**  
Preprocessing → Tokenisation → POS Tagging → TF-IDF → Classification → Urgency Detection

**Output:**

```text
Predicted Ticket Type
Predicted Urgency
Confidence Score
```

The project demonstrates how classical NLP and machine learning can be combined to build a practical, lightweight and explainable customer-support ticket triage system.
