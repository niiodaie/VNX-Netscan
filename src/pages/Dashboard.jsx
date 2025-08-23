import React from "react";

export default function Dashboard({ cart }) {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h2 className="text-2xl md:text-3xl font-bold text-center">Your Dashboard</h2>
      <p className="text-neutral-600 mt-2 text-center">Track your recent orders and saved items.</p>

      <div className="mt-8">
        <h3 className="font-semibold text-xl">Recent Orders</h3>
        <div className="mt-4 border border-neutral-200 rounded-2xl overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Items</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">#VP001</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">2025-07-20</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">2 items</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">Pending Proof</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">$1,250.00</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">#VP002</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">2025-07-10</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">1 item</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Shipped</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">$350.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-semibold text-xl">Saved Items ({cart.length})</h3>
        {cart.length === 0 ? (
          <p className="mt-4 text-neutral-600">You haven't saved any items yet. Add products to your quote to see them here!</p>
        ) : (
          <div className="mt-4 border border-neutral-200 rounded-2xl overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Method</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {cart.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{item.product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{item.qty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{item.method}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">${(item.product.price * item.qty).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

