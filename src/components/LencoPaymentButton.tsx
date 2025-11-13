import React, { useEffect, useState } from 'react';

// Custom hook that loads the script and returns the payment function
export const useLencoPay = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if LencoPay is already loaded
    if (window.LencoPay) {
      setScriptLoaded(true);
      return;
    }

    // Load the LencoPay script
    const script = document.createElement('script');
    script.src = 'https://pay.lenco.co/js/v1/inline.js';
    // For sandbox/testing, uncomment below:
    // script.src = 'https://pay.sandbox.lenco.co/js/v1/inline.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      console.error('Failed to load LencoPay script');
      setScriptLoaded(false);
    };
    
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initializePayment = ({
    publicKey,
    reference,
    email,
    amount,
    currency = "ZMW",
    channels = ["card", "mobile-money"],
    customer = { firstName: "", lastName: "", phone: "" },
    onSuccess = (res) => {},
    onClose = () => {},
    onConfirmationPending = () => {},
  }) => {
    if (!window.LencoPay) {
      alert("Payment system not loaded yet. Please wait or refresh the page.");
      return;
    }

    if (!publicKey || !email || !amount) {
      alert("Missing required payment information.");
      return;
    }

    window.LencoPay.getPaid({
      key: publicKey,
      reference: reference || 'ref-' + Date.now(),
      email,
      amount,
      currency,
      channels,
      customer,
      onSuccess: (response) => {
        alert('Payment complete! Reference: ' + response.reference);
        onSuccess(response);
      },
      onClose: () => {
        alert('Payment was not completed, window closed.');
        onClose();
      },
      onConfirmationPending: () => {
        alert('Your purchase will be completed when the payment is confirmed');
        onConfirmationPending();
      },
    });
  };

  return { initializePayment, scriptLoaded };
};

// Pre-built button component
const LencoPaymentButton = ({
  publicKey,
  reference,
  email,
  amount,
  currency = "ZMW",
  channels = ["card", "mobile-money"],
  customer = { firstName: "", lastName: "", phone: "" },
  onSuccess = (res) => {},
  onClose = () => {},
  onConfirmationPending = () => {},
  title = "Pay Now",
  backgroundColor = "#333",
  textColor = "#ffffff",
  className = "",
  disabled = false,
}) => {
  const { initializePayment, scriptLoaded } = useLencoPay();

  const handlePayment = () => {
    initializePayment({
      publicKey,
      reference,
      email,
      amount,
      currency,
      channels,
      customer,
      onSuccess,
      onClose,
      onConfirmationPending,
    });
  };

  return (
    <div className={`my-4 ${className}`}>
      <button
        onClick={handlePayment}
        disabled={!scriptLoaded || disabled}
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
        }}
        className={`
          w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg
          font-semibold text-xl transition-all duration-200
          shadow-lg hover:shadow-xl
          disabled:opacity-50 disabled:cursor-not-allowed
          ${scriptLoaded && !disabled ? 'hover:scale-105 active:scale-95' : ''}
        `}
      >
        {!scriptLoaded ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
            <span>Loading...</span>
          </>
        ) : (
          title
        )}
      </button>
      
      {!scriptLoaded && (
        <p className="mt-2 text-sm text-gray-500 text-center">
          Loading payment system...
        </p>
      )}
    </div>
  );
};

export default LencoPaymentButton;