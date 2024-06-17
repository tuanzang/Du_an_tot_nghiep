import React from 'react';

const CartPage: React.FC = () => {
    // Mảng sản phẩm giả lập
    const products = [
        {
            id: 1,
            name: 'Diamond Exclusive Ornament',
            price: 295.00,
            quantity: 1,
            image: 'https://cdn.pnj.io/images/detailed/113/SBXMXMW000055-SMXMXMW000038-SNXMXMW000053-SVXMXMW000013.png'
        },
        {
            id: 2,
            name: 'Perfect Diamond Jewelry',
            price: 275.00,
            quantity: 2,
            image: 'https://cdn.pnj.io/images/detailed/137/bo-trang-suc-bac-dinh-da-pnjsilver-hoa-cua-me-00063-00122.png'
        },
        {
            id: 3,
            name: 'Handmade Golden Necklace',
            price: 295.00,
            quantity: 1,
            image: 'https://esme.vn/wp-content/uploads/2024/02/025142-18d8366f-29c9-4b55-9f76-9530e7c163ec-1.jpg'
        },
        {
            id: 4,
            name: 'Diamond Exclusive Ornament',
            price: 110.00,
            quantity: 3,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqUWpqiqN6W6flokBYWxTLMlQmfXyg6AplMA&s'
        }
    ];

    // Tính tổng tiền
    const subTotal = products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    const shipping = 70;
    const total = subTotal + shipping;

    return (
        <main>
            {/* breadcrumb area start */}
            <div className="breadcrumb-area">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="breadcrumb-wrap">
                                <nav aria-label="breadcrumb">
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="index.html"><i className="fa fa-home"></i></a></li>
                                        <li className="breadcrumb-item"><a href="shop.html">shop</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">cart</li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* breadcrumb area end */}

            {/* cart main wrapper start */}
            <div className="cart-main-wrapper section-padding">
                <div className="container">
                    <div className="section-bg-color">
                        <div className="row">
                            <div className="col-lg-12">
                                {/* Cart Table Area */}
                                <div className="cart-table table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th className="pro-thumbnail">Thumbnail</th>
                                                <th className="pro-title">Product</th>
                                                <th className="pro-price">Price</th>
                                                <th className="pro-quantity">Quantity</th>
                                                <th className="pro-subtotal">Total</th>
                                                <th className="pro-remove">Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(product => (
                                                <tr key={product.id}>
                                                    <td className="pro-thumbnail"><a href="#"><img className="img-fluid" src={product.image} alt="Product" /></a></td>
                                                    <td className="pro-title"><a href="#">{product.name}</a></td>
                                                    <td className="pro-price"><span>${product.price.toFixed(2)}</span></td>
                                                    <td className="pro-quantity">
                                                        <div className="pro-qty"><input type="text" defaultValue={product.quantity.toString()} /></div>
                                                    </td>
                                                    <td className="pro-subtotal"><span>${(product.price * product.quantity).toFixed(2)}</span></td>
                                                    <td className="pro-remove"><a href="#"><i className="fa fa-trash-o"></i></a></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Cart Update Option */}
                                <div className="cart-update-option d-block d-md-flex justify-content-between">
                                    <div className="apply-coupon-wrapper">
                                        <form action="#" method="post" className="d-block d-md-flex">
                                            <input type="text" placeholder="Enter Your Coupon Code" required />
                                            <button className="btn btn-sqr">Apply Coupon</button>
                                        </form>
                                    </div>
                                    <div className="cart-update">
                                        <a href="#" className="btn btn-sqr">Update Cart</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-5 ml-auto">
                                {/* Cart Calculation Area */}
                                <div className="cart-calculator-wrapper">
                                    <div className="cart-calculate-items">
                                        <h6>Cart Totals</h6>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                        <td>Sub Total</td>
                                                        <td>${subTotal.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Shipping</td>
                                                        <td>${shipping.toFixed(2)}</td>
                                                    </tr>
                                                    <tr className="total">
                                                        <td>Total</td>
                                                        <td className="total-amount">${total.toFixed(2)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <a href="checkout.html" className="btn btn-sqr d-block">Proceed Checkout</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* cart main wrapper end */}
        </main>
    );
}

export default CartPage;
