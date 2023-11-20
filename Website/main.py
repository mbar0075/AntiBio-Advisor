
# Importing the required library
from flask import Flask, request, jsonify, render_template, url_for
from PIL import Image
import json
import openai

app = Flask(__name__)

# Setting the OpenAI API key
openai.api_key = "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"

# Defining required libraries
conversation = []
demoCompletedList = json.dumps({ "/": 0, "/info": 0, "/faq": 0, "/prescriptionInfo": 0, "/map": 0, "/quiz": 0 })

# Serving the website assets (HTML, CSS, JavaScript, etc.) from the "Website" directory
@app.route('/')
def serve_website():

    user_icon = url_for('static', filename='assets/img/user-icon.png')
    bot_icon = url_for('static', filename='assets/img/bot-icon.png')

    return render_template("index.html", user_icon=user_icon, bot_icon = bot_icon, demoCompletedList=demoCompletedList)

@app.route('/info')
def information_page():

    return render_template("information.html", demoCompletedList = demoCompletedList)

@app.route('/faq')
def faq_page():

    return render_template("faq.html", demoCompletedList = demoCompletedList)

@app.route('/prescriptionInfo')
def prescription_info_page():

    return render_template("prescriptionInfo.html", demoCompletedList = demoCompletedList)

@app.route('/map')
def map_page():

    return render_template("map.html", demoCompletedList = demoCompletedList)

@app.route('/quiz')
def quiz_page():

    return render_template("quiz.html", demoCompletedList = demoCompletedList)

# Handling the chatbot functionality
@app.route('/api/chat', methods=['POST'])
def chat():
    # Retrieivng the user query
    user_query = request.json.get('text')

    # Defining the conversation
    conversation.append({"role": "user", "content": user_query})

    # Making the API call
    response = openai.ChatCompletion.create(
        # model="ft:gpt-3.5-turbo-0613:personal::8AhA1t5R",#"gpt-3.5-turbo",
        # Updated Model on Gavin Dataset (20 Rows)
        model="ft:gpt-3.5-turbo-0613:personal::8DtuUj6k",
        messages=conversation
    )

    # Extracting the bot's reply
    bot_reply = response['choices'][0]['message']['content']

    conversation.append({"role": "assistant", "content": bot_reply})

    return jsonify({'text': bot_reply})

# Resetting conversation history
@app.route('/api/reset_conversation', methods=['POST'])
def reset_conversation():
    global conversation
    conversation = []
    return jsonify({'message': 'Conversation reset.'})

@app.route('/updateCompletedList', methods=['POST'])
def updateCompletedList():
    global demoCompletedList
    data_received = request.get_json()
    
    demoCompletedList = json.dumps(data_received)
    return jsonify({'message': demoCompletedList})

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
