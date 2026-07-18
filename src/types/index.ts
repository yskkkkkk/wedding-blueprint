export interface Person {
  name: string;
  relation: string;
  phone?: string;
  bank?: {
    name: string;
    accountNumber: string;
    holder: string;
  };
  tossLink?: string;
  kakaopayLink?: string;
}

export interface InvitationData {
  id: string;
  slug: string;
  groom: Person;
  bride: Person;
  groomParents: { father: Person; mother: Person };
  brideParents: { father: Person; mother: Person };
  weddingDate: string; // ISO 8601 string or specific format
  location: {
    name: string;
    address: string;
    detailAddress?: string;
    latitude: number;
    longitude: number;
    contact?: string;
  };
  greeting: {
    title: string;
    content: string;
  };
  coverImage: string;
  galleryImages: string[];
}

export interface GuestbookEntry {
  id: string;
  invitation_slug: string;
  name: string;
  password?: string; // We might not fetch password to frontend for security, but we need it for inserting
  content: string;
  created_at: string;
}
