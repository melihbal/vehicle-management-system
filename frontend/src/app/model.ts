export interface Vehicle {
    aracId: number;
    aracPlaka: string;
    hiz: number;
    kmSayaci: number;
    veriTarihi: string;
  }

export interface User {
  username: string;
  email: string;
  password: string;
}

export interface UserDisplay {
  id: number;
  username: string;
  email: string;
  role: string;
}