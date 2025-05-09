type BillingAddress = {
    phone_number: string,
    country_code: string,
    first_name: string,
}

type SubscriptionDetails = {
  start_date: string,
  end_date: string,
  frequency: string,
}

export type PaymentPayload = {
  // payment fields
  id: string;
  currency: string;
  amount: Number;
  description?: string;
  callback_url: string;
  redirect_mode: string;
  notification_id: string;
  branch: string;
  billing_address: BillingAddress,
  account_number: string;
  subscription_details: SubscriptionDetails;
};

export type TokenRequestPayload = {
  consumer_key: string;
  consumer_secret: string;
};
