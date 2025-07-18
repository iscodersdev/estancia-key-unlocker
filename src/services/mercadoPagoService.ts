
import api from './api';

// MercadoPago API configuration - PRODUCCIÓN
const MERCADOPAGO_API_URL = 'https://api.mercadopago.com';
const ACCESS_TOKEN = 'APP_USR-6970704078750427-070814-0cef27831c8307f19d4fbc9441c4711c-1072823803';
const PUBLIC_KEY = 'APP_USR-456eb884-5ea3-4fbb-a465-699dac15b2d6';

export interface PaymentItem {
  title: string;
  quantity: number;
  unit_price: number;
}

export interface PaymentPreference {
  items: PaymentItem[];
  payment_methods: {
    excluded_payment_types: Array<{ id: string }>;
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: string;
  default_payment_method_id: string;
  external_reference?: string;
}

export interface PaymentPreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export const createPaymentPreference = async (
  montoAdeudado: string,
  uat: string
): Promise<PaymentPreferenceResponse> => {
  try {
    console.log('Creando preferencia de pago para monto original:', montoAdeudado);
    
    // HARDCODE TEMPORAL PARA PRUEBAS - MONTO FIJO $100
    const montoNumerico = 100;
    
    // TODO: DESCOMENTAR ESTAS LÍNEAS CUANDO TERMINEN LAS PRUEBAS
    // // Convertir el monto adeudado a número (formato argentino: coma como decimal)
    // const montoLimpio = montoAdeudado.replace('$', '').replace(',', '.');
    // const montoNumerico = parseFloat(montoLimpio);
    
    console.log('Monto procesado (HARDCODED):', montoNumerico);
    
    const preference: PaymentPreference = {
      items: [
        {
          title: "Pago de deuda - Tarjeta Estancias",
          quantity: 1,
          unit_price: montoNumerico
        }
      ],
      payment_methods: {
        excluded_payment_types: [
          { "id": "credit_card" },
          { "id": "debit_card" },
          { "id": "prepaid_card" },
          { "id": "ticket" },
          { "id": "atm" },
          { "id": "mercadopago_cc" }
        ]
      },
      back_urls: {
        success: `${window.location.origin}/pago-exitoso?uat=${encodeURIComponent(uat)}`,
        failure: `${window.location.origin}/pago-fallido?uat=${encodeURIComponent(uat)}`,
        pending: `${window.location.origin}/pago-fallido?uat=${encodeURIComponent(uat)}`
      },
      auto_return: "approved",
      default_payment_method_id: "account_money",
      external_reference: uat
    };

    console.log('Preference data con wallet por defecto:', preference);
    console.log('Método de pago por defecto:', preference.default_payment_method_id);

    // Crear la preferencia de pago en MercadoPago
    const response = await fetch(`${MERCADOPAGO_API_URL}/checkout/preferences`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error response from MercadoPago:', errorData);
      throw new Error(`Error creating payment preference: ${response.status}`);
    }

    const data = await response.json();
    console.log('Payment preference created successfully con wallet por defecto:', data);
    
    return data;
  } catch (error) {
    console.error('Error creating payment preference:', error);
    throw error;
  }
};

export const redirectToPayment = (preferenceResponse: PaymentPreferenceResponse) => {
  // Usar init_point para producción (no sandbox_init_point)
  const paymentUrl = preferenceResponse.init_point;
  
  console.log('Redirecting to payment (solo wallet):', paymentUrl);
  
  // Abrir en nueva ventana o redireccionar
  window.open(paymentUrl, '_blank');
};
