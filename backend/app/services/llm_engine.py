import os
from openai import AsyncOpenAI
from dotenv import load_dotenv
from app.models.schemas import ArchitectureCritique

# Load environment variables from the .env file
load_dotenv()

# Initialize the Async OpenAI Client. 
# It automatically picks up the OPENAI_API_KEY from your environment.
client = AsyncOpenAI()

async def analyze_architecture_with_llm(
    description: str, 
    rag_context: str = "No additional context provided."
) -> ArchitectureCritique:
    """
    Calls OpenAI's GPT-4o model using Structured Outputs to guarantee 
    the response matches our ArchitectureCritique Pydantic schema.
    """
    
    # The persona and instructions for the AI
    system_prompt = f"""
    You are an Expert Principal Cloud Architect and Staff Engineer. 
    Your job is to ruthlessly but constructively critique software architecture designs.
    
    Analyze the provided system design description.
    Identify bottlenecks, single points of failure, scalability ceilings, and cost inefficiencies.
    Provide actionable, concrete improvements.
    
    Use the following architectural best practices to guide your critique:
    <best_practices>
    {rag_context}
    </best_practices>
    """

    try:
        completion = await client.beta.chat.completions.parse(
            model="gpt-4o", 
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Analyze this architecture:\n\n{description}"}
            ],
            response_format=ArchitectureCritique,
        )
        
        message = completion.choices[0].message
        
        # --- FIX: Check if parsed data exists ---
        if message.parsed is not None:
            return message.parsed
        elif message.refusal:
            # The model refused to answer (e.g., safety violation)
            raise ValueError(f"Model refused to respond: {message.refusal}")
        else:
            # Fallback for any other unexpected parsing failure
            raise ValueError("Failed to parse the structured output from OpenAI.")
            
    except Exception as e:
        print(f"Error communicating with OpenAI: {e}")
        raise e