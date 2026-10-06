import { createApiUrl, getHeaders } from './api';

export const fetchEducationUpdates = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    });

    const url = createApiUrl(`/education-updates?${searchParams.toString()}`);
    const res = await fetch(url, { headers: getHeaders() });
    
    if (!res.ok) {
      throw new Error('Failed to fetch education updates');
    }

    const data = await res.json();
    return {
      items: data.data || [],
      meta: data.meta || null
    };
  } catch (error) {
    console.error('Error fetching education updates:', error);
    return { items: [] };
  }
};
