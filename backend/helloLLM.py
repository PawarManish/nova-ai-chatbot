import os
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
my_api_key = os.getenv("GROQ_API_KEY")

if not my_api_key:
    raise ValueError("GROQ_API_KEY environment variable is not set.")

client = Groq(api_key=my_api_key)
model = "openai/gpt-oss-120b"

# tell groq how to behave in chat 
messages = [
    {
        "role": "system",
        "content": "You are a helpful assistant."
    }
]

# ---------------------------------------
# to check which models we can use using groq api 
print('\nAvailable groq models:')
models = client.models.list()

for available_model in models.data:
    print(available_model.id)
print("\nSelected model:", model)

# ---------------------------------------




while True:
    prompt = input("You: ") # input prompt from user


    if prompt.lower() in ["exit", "quit"]: # exit condition
        print("Chatbot: Goodbye!")
        break

    # add user message to the conversation
    messages.append({
        "role": "user",
        "content": prompt
    })    

    response = client.chat.completions.create(model=model, messages=messages)

    answer = response.choices[0].message.content
    print(f"Chatbot:", answer)

    # why we add assistent message to the conversation? if we have system
    # answer - 1] reason is that we want to keep track of the conversation history, 
    # so that the model can generate more contextually relevant responses in future interactions. 
    # 2] By appending the assistant's response to the messages list, we maintain a record of the entire conversation, 
    # which can help the model understand the context and provide better answers in subsequent turns.

    messages.append({   # add assistant message to the conversation
        "role": "assistant",
        "content": answer
    })

