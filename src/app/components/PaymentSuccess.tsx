import React from "react";
import { FiCheck } from "react-icons/fi";

const PaymentSuccess: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <div className="text-center space-y-6">
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
      <FiCheck className="w-8 h-8 text-green-600" />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Payment Successful!
      </h3>
      <p className="text-gray-600">
        Thank you for your purchase. You will receive a confirmation email
        shortly.
      </p>
    </div>
    <button
      onClick={onReset}
      className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      Make Another Purchase
    </button>
  </div>
);
export default PaymentSuccess;