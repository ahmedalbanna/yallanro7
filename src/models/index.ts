export type UserRole = 'client' | 'host' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  role: UserRole;
  phoneNumber?: string;
  bio?: string; // for hosts
}

export interface Experience {
  experienceId: string;
  title: string;
  description: string;
  activities: string[];
  images: string[]; // Data URLs or external URLs
  price: number;
  currency: string;
  duration: string; // e.g., "ساعتان", "نصف يوم"
  maxGuests: number;
  location: { lat: number; lng: number }; // LatLng
  address: string;
  city: string;
  categoryRef: string; // categoryId (or name for display)
  hostRef: string; // userId of host
  availableDates: string[]; // ISO date strings "YYYY-MM-DD"
  availableTimes: string[]; // e.g., ["10:00", "14:00"] in HH:mm format
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  bookingId: string;
  experienceRef: string; // experienceId
  clientRef: string; // userId of client
  hostRef: string; // userId of host
  bookingDate: Date; // specific date of booking
  bookingTime: string; // specific time of booking
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'refunded' | 'pending' | 'paid' | 'failed';
  paymentDetails?: Record<string, any>;
  createdAt: Date;
}

export interface Category {
  categoryId: string;
  name: string;
  iconUrl?: string; // Corresponds to a key in iconMap (e.g., "Activity", "CookingPot")
}

export interface City {
  cityId: string;
  name: string;
}

export interface Message {
  messageId: string;
  senderRef: string; // userId
  receiverRef: string; // userId
  bookingRef?: string; // bookingId
  content: string;
  timestamp: Date;
  type?: 'text' | 'file_upload_pending' | 'image_upload_pending' | 'location_shared' | 'audio';
  fileName?: string;
  mediaUrl?: string; // Can be blob URL for pending, or data URL / server URL for sent
  duration?: number; // For audio messages, in seconds
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  type: 'booking' | 'message' | 'experience_update' | 'system_alert' | 'new_feature';
  link?: string; // Optional link to related content
  icon?: React.ElementType; // Optional: specific icon component
}
