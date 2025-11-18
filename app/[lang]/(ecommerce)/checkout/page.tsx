"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useCart } from "@/components/Ecommerce/context/cartContext";

interface FormData {
  email: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

const CheckoutPage: React.FC = () => {
  const { items, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    // If the cart is empty and an order hasn't just been placed,
    // the user shouldn't be on the checkout page. Redirect to cart.
    if (items.length === 0 && !orderPlaced) {
      window.location.hash = "/cart";
    }
  }, [items, orderPlaced]);

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.name) newErrors.name = "Full Name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.postalCode) newErrors.postalCode = "Postal Code is required";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        clearCart();
        setOrderPlaced(true);
        setIsSubmitting(false);
      }, 2000);
    }
  };
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (orderPlaced) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">Thank you for your order!</h2>
        <p className="text-gray-600 mt-2">Your order has been placed successfully.</p>
        <Button href="/products" label="Continue Shopping" />
      </div>
    );
  }

  // While redirecting, or if cart is empty, render nothing.
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
      <div className="md:col-span-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              <div className="flex-1">
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
              </div>
            </div>
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-center block rounded-md bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {isSubmitting ? "Processing..." : `Place Order ($${totalPrice.toFixed(2)})`}
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
        <ul className="divide-y divide-gray-200 my-4">
          {items.map((item) => (
            <li key={item.id} className="flex py-4">
              {/* <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-md object-cover" /> */}
              <div className="ml-4 flex flex-1 justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-base font-medium text-gray-900">
            <p>Order total</p>
            <p>${totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
