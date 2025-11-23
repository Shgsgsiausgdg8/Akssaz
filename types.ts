export enum Sender {
  User = 'USER',
  Bot = 'BOT'
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  text?: string;
  image?: string; // Base64 string
  timestamp: Date;
  isError?: boolean;
}

export interface GenerationConfig {
  aspectRatio: string;
}