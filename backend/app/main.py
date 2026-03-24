from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from app.models.schemas import ArchitectureCritique
from app.services.llm_engine import analyze_architecture_with_llm
from app.services.rag_service import retrieve_relevant_patterns
from app.services.vision_parser import extract_architecture_from_image

app = FastAPI(title="AI Architecture Reviewer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# We use Form() and File() here to handle multipart/form-data
@app.post("/api/v1/analyze", response_model=ArchitectureCritique)
async def process_design(
    description: Optional[str] = Form(None, description="Text description of the architecture"), 
    diagram: Optional[UploadFile] = File(None, description="Image of the architecture diagram")
):
    """
    Unified endpoint to analyze an architecture from text, an image, or both.
    """
    if not description and not diagram:
        raise HTTPException(status_code=400, detail="Must provide either a description or a diagram.")

    normalized_text = ""

    # Step 1: Normalize Input (Extract text from image if provided)
    # Step 1: Normalize Input (Extract text from image if provided)
    if diagram:
        # FIX: Check if content_type is None before checking what it starts with
        if diagram.content_type is None or not diagram.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Uploaded file must be a valid image format.")
            
        extracted_text = await extract_architecture_from_image(diagram)
        normalized_text += f"Extracted from diagram:\n{extracted_text}\n\n"

    # Step 2: Combine with manual description (if user provided both)
    if description:
        normalized_text += f"User provided description:\n{description}"

    try:
        # Step 3: RAG Retrieval
        rag_context = retrieve_relevant_patterns(normalized_text)
        
        # Step 4: Critique Engine
        critique = await analyze_architecture_with_llm(
            description=normalized_text,
            rag_context=rag_context
        )
        return critique
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))