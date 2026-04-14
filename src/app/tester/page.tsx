"use client";

import { useState } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { FiShoppingCart } from "react-icons/fi";

// These components should be created in Task 4
import PaymentSuccess from "@/src/app/components/PaymentSuccess";
import PaymentForm from "@/src/app/components/PaymentForm";

// Make sure to place your publishable key in your .env.local file
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Dummy product data
const product = {
  id: "prod_premium_coffee_01",
  name: "Celestial Coffee Blend",
  description: "A rich, aromatic blend of hand-picked beans from the high mountains of Colombia.",
  price: 2999, // $29.99 represented in cents
  image: "https://media.istockphoto.com/id/1176056830/vector/kawaii-coffee-cup-character-in-fun-action.jpg?s=612x612&w=0&k=20&c=1_CrqNkKur2-UUkdC8dXT4LAjrcopiSEcDqxTSKYlt8=",
};

// Main App Component
export default function HomePage() {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleBuyNow = async () => {
    // We already fetch the client secret inside the PaymentForm component
    setShowPayment(true);
  };

  const handleReset = () => {
    setShowPayment(false);
    setPaymentSuccess(false);
  };
  
  const options: StripeElementsOptions | undefined = clientSecret ? { clientSecret } : undefined;

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <PaymentSuccess onReset={handleReset} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {!showPayment ? (
            // Product Display View
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 md:h-full object-cover"
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+Not+Found'; }}
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h2>
                <p className="text-gray-600 mb-6">{product.description}</p>
                <div className="flex items-baseline justify-between mb-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${(product.price / 100).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 flex items-center justify-center space-x-2 text-lg"
                >
                  <FiShoppingCart className="w-6 h-6" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          ) : (
            // Payment Form View
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg shadow-md"
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80/e2e8f0/64748b?text=Img'; }}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    ${(product.price / 100).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <Elements stripe={stripePromise}>
                <PaymentForm
                  product={product}
                  onSuccess={() => setPaymentSuccess(true)}
                />
              </Elements>

              <button
                onClick={() => setShowPayment(false)}
                className="mt-6 text-center w-full text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">Use the following test card:</p>
          <p className="text-xs font-mono text-gray-600">Card: 4242 4242 4242 4242 | Exp: Any future date | CVC: 123</p>
        </div>
      </div>
    </div>
  );
}