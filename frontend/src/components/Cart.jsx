import React, { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { useCart } from './CartContext';
import { useSelector } from 'react-redux';
import Paypal from './paypal';

function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { userInfo } = useSelector((state) => state.auth);
  const [isPaymentstarted, setisPaymentstarted] = useState(false);
  console.log(userInfo)
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  function Handleonclickpay(){
    setisPaymentstarted(true)
  }
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      if (isNaN(value) || value <= 0){
                        updateQuantity(item.id, 1) //Reset to 1 in invalid case
                      } else{
                        updateQuantity(item.id, value) //Update with a valid value
                      }
                    }}
                    className="w-16 text-center no-spin"
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "textfield",
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold">${calculateTotal()}</span>
            </div>
            {isPaymentstarted ? (<Paypal value={calculateTotal()}/>) :(
            <Button className="w-full bg-pink-600" onClick={Handleonclickpay}>Proceed to Checkout</Button>)}
          </div>
        </>
      )}
    </div>
  )
}

export default Cart

