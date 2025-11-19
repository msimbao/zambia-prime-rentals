interface LencoPaymentConfig {
  key: string;
  reference: string;
  email: string;
  amount: number;
  currency?: string;
  channels?: string[];
  customer?: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  onSuccess: (response: any) => void;
  onClose: () => void;
  onConfirmationPending: () => void;
}

interface Window {
  LencoPay?: {
    getPaid: (config: LencoPaymentConfig) => void;
  };
}
