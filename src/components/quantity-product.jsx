import React, { useEffect, useState } from "react"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { cartItemsState } from "../recoil/order"
import { useRecoilState } from "recoil"
import { productState } from "../recoil/product"

const QuantityProduct = ({changeQuantity, quantity}) => {
  const [count, setCount] = useState(quantity)

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count == 1) return
    setCount(count - 1);
  };
  
  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setCount(value);
    }
  };

  useEffect(() => {
    changeQuantity(count)
  }, [count])

  return (
    <div className="btn-quantity">
      <button className={`btn-minus ${count == 1 ? 'btn-disable' : ''}`} onClick={decrement}>
        <MinusOutlined />
      </button>
      <input onChange={handleChange} type="number" className="quantity" value={count} />
      <button className="btn-plus" onClick={increment}>
        <PlusOutlined />
      </button>
    </div>
  );
};

export default QuantityProduct;