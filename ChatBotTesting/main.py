
# Importing the required library
from flask import Flask, request, jsonify, send_from_directory, render_template, url_for
import openai
# import sys
# import os
import pytesseract
from PIL import Image

app = Flask(__name__)

# Setting the OpenAI API key
openai.api_key = "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"

# Defining required libraries
# userQueries = []
conversation = []

# Serving the website assets (HTML, CSS, JavaScript, etc.) from the "Website" directory
@app.route('/')
def serve_website():
    user_icon = url_for('static', filename='assets/img/user-icon.png')
    bot_icon = url_for('static', filename='assets/img/bot-icon.png')
    return render_template("index.html", user_icon=user_icon, bot_icon = bot_icon)

# Handling the chatbot functionality
@app.route('/api/chat', methods=['POST'])
def chat():
    # Retrieivng the user query
    user_query = request.json.get('text')

    # Defining the conversation
    conversation.append({"role": "user", "content": user_query})

    # Making the API call
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=conversation
    )

    # Extracting the bot's reply
    bot_reply = response['choices'][0]['message']['content']

    conversation.append({"role": "assistant", "content": bot_reply})

    return jsonify({'text': bot_reply})

# Define a route to handle file upload and processing
@app.route("/process", methods=["POST"])
def process_file():
    uploaded_file = request.files["fileInput"]
    
    pytesseract.pytesseract.tesseract_cmd = r'Tesseract-OCR\\tesseract.exe'

    # Open an image using Pillow
    image = Image.open(uploaded_file)  

    # Use pytesseract to extract text from the image
    text = pytesseract.image_to_string(image, config='--psm 3')

    # Print the extracted text
    return text

if __name__ == '__main__':
    app.run(debug=True)
