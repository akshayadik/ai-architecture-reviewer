from pydantic import BaseModel, Field
from typing import List, Optional

class ArchitectureCritique(BaseModel):
    """
    The core output schema. OpenAI will use the descriptions in the Field 
    parameters to understand exactly what kind of data to generate.
    """
    summary: str = Field(
        ..., 
        description="A concise interpretation of the provided system design in your own words."
    )
    bottlenecks: List[str] = Field(
        ..., 
        description="Identify specific DB hotspots, single points of failure, or tight coupling."
    )
    scalability_risks: List[str] = Field(
        ..., 
        description="Highlight horizontal scaling limits, throughput ceilings, or state management issues."
    )
    reliability_gaps: List[str] = Field(
        ..., 
        description="Point out missing retry mechanisms, dead letter queues (DLQs), or fallback strategies."
    )
    cost_red_flags: List[str] = Field(
        ..., 
        description="Identify over-engineering, unoptimized queries, or inefficient infrastructure choices."
    )
    suggested_improvements: List[str] = Field(
        ..., 
        description="Actionable, concrete architectural changes to resolve the identified issues."
    )
    confidence_score: int = Field(
        ..., 
        ge=1, 
        le=100, 
        description="A confidence score between 1 and 100 representing how certain you are in this critique."
    )
    reasoning: str = Field(
        ..., 
        description="A brief explanation of why this specific critique and score were generated."
    )

class AnalyzeTextRequest(BaseModel):
    """
    Use this schema if the user only submits a text/JSON description without an image.
    Note: For image uploads, FastAPI's `UploadFile` is used directly in the router instead of Pydantic.
    """
    description: str = Field(
        ..., 
        description="The raw text, markdown, or JSON describing the system architecture."
    )