/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  // notification,
} from "antd";
import { useMemo } from "react";
// import confirmStatus from "../../components/confirmSatus";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useCartMutation, { useMyCartQuery } from "../../hooks/useCart";
import { formatPrice } from "../../services/common/formatCurrency";

const { Text } = Typography;

export default function Cart() {
  const { data } = useMyCartQuery();
  const { mutate: onUpdateQuantity } = useCartMutation({
    action: "UPDATE",
  });
  const { mutate: onDeleteProduct } = useCartMutation({
    action: "DELETE",
  });
  // const [productSelect, setProductSelect] = useState([]);
  // const [dataCart, setDataCart] = useState({ label: "Tổng tiền", value: 0 });

  // const onChangeSL = (cart, num) => {
  //   const soluong = cart.soLuong + num;

  //   const updatedProduct = {
  //     ...cart,
  //     soLuong: soluong,
  //   };

  //   const updatedAmount = productSelect.reduce(
  //     (total, item) =>
  //       total +
  //       (item.id === cart.id ? updatedProduct.soLuong : item.soLuong) *
  //         item.gia,
  //     0
  //   );

  //   if (updatedAmount > 50000000) {
  //     notification.error({
  //       message: "Error",
  //       description: "Tổng số tiền sản phẩm không được vượt quá 50tr VND",
  //     });
  //     return;
  //   }

  //   if (soluong <= 0) {
  //     const title = "Bạn có muốn xóa sản phẩm ra khỏi giỏ hàng không?";
  //     const text = "";
  //     confirmStatus(title, text).then((result) => {
  //       if (result.isConfirmed) {
  //         const preProductSelect = [...productSelect];
  //         const index = preProductSelect.findIndex((e) => e.id === cart.id);
  //         if (index !== -1) {
  //           preProductSelect.splice(index, 1);
  //           setProductSelect(preProductSelect);
  //         }
  //       }
  //     });
  //   } else {
  //     const preProductSelect = [...productSelect];
  //     const index = preProductSelect.findIndex((e) => e.id === cart.id);
  //     if (index !== -1) {
  //       preProductSelect[index] = updatedProduct;
  //       setProductSelect(preProductSelect);
  //     }
  //   }
  //   setDataCart({ ...dataCart, value: updatedAmount });
  // };

  // const rowSelection = {
  //   selectedRowKeys: productSelect.map((item) => item.key),
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     setProductSelect(selectedRows);
  //     const updatedAmount = selectedRows.reduce(
  //       (total, item) => total + item.quantity * item.price,
  //       0
  //     );
  //     setDataCart({ ...dataCart, value: updatedAmount });
  //   },
  // };

  // const getTitle = (number) => {
  //   switch (number) {
  //     case 1:
  //       return "GOLD";
  //     case 2:
  //       return "SLIVER";
  //     case 3:
  //       return "BRONZE";
  //     case 4:
  //       return "DIAMOND";
  //   }
  // };

  // const fakeHotProduct1s = [];
  // const fakeHotProduct2s = [];
  // for (let i = 1; i <= 4; i++) {
  //   fakeHotProduct1s.push({
  //     key: i,
  //     image1: `./src/assets/image/product/product-${i}.jpg`,
  //     image2: `./src/assets/image/product/product-${19 - i}.jpg`,
  //     title: getTitle(i),
  //     price: (i * 10 + 9.99).toFixed(2),
  //     quantity: i,
  //     category: `Category ${i}`,
  //   });
  //   fakeHotProduct2s.push({
  //     key: i,
  //     image1: `./src/assets/image/product/product-${i + 1}.jpg`,
  //     image2: `./src/assets/image/product/product-${19 - i - 1}.jpg`,
  //     title: getTitle(i),
  //     price: (i * 10 + 9.99).toFixed(2),
  //     quantity: i,
  //     category: `Category ${i}`,
  //   });
  // }

  const productsFormatted = useMemo(() => {
    return data?.data?.products?.map((it) => ({
      ...it.product,
      ...it,
      key: it._id,
    }));
  }, [data?.data]);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    onUpdateQuantity({
      productId: productId,
      quantity: quantity,
    });
  };

  return (
    <div>
      <main>
        {/* <!-- breadcrumb area start --> */}
        <div className="breadcrumb-area">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="breadcrumb-wrap">
                  <nav aria-label="breadcrumb">
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="/home">
                          <i className="fa fa-home"></i>
                        </a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        <a href="/cart">Giỏ hàng</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- breadcrumb area end --> */}

        <div
          className="shop-main-wrapper section-padding"
          style={{ paddingTop: "30px" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="sidebar-single">
                  <h5 className="sidebar-title">
                    <span>Sản phẩm của bạn</span>
                  </h5>
                  <Text
                    style={{
                      fontSize: "17px",
                      marginLeft: "12px",
                      marginBottom: "12px",
                      marginTop: "8px",
                    }}
                  >
                    Bạn đang có{" "}
                    <Text strong>
                      {data?.data?.products?.length || 0} sản phẩm
                    </Text>{" "}
                    trong giỏ hàng
                  </Text>
                  <div className="row">
                    <Table
                      dataSource={productsFormatted}
                      rowKey="key"
                      pagination={false}
                      className="cart-table"
                      // rowSelection={rowSelection}
                    >
                      <Table.Column
                        title="Sản phẩm"
                        dataIndex="name"
                        key="name"
                      />
                      <Table.Column
                        title="Giá"
                        dataIndex="price"
                        key="price"
                        render={(val) => formatPrice(val)}
                      />
                      <Table.Column
                        title="Số lượng"
                        dataIndex="quantity"
                        key="quantity"
                        render={(value, record: any) => (
                          <InputNumber
                            min={1}
                            value={value}
                            onStep={(quantity) =>
                              handleUpdateQuantity(record.product._id, quantity)
                            }
                          />
                        )}
                      />
                      <Table.Column
                        title="Thành tiền"
                        dataIndex="totalPrice"
                        key="totalPrice"
                        render={(_, record: any) =>
                          formatPrice(record.quantity * record.price)
                        }
                      />
                      <Table.Column
                        title="Hành động"
                        key="action"
                        render={(_, record: any) => (
                          <Popconfirm
                            title="Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() =>
                              onDeleteProduct(record.product._id)
                            }
                          >
                            <Button danger>Xóa</Button>
                          </Popconfirm>
                        )}
                      />
                    </Table>
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <Link to="/product">
                      <Button icon={<ArrowLeftOutlined />}>
                        Tiếp tục mua hàng
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="sidebar-single">
                  <h5 className="sidebar-title">
                    <span>Thông tin đơn hàng</span>
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 20px",
                      borderTop: "1px solid gray",
                    }}
                  >
                    <span>Tổng tiền</span>
                    <Text style={{ fontWeight: 800, color: "red" }}>
                      {formatPrice(data?.data?.totalPrice)}
                    </Text>
                  </div>
                  <Link to="/checkout">
                    <Button type="primary" style={{ float: "right" }}>
                      Thanh toán
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
