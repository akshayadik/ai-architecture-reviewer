import base64
from fastapi import UploadFile, HTTPException
from openai import AsyncOpenAI
# This is the specific import that clears the "not defined" error!
from openai.types.chat import ChatCompletionUserMessageParam
from dotenv import load_dotenv

load_dotenv()
client = AsyncOpenAI()

async def encode_image(file: UploadFile) -> str:
    """Reads an uploaded file and converts it to a base64 string."""
    try:
        contents = await file.read()
        base64_encoded = base64.b64encode(contents).decode('utf-8')
        return base64_encoded
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process image file: {str(e)}")
    finally:
        await file.seek(0)

async def extract_architecture_from_image(file: UploadFile) -> str:
    """
    Sends the base64 image to GPT-4o to extract a structured text description
    of the architecture diagram.
    """
    base64_image = await encode_image(file)
    mime_type = file.content_type or "image/jpeg"

    system_prompt = """
    You are an expert systems analyst. I am providing an image of a software architecture diagram.
    Your single goal is to extract a highly detailed, objective text description of this system.
    
    1. List all distinct components (e.g., databases, APIs, queues, client apps).
    2. Trace the data flow step-by-step based on the arrows and labels.
    3. Output the result as a clear, well-structured text summary.
    
    Do NOT critique the architecture or suggest improvements. Just describe exactly what is in the image.
    """

    try:
        # We explicitly declare the type here so Pylance stays happy
        user_message: ChatCompletionUserMessageParam = {
            "role": "user",
            "content": [
                {
                    "type": "text", 
                    "text": "Please extract the system design from this diagram."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{mime_type};base64,{base64_image}"
                    }
                }
            ]
        }

        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                user_message
            ],
            max_tokens=1000,
        )
        
        content = response.choices[0].message.content
        
        # We check for None to satisfy the string return type
        if content is None:
            raise HTTPException(
                status_code=500, 
                detail="OpenAI returned an empty response for the image."
            )
            
        return content
        
    except Exception as e:
        print(f"Vision API Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to parse architecture from image.")