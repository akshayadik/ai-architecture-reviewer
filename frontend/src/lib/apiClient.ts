// src/lib/apiClient.ts
import axios from 'axios';
import { ArchitectureCritique } from '../types/critique';

// Assuming your FastAPI server is running on port 8000 locally
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const analyzeArchitecture = async (
  description?: string,
  diagram?: File
): Promise<ArchitectureCritique> => {
  const formData = new FormData();

  if (description) {
    formData.append('description', description);
  }
  
  if (diagram) {
    formData.append('diagram', diagram);
  }

  try {
    const response = await axios.post<ArchitectureCritique>(
      `${API_BASE_URL}/api/v1/analyze`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error analyzing architecture:', error);
    throw new Error('Failed to analyze architecture. Please try again.');
  }
};