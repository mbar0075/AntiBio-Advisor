
# Importing the required library
from flask import Flask, request, jsonify, send_from_directory, render_template, url_for
import openai
# import sys
# import os
import pytesseract
from PIL import Image

# ------------------- Llama2 -------------------
import os
# To get API tken, go https://replicate.com/account/api-tokens
os.environ["REPLICATE_API_TOKEN"] = "r8_VJUqAZVYc1qpxVK7lf9RiYM3XizCegh2iU7iq"

import replicate

# Prompts
pre_prompt = "You are a helpful assistant. You do not respond as 'User' or pretend to be 'User'. You only respond once as 'Assistant'."


# ------------------- Llama2 -------------------
app = Flask(__name__)

# Setting the OpenAI API key
openai.api_key = "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"

# Defining required libraries
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
        model="ft:gpt-3.5-turbo-0613:personal::8AhA1t5R",#"gpt-3.5-turbo",
        messages=conversation
    )

    # Extracting the bot's reply
    bot_reply = response['choices'][0]['message']['content']

    conversation.append({"role": "assistant", "content": bot_reply})

    return jsonify({'text': bot_reply})

# ------------------- Llama2 -------------------
    # # Retrieivng the user query
    # user_query = request.json.get('text')

    # # Defining the conversation
    # conversation.append({"role": "user", "content": user_query})

    # # Generate LLM response
    # output = replicate.run('a16z-infra/llama13b-v2-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5', # LLM model
    #                     input={"prompt": f"{pre_prompt} {user_query} Assistant: ", # Prompts
    #                     "temperature":0.1, "top_p":0.9, "max_length":128, "repetition_penalty":1})  # Model parameters
    
    # bot_reply = ""

    # for item in output:
    #     bot_reply += item


    # conversation.append({"role": "assistant", "content": bot_reply})

    # return jsonify({'text': bot_reply})
# ------------------- Llama2 -------------------

# Define a route to handle file upload and processing
# @app.route("/process", methods=["POST"])
# def process_file():
#     uploaded_file = request.files["fileInput"]
    
#     pytesseract.pytesseract.tesseract_cmd = r'AntiBio-Advisor\\Tesseract-OCR\\tesseract.exe'

#     # Open an image using Pillow
#     image = Image.open(uploaded_file)  

#     # Use pytesseract to extract text from the image
#     text = pytesseract.image_to_string(image, config='--psm 3')

#     # Print the extracted text
#     return text

# Resetting conversation history
@app.route('/api/reset_conversation', methods=['POST'])
def reset_conversation():
    global conversation
    conversation = []
    return jsonify({'message': 'Conversation reset.'})

if __name__ == '__main__':
    app.run(debug=True)
