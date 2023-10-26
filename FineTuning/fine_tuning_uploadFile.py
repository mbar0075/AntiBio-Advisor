# Tutorial = https://www.youtube.com/watch?v=2Pd0YExeC5o&ab_channel=AllAboutAI
import openai

def open_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as infile:
        return infile.read()
    
def save_path(filepath, content):
    with open(filepath, 'a', encoding='utf-8') as outfile:
        outfile.write(content)

api_key = "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"
openai.api_key = api_key

jsonLFilePath = "FineTuning\\fine_tuning.jsonl"

with open(jsonLFilePath, 'rb') as file:
    response = openai.File.create(
        file=file,
        purpose='fine-tune'
    )

file_id = response['id']
print(f"File uploaded with ID: {file_id}")

#File id (fine_tuning_old.jsonl) = file-FcZw1iAdldUflAWumtzvbsFv
#File id (fine_tuning.jsonl) = file-2mL56bkvPbFwnf3o6wHalcT2
