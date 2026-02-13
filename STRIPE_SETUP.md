# Stripe Payment Integration Setup

This guide explains how to set up Stripe payment processing for product purchases.

## Prerequisites

1. **Install Stripe SDK**
   ```bash
   npm install stripe
   ```

2. **Stripe Account Setup**
   - Create a Stripe account at https://stripe.com
   - Get your API keys from the Stripe Dashboard:
     - Publishable Key (starts with `pk_`)
     - Secret Key (starts with `sk_`)
     - Webhook Secret (for production)

## Configuration Steps

### 1. Configure Stripe in Admin Panel

1. Navigate to **Admin → eCommerce → Payment Methods**
2. Click **Edit** on the Stripe payment method
3. Enter your Stripe credentials:
   - **Publishable Key**: `pk_test_...` (for testing) or `pk_live_...` (for production)
   - **Secret Key**: `sk_test_...` (for testing) or `sk_live_...` (for production)
   - **Webhook Secret**: `whsec_...` (optional, for webhook verification)
4. Check **Active** checkbox
5. Click **Save Changes**

### 2. Set Up Stripe Webhook (Production)

For production, you need to set up a webhook endpoint:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to the Stripe payment method configuration in the admin panel

### 3. Testing with Stripe Test Mode

Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future expiry date, any CVC, and any ZIP code

## How It Works

### Purchase Flow

1. **Employer clicks "Buy"** on a product
2. **Checkout page** (`/my-account/checkout`) creates a Stripe checkout session
3. **Redirect to Stripe** secure checkout page
4. **Customer completes payment** on Stripe
5. **Stripe redirects back** to success page (`/my-account/checkout/success`)
6. **Webhook handler** (`/api/webhooks/stripe`) processes payment confirmation
7. **Order status updated** to PAID
8. **Plan activated** for the employer

### API Endpoints

- **POST `/api/checkout/create-session`**: Creates Stripe checkout session
  - Body: `{ productId, employerId }`
  - Returns: `{ sessionId, url, orderId }`

- **GET `/api/checkout/verify`**: Verifies payment status
  - Query: `?session_id={CHECKOUT_SESSION_ID}`
  - Returns: `{ order, session }`

- **POST `/api/webhooks/stripe`**: Handles Stripe webhook events
  - Processes `checkout.session.completed` and `invoice.payment_succeeded`
  - Updates order status and activates plans

### Pages

- **`/my-account/checkout`**: Initiates checkout, redirects to Stripe
- **`/my-account/checkout/success`**: Success page after payment
- **`/my-account/checkout/cancel`**: Cancellation page

## Security Notes

- Secret keys are stored encrypted in the database
- Webhook signatures are verified to prevent unauthorized requests
- Payment method configuration is masked when retrieved via API
- Only active payment methods are used for checkout

## Troubleshooting

### "Stripe SDK is not installed"
Run: `npm install stripe`

### "Stripe secret key is not configured"
Add your Stripe secret key in Admin → eCommerce → Payment Methods → Edit Stripe

### Webhook not working
1. Check webhook URL is correct in Stripe Dashboard
2. Verify webhook secret is configured correctly
3. Check server logs for webhook errors
4. Ensure your server is accessible from the internet (for production)

### Payment succeeds but order not updated
1. Check webhook endpoint is configured
2. Verify webhook secret matches Stripe Dashboard
3. Check server logs for webhook processing errors
