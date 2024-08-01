/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMyCartQuery } from "../../hooks/useCart";
import {  Typography } from "antd";
import { formatPrice } from "../../services/common/formatCurrency";
import { SubmitHandler, useForm } from "react-hook-form";
import OrderApi from "../../config/orderApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IHistoryBill } from "../../interface/HistoryBill";
import axios from "axios";
import { IUser } from "../../interface/Users";
import { useDispatch, useSelector } from "react-redux";
import { ICartItem } from "./Cart";
import {
  removeProduct,
  resetProductSelected,
  selectProductSelected,
  selectTotalPrice,
} from "../../store/cartSlice";
import { USER_INFO_STORAGE_KEY } from "../../services/constants";
import { useEffect } from "react";
import { socket } from "../../socket";
const SHIPPING_COST = 30000; 
// import { useLocation } from "react-router-dom";
const { Text } = Typography;
type Inputs = {
  customerName: string;
  address: string;
  phone: string;
  message: string;
  paymentMethod: string;
};

const Checkout = () => {
  // lấy thông tin user đăng nhập
  const isLogged = localStorage.getItem(USER_INFO_STORAGE_KEY);
  const user: IUser | null = isLogged ? JSON.parse(isLogged) : null;
  // const location = useLocation();
  // const state = location.state as { shippingCost: number; totalPriceWithShipping: number };
  const dispatch = useDispatch();
  const productSelected: ICartItem[] = useSelector(selectProductSelected);
  const totalPrice = useSelector(selectTotalPrice);
  // const SHIPPING_COST = state?.shippingCost || 0;
  // const totalPriceWithShipping = state?.totalPriceWithShipping || 0;
  const { refetch } = useMyCartQuery();
  const navigate = useNavigate();

  // initial socket
  useEffect(() => {
    const onHiddenProduct = (productId: string) => {
      dispatch(removeProduct(productId));
    };

    socket.on("hidden product", onHiddenProduct);

    return () => {
      socket.off("hidden product", onHiddenProduct);
    };
  }, [dispatch, navigate, productSelected.length]);

  useEffect(() => {
    if (!productSelected.length) {
      navigate(-1);
    }
  }, [navigate, productSelected.length]);

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      paymentMethod: "COD",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const productSelectedIds = productSelected.map((it) => it.variant._id);
      const res = await OrderApi.createOrder({
        ...data,
        productSelectedIds,
        shippingCost: SHIPPING_COST
      });

      if (data?.paymentMethod === "COD") {
        createNewHistory(res.data.data._id, "1", user);
        toast.success("Đặt hàng thành công!");
        navigate("/");
        refetch();
      } else {
        window.location.href = res?.data?.paymentUrl;
      }
    } catch (error) {
      console.log(data);
    }
  };

  const createNewHistory = async (
    idBill: string | null,
    statusBill: string | null,
    user: IUser | null
  ) => {
    if (idBill === null || statusBill === null || user === null) {
      toast.warning("Không thể tạo lịch sử đơn hàng!");
      return;
    }
    const dataHistoryBill: IHistoryBill = {
      _id: null,
      idUser: user._id,
      idBill: idBill,
      creator: user.name,
      role: user.role,
      statusBill: statusBill,
      note: "",
      createdAt: null,
    };

    try {
      // Gửi yêu cầu tạo lịch sử
      await axios.post(
        "http://localhost:3001/api//history-bill/add",
        dataHistoryBill
      );
    } catch (error) {
      toast.error("Tạo lịch sử thất bại");
    }
  };
  const totalPriceWithShipping =
  productSelected.length > 0 ? totalPrice + SHIPPING_COST : totalPrice;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 mb-3">
          <h2>Thanh Toán Đơn Hàng</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label"></label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Họ và tên"
                {...register("customerName", {
                  required: true,
                })}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="number"
                placeholder="Số điện thoại"
                {...register("phone", {
                  required: true,
                })}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="address"
                placeholder="Địa chỉ"
                {...register("address", {
                  required: true,
                })}
              />
            </div>

            <div className="md-3 ">
              <input
                type="text"
                className="form-control"
                id="city"
                placeholder="Ghi chú"
                {...register("message", {
                  required: true,
                })}
              />
            </div>
            <div className="fw-normal fs-5 mt-5">Phương thức thanh toán</div>
            <div className="d-flex flex-column md-3">
              <div className=" p-2 form-check ">
                <input
                  type="radio"
                  className="form-check-input"
                  value="COD"
                  {...register("paymentMethod")}
                />
                <label className="form-check-label">
                  Thanh toán sau khi nhận hàng
                </label>
              </div>
              <div className="p-2 form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="myCheckbox"
                  value="VNPAY"
                  {...register("paymentMethod")}
                />
                <label className="form-check-label" htmlFor="myCheckbox">
                  Thanh toán ngay
                </label>
              </div>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <a href=""> Giỏ hàng</a>
              <button
                type="submit"
                className="btn btn-primary bg-info px-4 py-3"
              >
                Hoàn tất đơn hàng
              </button>
            </div>
          </form>
        </div>
        <div className="col-md-6 bg-light">
          <h3 className="mt-5">Giỏ Hàng</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                {/* <th>ảnh</th> */}
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {productSelected?.map((item) => (
                <tr key={item._id}>
                  <td>
                    {item.product.name} (Size: {item.variant?.sizeName})
                  </td>
                  <td>{formatPrice(item.variant.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.variant.price * item.quantity)}</td>
                  {/* <td> {formatPrice(SHIPPING_COST)}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
          
          <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 20px",
                      borderTop: "1px solid gray",
                      marginTop: "20px",
                    }}
                  >
                    
                    <span>Tổng tiền:</span>
                    <Text style={{ fontWeight: 800, color: "red" }}>
                        {formatPrice(totalPrice)}
                    </Text>
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
                    
                    <span>Phí ship:</span>
                    <Text style={{ fontWeight: 800, color: "red" }}>
                        {formatPrice(SHIPPING_COST)}
                    </Text>
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
                    
                    <span>Tổng tiền bao gồm ship: </span>
                    <Text style={{ fontWeight: 800, color: "red" }}>
                        {formatPrice(totalPriceWithShipping)}
                    </Text>
                  </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
