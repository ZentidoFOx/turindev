// Interfaces
export interface Actress {
    id: string;
    name: string;
    slug: string;
    image: string;
    bio: string;
    birthDate: string;
    birthPlace: string;
    height: string;
    featured: boolean;
}

export interface ApiResponse {
    success: boolean;
    data: Actress[];
    count: number;
}

// API URL base
const API_URL = 'https://ensalud.info/generator';

// Opciones por defecto para los fetch
const defaultOptions = {
    headers: {
        'Accept': 'application/json',
        'User-Agent': 'turin.dev'
    }
};

/**
 * Obtiene la lista de actrices desde la API
 * @returns Promise<ApiResponse>
 */
export async function getActresses(): Promise<ApiResponse> {
    try {
        const response = await fetch(`${API_URL}/api-actriz.php`, defaultOptions);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching actresses:', error);
        // Retornamos una respuesta vacía en caso de error
        return {
            success: false,
            data: [],
            count: 0
        };
    }
}

/**
 * Obtiene una actriz por su ID
 * @param id ID de la actriz
 * @returns Promise<Actress | null>
 */
export async function getActressById(id: string): Promise<Actress | null> {
    try {
        const response = await fetch(`${API_URL}/api-actriz.php?id=${id}`, defaultOptions);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        return data.data[0] || null;
    } catch (error) {
        console.error(`Error fetching actress with id ${id}:`, error);
        return null;
    }
}