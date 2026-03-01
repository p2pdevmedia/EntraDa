export type Role = 'CLIENT' | 'EVENT_MANAGER' | 'EVENT_RRPP' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  role: Role;
  walletAddress: string | null;
  resetToken?: string | null;
  resetTokenExp?: Date | null;
  averageRating?: number;
}

export interface TicketType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  saleStart: Date;
  saleEnd: Date;
}

export interface Event {
  id: number;
  name: string;
  date: Date;
  mercadoPagoAccount: string;
  posterUrl?: string;
  sliderUrl?: string;
  miniUrl?: string;
  managerId: number;
  ticketTypes: TicketType[];
}

export interface Ticket {
  id: number;
  ticketTypeId: number;
  email?: string;
  qrHash: string;
}

export interface Rating {
  id: number;
  value: number;
  raterId: number;
  eventId: number;
}

const store = {
  users: [] as User[],
  events: [] as Event[],
  tickets: [] as Ticket[],
  ratings: [] as Rating[],
  nextUserId: 1,
  nextEventId: 1,
  nextTicketTypeId: 1,
  nextTicketId: 1,
  nextRatingId: 1,
};

export function getStore() {
  return store;
}

export function clearStore() {
  store.users.length = 0;
  store.events.length = 0;
  store.tickets.length = 0;
  store.ratings.length = 0;
  store.nextUserId = 1;
  store.nextEventId = 1;
  store.nextTicketTypeId = 1;
  store.nextTicketId = 1;
  store.nextRatingId = 1;
}
