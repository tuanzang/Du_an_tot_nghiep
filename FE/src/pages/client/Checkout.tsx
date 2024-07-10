import { useMyCartQuery } from "../../hooks/useCart";
import { formatPrice } from "../../services/common/formatCurrency";
import { SubmitHandler, useForm } from "react-hook-form";
import OrderApi from "../../config/orderApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IHistoryBill } from "../../interface/HistoryBill";
import axios from "axios";
import { useEffect, useState } from "react";
import { IUser } from "../../interface/Users";

type Inputs = {
  customerName: string;
  address: string;
  phone: string;
  email: string;
  message: string;
  paymentMethod: string;
};

const Checkout = () => {
  const { data, refetch } = useMyCartQuery();
  const idUser = "6687fecfed4d73c8f419c10e"; // chưa lấy được từ auth nên đang fix cứng
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      paymentMethod: "COD",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const dataBill = await OrderApi.createOrder(data);
      createNewHistory(dataBill.data._id, dataBill.data.status);
      toast.success("Đặt hàng thành công!");
      navigate("/");
      refetch();
    } catch (error) {
      console.log(data);
    }
  };

  const [user, setUser] = useState<IUser>({
    _id: "",
    email: "",
    password: "",
    name: "",
    role: "",
    avatar: "",
  });
  const findUserById = async (idUser: string | null) => {
    if (idUser === null) {
      return setUser({
        _id: "",
        email: "",
        password: "",
        name: "",
        role: "",
        avatar: "",
      });
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/users/findUserById",
          { _id: idUser }
        );
        setUser(response.data?.data);
      } catch (error) {
        toast.error("Không tìm thấy tài khoản người dùng");
      }
    }
  };

  const createNewHistory = async (
    idBill: string | null,
    statusBill: string | null
  ) => {
    if (idBill === null || statusBill === null) {
      toast.warning("Không thể tạo lịch sử đơn hàng!");
      return;
    }
    const dataHistoryBill: IHistoryBill = {
      _id: null,
      idUser: idUser,
      idBill: idBill,
      creator: user.name,
      role: user.role,
      statusBill: statusBill,
      note: "",
      createdAt: "",
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

  useEffect(() => {
    findUserById(idUser ? idUser : null);
  }, [idUser]);

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
                type="email"
                className="form-control"
                id="email"
                placeholder="name@example.com"
                {...register("email", {
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
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.products.map((item) => (
                <tr key={item._id}>
                  <td>{item.product.name}</td>
                  <td>{formatPrice(item.product.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.product.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Tổng tiền: {formatPrice(data?.data?.totalPrice)}</h4>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
