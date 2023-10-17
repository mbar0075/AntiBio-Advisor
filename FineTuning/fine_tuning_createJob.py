import openai

def open_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as infile:
        return infile.read()
    
def save_path(filepath, content):
    with open(filepath, 'a', encoding='utf-8') as outfile:
        outfile.write(content)

api_key = "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"
openai.api_key = api_key

file_id = "file-FcZw1iAdldUflAWumtzvbsFv"
model_name = "gpt-3.5-turbo"

response = openai.FineTuningJob.create(
    training_file=file_id,
    model=model_name
)

job_id = response['id']
print(f"Job created with ID: {job_id}")

#Job id (fine_tuning.jsonl/file-FcZw1iAdldUflAWumtzvbsFv) = ftjob-ySE4NjTbdS2y3Smrb2u0EGAE
