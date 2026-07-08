export interface CreateSubscriptionInput {
  date: string;
  time_id: number;
  phone_number: string;
  note?: string;
}

export interface TimeResource {
  id: number;
  work_time: string;
  created_at: string | null;
  subscriptions?: any[];
}
export interface SubscriptionResource {
  id: number;
  status: 'pending' | 'active' | 'canceled';
  note: string | null;
  phone_number: string;
  time_id: number;
  date: string;
  time?: TimeResource;
  created_at: string;
}


export interface ApiResponse<T> {
  data: T;
}