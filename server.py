# API python script
from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer
import time

app = Flask(__name__)
CORS(app)

# Loading pipeline once
model_name = "Helsinki-NLP/opus-mt-en-es"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# Later, change logging to be using Websockets so its realtime.

@app.route("/translate", methods=["POST"])
def translate():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"translated": "", "logs": []})

    logs = []
    start_time = time.time()
    logs.append("Message Received to Python Script")

    # Translation
    # Tokenize Input Text
    inputs = tokenizer(text, return_tensors="pt", truncation=True)

    # Generate Translation
    outputs = model.generate(**inputs, max_length=1024)

    # Decode Translation
    result = tokenizer.decode(outputs[0], skip_special_tokens=True)

    end_time = time.time()
    duration = round(end_time - start_time, 3)

    logs.append("Message Translated")
    logs.append(f"Translation took {duration} seconds.")

    return jsonify({
        "translated": result,
        "logs": logs
    })

if __name__ == "__main__":
    app.run(debug=True)