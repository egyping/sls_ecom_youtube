// src/OrderHistory.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderHistory.css';

interface Item {
  count: number;
  size: number;
  id: string;
}

interface Order {
  id: string; 
  dateCreated: number;
  userEmail: string;
  userId: string;
  status: string;
  items: Item[];
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<Order[]>('https://0ewzvgg7x8.execute-api.us-east-1.amazonaws.com/dev/users/f974f7ea-ffc0-40cd-84d3-4cae5e70c634');
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-history">
      <h2>Order History</h2>
      <div className="grid-container">
        {orders.map((order) => (
          <div key={order.id} className="grid-row">
            <div className="grid-cell">{new Date(order.dateCreated).toLocaleDateString()}</div>
            <div className="grid-cell">{order.status}</div>
            <div className="grid-cell">
              {order.items.map((item) => (
                <div key={item.id}>
                  {item.count} x Size {item.size}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;