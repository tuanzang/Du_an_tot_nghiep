// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Card, Button, Form, Radio, message, Table } from 'antd';
// import QRCode from 'qrcode.react';
// import "./Payment.css"
// interface CartPageState {
//   products: {
//     id: number;
//     name: string;
//     price: number;
//     quantity: number;
//     image: string;
//   }[];
//   subTotal: number;
//   shipping: number;
//   total: number;
// }

// const Payment: React.FC = () => {
//   const [products, setProducts] = useState<CartPageState['products']>([]);
//   const [subTotal, setSubTotal] = useState<number>(0);
//   const [shipping, setShipping] = useState<number>(0);
//   const [total, setTotal] = useState<number>(0);
//   const [paymentMethod, setPaymentMethod] = useState<string>('cod');
//   const [qrValue, setQrValue] = useState<string>('');

//   // Mock useEffect to simulate data fetching
//   useEffect(() => {
//     // Simulate fetching data from CartPage
//     const mockData: CartPageState = {
//       products: [
//         {
//           id: 1,
//           name: 'Diamond Exclusive Ornament',
//           price: 295.0,
//           quantity: 1,
//           image:
//             'https://cdn.pnj.io/images/detailed/113/SBXMXMW000055-SMXMXMW000038-SNXMXMW000053-SVXMXMW000013.png',
//         },
//         {
//           id: 2,
//           name: 'Perfect Diamond Jewelry',
//           price: 275.0,
//           quantity: 2,
//           image:
//             'https://cdn.pnj.io/images/detailed/137/bo-trang-suc-bac-dinh-da-pnjsilver-hoa-cua-me-00063-00122.png',
//         },
//       ],
//       subTotal: 895,
//       shipping: 70,
//       total: 965,
//     };

//     // Set data to state
//     setProducts(mockData.products);
//     setSubTotal(mockData.subTotal);
//     setShipping(mockData.shipping);
//     setTotal(mockData.total);
//   }, []);

//   const handleGenerateQR = () => {
//     if (total && total > 0) {
//       // Replace with actual VNPAY QR code generation logic
//       const vnpayUrl = `https://sandbox.vnpayment.vn/merchant_webapi/qr?amount=${total}&vnp_Amount=${total * 100}&vnp_BankCode=NCB`;
//       setQrValue(vnpayUrl);
//       message.success('VNPAY QR code generated successfully');
//     } else {
//       message.error('Please enter a valid amount');
//     }
//   };

//   const handlePayment = () => {
//     if (paymentMethod === 'qr' && total && total > 0) {
//       handleGenerateQR();
//     } else if (paymentMethod === 'cod') {
//       message.success('Order placed successfully with Cash on Delivery');
//     } else {
//       message.error('Please enter a valid amount');
//     }
//   };

//   const columns = [
//     {
//       title: 'Product',
//       dataIndex: 'name',
//       key: 'name',
//       render: (text: string, record: any) => (
//         <span>
//           <img src={record.image} alt={text} style={{ width: '50px', marginRight: '10px' }} />
//           {text}
//         </span>
//       ),
//     },
//     {
//       title: 'Price',
//       dataIndex: 'price',
//       key: 'price',
//       render: (price: number) => <span>${price.toFixed(2)}</span>,
//     },
//     {
//       title: 'Quantity',
//       dataIndex: 'quantity',
//       key: 'quantity',
//     },
//     {
//       title: 'Total',
//       dataIndex: 'total',
//       key: 'total',
//       render: (text: string, record: any) => (
//         <span>${(record.price * record.quantity).toFixed(2)}</span>
//       ),
//     },
//   ];

//   const data = products.map(product => ({
//     key: product.id,
//     name: product.name,
//     price: product.price,
//     quantity: product.quantity,
//     total: product.price * product.quantity,
//     image: product.image,
//   }));

//   return (
//     <main>
//       <div className="breadcrumb-area">
//         <div className="container">
//           <div className="row">
//             <div className="col-12">
//               <div className="breadcrumb-wrap">
//                 <nav aria-label="breadcrumb">
//                   <ol className="breadcrumb">
//                     <li className="breadcrumb-item">
//                       <Link to="/">
//                         <i className="fa fa-home"></i>
//                       </Link>
//                     </li>
//                     <li className="breadcrumb-item">
//                       <Link to="/shop">shop</Link>
//                     </li>
//                     <li className="breadcrumb-item active" aria-current="page">
//                       payment
//                     </li>
//                   </ol>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="payment-main-wrapper section-padding">
//         <div className="container">
//           <div className="section-bg-color">
//             <div className="row">
//               <div className="col-lg-8">
//                 <Card title="Order Summary" bordered={false}>
//                   <Table columns={columns} dataSource={data} pagination={false} className="order-summary-table" />
//                   <div className="order-total-section">
//                     <p className="order-total">Subtotal: ${subTotal.toFixed(2)}</p>
//                     <p className="order-total">Shipping: ${shipping.toFixed(2)}</p>
//                     <p className="order-total">Total: ${total.toFixed(2)}</p>
//                   </div>
//                 </Card>
//               </div>
//               <div className="col-lg-4">
//                 <Card title="Payment" bordered={false}>
//                   <Form layout="vertical" className="payment-method">
//                     <Form.Item label="Payment Method">
//                       <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
//                         <Radio value="cod">Cash on Delivery (COD)</Radio>
//                         <Radio value="qr">QR Code Payment</Radio>
//                       </Radio.Group>
//                     </Form.Item>
//                     <Form.Item>
//                       <Button type="primary" onClick={handlePayment} className="proceed-button">
//                         Proceed to Payment
//                       </Button>
//                     </Form.Item>
//                   </Form>
//                   {qrValue && paymentMethod === 'qr' && (
//                     <div className="qr-code-section">
//                       <QRCode value={qrValue} size={256} />
//                       <p className="qr-instruction">Scan this QR code to make the payment</p>
//                     </div>
//                   )}
//                 </Card>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Payment;