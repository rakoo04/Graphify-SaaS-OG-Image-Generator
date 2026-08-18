
export interface BrandSettings {
  name: string;
  headline: string;
  primaryColor: string;
  logoBase64?: string;
  logoMimeType?: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  settings: BrandSettings;
  timestamp: number;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

/**
 * Interface representing the AI Studio global object.
 * This is used for API key management within the environment.
 */
export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    /**
     * The aistudio property is pre-configured in the execution context.
     * Using the AIStudio type explicitly to satisfy TypeScript requirements for identical declarations.
     */
    aistudio: AIStudio;
  }
}
