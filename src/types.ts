export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  longDescription: string;
  image: string;
  accentColor: string;
  tags: string[];
  client: string;
  scope: string[];
  link?: string;
}

export interface Sticker {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  type: 'sticker' | 'stamp' | 'badge';
  value: string; // Emoji or word
  color: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}
