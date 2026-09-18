export interface ISovereigntyIsland {
  id: string;
  name: string;
  subName: string;
  adminUnit: string;
  lat: number;
  lng: number;
}

export const SOVEREIGNTY_ISLANDS: ISovereigntyIsland[] = [
  {
    id: 'hoang-sa',
    name: 'Quần đảo Hoàng Sa (Việt Nam)',
    subName: 'Paracel Islands',
    adminUnit: 'Huyện Hoàng Sa, TP. Đà Nẵng',
    lat: 16.5388,
    lng: 111.6042,
  },
  {
    id: 'truong-sa',
    name: 'Quần đảo Trường Sa (Việt Nam)',
    subName: 'Spratly Islands',
    adminUnit: 'Huyện Trường Sa, Tỉnh Khánh Hòa',
    lat: 8.6444,
    lng: 111.9192,
  },
];
