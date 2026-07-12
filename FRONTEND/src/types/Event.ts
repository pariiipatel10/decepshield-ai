export interface Event {
  timestamp: string;
  ip: string;
  username: string;
  password: string;
  event_type: string;
  risk_score: number;
}
