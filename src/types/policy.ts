export type PolicyId =
  | 'terms'
  | 'privacy'
  | 'regulations'
  | 'refund'
  | 'dispute'
  | 'baggage'
  | 'insurance';

export interface IPolicySection {
  title: string;
  content: string[];
  note?: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface IPolicyItem {
  id: PolicyId;
  title: string;
  shortTitle: string;
  category: 'core' | 'operation';
  badge: string;
  iconName: 'FileText' | 'ShieldCheck' | 'BookOpen' | 'RefreshCw' | 'AlertCircle' | 'Luggage' | 'ShieldAlert';
  lastUpdated: string;
  summary: string;
  sections: IPolicySection[];
}
