/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  InputNumber,
  message,
  Popconfirm,
  Table,
  Typography,
} from "antd";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useCartMutation, { useMyCartQuery } from "../../hooks/useCart";
import { formatPrice } from "../../services/common/formatCurrency";
import { useDispatch, useSelector } from "react-redux";
import {
  removeProduct,
  selectProductSelected,
  selectTotalPrice,
  updateProductSelected,
} from "../../store/cartSlice";
import { socket } from "../../socket";
// import { IProduct } from "../../interface/Products";

const { Text } = Typography;
// const SHIPPING_COST = 30000;

export interface ICartItem {
  _id: string;
  name: string;
  image: string[];
  price: number;
  description: string;
  quantity: number;
  categoryId: string[];

  createdAt: string;
  updatedAt: string;
  product: {
    _id: string;
    name: string;
    image: string[];
    price: number;
    description: string;
    quantity: number;
    categoryId: string[];
    createdAt: string;
    updatedAt: string;
  };

  key: string;
  variant: {
    _id: string;
    price: number;
    sizeName: string;
  };
  option: {
    _id: string;
    name: string;
    price: number;
  };
}

export default function Cart() {
  const dispatch = useDispatch();
  const productSelected: ICartItem[] = useSelector(selectProductSelected);
  const totalPrice = useSelector(selectTotalPrice);
  const { data, refetch } = useMyCartQuery();
  const { mutate: onUpdateQuantity } = useCartMutation({
    action: "UPDATE",
    onError: (error) => {
      message.error(
        error?.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại"
      );
    },
  });
  const { mutate: onDeleteProduct } = useCartMutation({
    action: "DELETE",
  });

  // initial socket
  useEffect(() => {
    const onConnect = () => {
      console.log("Socket client connect");
    };

    const onHiddenProduct = (productId: string) => {
      refetch();
      dispatch(removeProduct(productId));
    };

    const onProductUpdate = (productId: string) => {
      refetch();
    };

    socket.on("connect", onConnect);
    socket.on("hidden product", onHiddenProduct);
    socket.on("update product", onProductUpdate);
    socket.on("option update", onProductUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("hidden product", onHiddenProduct);
      socket.off("update product", onProductUpdate);
      socket.off("option update", onProductUpdate);
    };
  }, [refetch]);

  const productsFormatted = useMemo(() => {
    return data?.data?.products?.map((it) => ({
      ...it.product,
      ...it,
      key: it._id,
    }));
  }, [data?.data]);

  const handleUpdateQuantity = (
    variantId: string,
    option: string,
    quantity: number
  ) => {
    onUpdateQuantity({
      variantId,
      quantity,
      option,
    });
    // Cập nhật productSelected với số lượng mới
    const updatedProductSelected = productSelected.map((item) =>
      item.variant._id === variantId && item.option?._id === option
        ? { ...item, quantity }
        : item
    );
    dispatch(updateProductSelected(updatedProductSelected));

    // Cập nhật totalPrice
    const newTotalPrice = updatedProductSelected.reduce((total, item) => {
      return total + item.variant.price * item.quantity;
    }, 0);
    dispatch(totalPrice(newTotalPrice));
  };

  const handleDeleteProduct = (variantId: string, option: string) => {
    onDeleteProduct(
      { variantId, option },
      {
        onSuccess: () => {
          // Lọc ra các sản phẩm không bị xóa
          const updatedProductSelected = productSelected.filter((item) => {
            const status =
              item.variant._id === variantId && item?.option?._id === option;
            return !status;
          });
          dispatch(updateProductSelected(updatedProductSelected));
        },
      }
    );
  };

  // const totalPriceWithShipping = totalPrice + SHIPPING_COST;

  // Tính tổng tiền bao gồm phí ship nếu có sản phẩm đã chọn

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
              <div className="">
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
                      dataSource={productsFormatted as any}
                      rowKey="key"
                      pagination={false}
                      className="cart-table"
                      rowSelection={{
                        onChange: (_: any, selectedRows: ICartItem[]) => {
                          dispatch(updateProductSelected(selectedRows));
                        },
                        selectedRowKeys: productSelected
                          .filter((item) => item.variant.status)
                          .map((it) => it._id),
                        getCheckboxProps: (record: any) => ({
                          disabled: !record.variant.status,
                        }),
                      }}
                    >
                      <Table.Column
                        title="Hình ảnh"
                        dataIndex="image"
                        key="image"
                        render={(images: string[], record: any) => (
                          <Link to={`/product/${record.product._id}`}>
                            <img
                              className={
                                record.variant.status ? "" : "out-of-stock"
                              }
                              src={images[0]}
                              alt="Product"
                              style={{
                                width: "60%",
                                height: "60%",
                                objectFit: "cover",
                              }}
                              onError={(e) =>
                                (e.currentTarget.src = "/images/default.jpg")
                              }
                            />
                          </Link>
                        )}
                      />
                      <Table.Column
                        title="Sản phẩm"
                        dataIndex="name"
                        key="name"
                        render={(_, record: any) => {
                          return (
                            <div
                              className={
                                record.variant.status ? "" : "out-of-stock"
                              }
                            >
                              <Link to={`/product/${record.product._id}`}>
                                {record.name}
                              </Link>

                              <p>Size: {record.variant.sizeName}</p>

                              {!record.variant.status && (
                                <p className="out-of-stock-text">
                                  Sản phẩm đang ngừng hoạt động
                                </p>
                              )}
                            </div>
                          );
                        }}
                        width={200}
                      />

                      <Table.Column
                        title="Giá"
                        key="price"
                        render={(_, record: any) => (
                          <div
                            className={
                              record.variant.status ? "" : "out-of-stock"
                            }
                          >
                            {formatPrice(record.variant.price)}
                          </div>
                        )}
                        width={150}
                      />
                      <Table.Column
                        title="Option"
                        dataIndex="option"
                        key="option"
                        render={(option, record: any) => {
                          if (option) {
                            return (
                              <div
                                className={
                                  record.variant.status ? "" : "out-of-stock"
                                }
                              >
                                <p>{option.name}</p>
                                <p>{!option.status && 'Ẩn SP'}</p>
                              </div>
                            );
                          }

                          return;
                        }}
                        width={150}
                      />
                      <Table.Column
                        title="Số lượng"
                        dataIndex="quantity"
                        key="quantity"
                        render={(value, record: any) => (
                          <InputNumber
                            min={1}
                            value={value}
                            disabled={!record.variant.status}
                            onChange={(quantity) =>
                              handleUpdateQuantity(
                                record.variant._id,
                                record?.option?._id,
                                quantity
                              )
                            }
                            onKeyDown={(e) => e.preventDefault()} // Ngăn chặn nhập bằng bàn phím
                            onPaste={(e) => e.preventDefault()} // Ngăn chặn dán nội dung vào trường
                          />
                        )}
                        width={150}
                      />

                      <Table.Column
                        title="Thành tiền"
                        dataIndex="totalPrice"
                        key="totalPrice"
                        render={(_, record: any) => {
                          let totalPrice =
                            record.variant.price * record.quantity;
                          if (record?.option) {
                            totalPrice += record.option.price * record.quantity;
                          }

                          return (
                            <div
                              className={
                                record.variant.status ? "" : "out-of-stock"
                              }
                            >
                              {formatPrice(totalPrice)}
                            </div>
                          );
                        }}
                        width={150}
                      />
                      <Table.Column
                        title="Hành động"
                        key="action"
                        render={(_, record: any) => (
                          <Popconfirm
                            title="Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?"
                            okText="Có"
                            cancelText="Không"
                            onConfirm={() =>
                              handleDeleteProduct(
                                record.variant._id,
                                record?.option?._id
                              )
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

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 20px",
                  borderTop: "1px solid gray",
                  marginTop: "20px",
                }}
              >
                <span>Tổng tiền</span>
                <Text style={{ fontWeight: 800, color: "red" }}>
                  {formatPrice(totalPrice)}
                </Text>
              </div>
              <Link to="/checkout">
                <Button
                  type="primary"
                  style={{ float: "right" }}
                  disabled={!productSelected.length}
                >
                  Thanh toán
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
