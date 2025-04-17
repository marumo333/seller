import React, { ChangeEvent } from "react";
import {useState,useEffect} from "react";

interface EditShop{
    stock:string;
    price:string;
}
export default function ShopEdit(){
    const [edit,setEdit] = useState<EditShop[]>([]);
    const [stock,setStock] = useState<string>("");
    const [price,setPrice] = useState<string>("");
    const handleStockChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.value && e.target.value.length > 0) {
          setStock(e.target.value);
        }
      }
      const handlePriceChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.value && e.target.value.length > 0) {
          setPrice(e.target.value);
        }
      }
    return(
        <>
        <form className="mb-4 text-center" onSubmit={onSubmit}>
            <input
              type="text"
              id="formStock"
              onChange={handleStockChange}
              placeholder="在庫数を変更"
              className="mb-2 border rounded p-2 w-full"
              value={stock}
            />
            <input
              type="text"
              id="formStock"
              onChange={handlePriceChange}
              placeholder="商品の価格を編集(税抜)"
              className="mb-2 border rounded p-2 w-full"
              value={price}
            />
        </form>
        <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 disabled:opacity-50"
            >
              送信
            </button>
        </>
    )
}