"use client";
import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Your order has been placed!");
      removeAll();
    }
    if (searchParams.get("canceled")) {
      toast.error("Something went wrong, please try again.");
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const onCheckout = async () => {
    try {
      console.log(
        "Product IDs:",
        items.map((item) => item.id)
      ); // Log product IDs
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          productIds: items.map((item) => item.id),
        }
      );
      console.log("Checkout response:", response.data); // Log the full response
      window.location = response.data.url;
    } catch (error) {
      console.error("Checkout error:", error); // Log the error for debugging
      if (axios.isAxiosError(error)) {
        // Check if it's an Axios error
        toast.error(
          error.response?.data?.message ||
            "There was an error processing your checkout. Please try again."
        ); // Notify the user with specific error message
      } else {
        toast.error("An unexpected error occurred. Please try again."); // General error message
      }
    }
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button
        disabled={items.length === 0}
        onClick={onCheckout}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
