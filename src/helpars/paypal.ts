import axios from "axios";
import config from "../config";

export const getPayPalToken = async () => {
  const response = await axios.post(
    `${config.paypal.base_url}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: {
        username: config.paypal.client as string,
        password: config.paypal.secret as string,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
};

// Create a PayPal Order
export const createOrder = async (amount: string, userId: string) => {
  const accessToken = await getPayPalToken();
  const orderResponse = await axios.post(
    `${config.paypal.base_url}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
      application_context: {
        return_url: `http://localhost:3000/payment/payment-success?userId=${userId}`,
        cancel_url: `http://localhost:3000/payment/payment-cancel`,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return {
    orderId: orderResponse.data.id,
    approvalLink: orderResponse.data.links.find(
      (link: any) => link.rel === "approve"
    )?.href,
  };
};

// Capture PayPal Payment
export const captureOrder = async (orderId: string) => {
  const accessToken = await getPayPalToken();

  const captureResponse = await axios.post(
    `${config.paypal.base_url}/v2/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return captureResponse.data;
};
