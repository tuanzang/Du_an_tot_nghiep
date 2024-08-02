import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IBill, IProductBill } from "../../../interface/Bill";
import { toast } from "react-toastify";
import axios from "axios";
import { ITransaction } from "../../../interface/Transaction";
import { IUser } from "../../../interface/Users";
import { IHistoryBill } from "../../../interface/HistoryBill";
import {
  Button,
  Card,
  Col,
  Divider,
  Image,
  Input,
  Rate,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import TimeLine from "../../admin/bill/TimeLine";
import BillHistoryDialog from "../../admin/bill/BillHistoryDialog";
import styleHoaDon from "../../../services/constants/styleHoaDon";
import statusHoaDon from "../../../services/constants/statusHoaDon";
import AdBillTransaction from "../../admin/bill/AdBillTransaction";
import formatCurrency from "../../../services/common/formatCurrency";
import { IProduct } from "../../../interface/Products";
import dayjs from "dayjs";
import ProfileMenu from "./ProfileMenu";
import DialogAddUpdate from "../../admin/bill/DialogAddUpdateProps ";
import { USER_INFO_STORAGE_KEY } from "../../../services/constants";
import confirmStatus from "../../admin/bill/confirmStatus";
import { IProductSize } from "../../../interface/ProductSize";
import { IComment } from "../../../interface/Comments";
import { CommentOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface IProductSizeBill {
  variantId: string;
  quantity: number;
}

export default function ProfileBillDetail() {
  // lấy thông tin user đăng nhập
  const isLogged = localStorage.getItem(USER_INFO_STORAGE_KEY);
  const user: IUser | null = isLogged ? JSON.parse(isLogged) : null;

  // api
  const { id } = useParams();
  const [idCustomer, setIdCustomer] = useState<string | null>(null);
  const [statusBill, setStatusBill] = useState<string>("");

  // lấy ra hóa đơn
  const [loadingBill, setLoadingBill] = useState(true);
  const [listProductSize, setListProductSize] = useState<IProductSizeBill[]>(
    []
  );
  const [billDetail, setBillDetail] = useState<IBill>();
  const fetchDetailBill = async (id: string | null) => {
    setLoadingBill(true);
    if (id === null) {
      toast.error("Không tìm thấy hóa đơn");
    } else {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/bills/${id}`
        );
        const billData = response.data?.data;

        if (billData) {
          setBillDetail(billData);
          setIdCustomer(billData.userId);
          setStatusBill(billData.status);

          // Trích xuất variantId và quantity từ products
          const productSizes = billData.products.map(
            (product: IProductSizeBill) => ({
              variantId: product.variantId,
              quantity: product.quantity,
            })
          );
          setListProductSize(productSizes);
        }
      } catch (error) {
        toast.error("Không tìm thấy hóa đơn");
      }
    }
    setLoadingBill(false);
  };

  // lịch sử thành toán
  const [loadingTransBill, setLoadingTransBill] = useState(true);
  const [listTransaction, setListTransaction] = useState<ITransaction[]>([]);
  const getTransBillByIdBill = async (idBill: string | null) => {
    setLoadingTransBill(true);
    if (idBill === null) {
      toast.error("Không tìm thấy lịch sử thanh toán");
    } else {
      try {
        const response = await axios.post("http://localhost:3001/api/trans", {
          idBill: idBill,
        });
        setListTransaction(response.data?.data);
      } catch (error) {
        toast.error("Đơn hàng chưa có lịch sử thanh toán");
      }
    }
    setLoadingTransBill(false);
  };

  // tạo lich sử đơn hàng
  const [loadingHistory, setLoadingHistory] = useState(true);
  const createNewHistory = async (bill: IBill, user: IUser, note: string) => {
    setLoadingHistory(true);
    if (!bill || !user) {
      toast.warning("Không thể tạo lịch sử đơn hàng!");
      return;
    }
    const dataHistoryBill: IHistoryBill = {
      _id: null,
      idUser: user._id,
      idBill: bill._id,
      creator: user.name,
      role: user.role,
      statusBill: bill.status,
      note: note,
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
    setLoadingHistory(false);
  };

  // lấy lịch sử đơn hàng
  const [listHistoryBill, setListHistoryBill] = useState<IHistoryBill[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const getBillHistoryByIdBill = async (idBill: string | null) => {
    setLoadingHistory(true);
    if (idBill === null) {
      toast.error("Không tìm thấy lịch sử đơn hàng");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/history-bill",
          {
            idBill: idBill,
          }
        );
        setListHistoryBill(response.data?.data);
      } catch (error) {
        toast.error("Đơn hàng chưa có lịch sử");
      }
    }
    setLoadingHistory(false);
  };

  // lấy thông tin người đặt hàng
  const [customer, setCustomer] = useState<IUser>();
  const findUserById = async (idCustomer: string | null) => {
    if (idCustomer === null) {
      toast.error("Không tìm thấy thông tin người đặt hàng");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/users/findUserById",
          { _id: idCustomer }
        );
        setCustomer(response.data?.data);
      } catch (error) {
        console.log("Khong co du lieu");
      }
    }
  };

  // hủy hóa đơn
  const [openModalCancelBill, setOpenModalCancelBill] = useState(false);
  // hủy đơn hàng
  function ModalCancelBill() {
    const [ghiChu, setGhiChu] = useState("");
    const [errorGhiChu, setErrorGhiChu] = useState("");

    // API hủy đơn hàng
    const cancelBill = async () => {
      if (ghiChu === "") {
        setErrorGhiChu("Bạn cần nhập lý do");
        return;
      }
      confirmStatus({ title: "Xác nhận", text: "Xác nhận hủy đơn hàng?" }).then(
        (result) => {
          if (result) {
            if (listProductSize.length < 1) {
              toast.error("Không thể hủy đơn hàng!");
            } else {
              // cập nhật trạng thái
              handleUpdateStatusBill(
                id ? id : null,
                "0",
                user ? user : null,
                ghiChu
              );
              toast.success("Hủy đơn hàng thành công!");
              setOpenModalCancelBill(false);
            }
          }
        }
      );
    };

    return (
      <DialogAddUpdate
        open={openModalCancelBill}
        setOpen={setOpenModalCancelBill}
        title={"Huỷ đơn hàng"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={cancelBill}
          >
            Lưu
          </Button>
        }
      >
        <div>
          <Input
            size="small"
            placeholder="Ghi chú"
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </div>
        <div>
          {errorGhiChu !== "" && (
            <span style={{ color: "red" }}>{errorGhiChu}</span>
          )}
        </div>
      </DialogAddUpdate>
    );
  }

  // cập nhật trạng thái hóa đơn
  const handleUpdateStatusBill = async (
    id: string | null,
    status: string,
    user: IUser | null,
    note: string
  ) => {
    setLoadingBill(true);
    if (id === null || user === null) {
      toast.error("Không tìm thấy hóa đơn");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/orders/update-status",
          { id: id, status: status, statusShip: true }
        );
        createNewHistory(response.data.data, user, note);
        getBillHistoryByIdBill(id);
        setStatusBill(status);
      } catch (error) {
        toast.error("Không tìm thấy hóa đơn");
      }
    }
    setLoadingBill(false);
  };

  // nhận hàng
  const [openModelRecieve, setOpenModelRecieve] = useState(false);
  function ModalRecieve() {
    const [ghiChu, setGhiChu] = useState("");
    const [transCode, setTransCode] = useState("");
    const [errorTransCode, setErrorTransCode] = useState("");

    // xác nhận nhận hàng hóa đơn
    const handleConfirmPayment = async () => {
      setLoadingTransBill(true);
      if (!billDetail || !user) {
        toast.error("Không thể nhận hàng");
        return;
      }

      if (listTransaction.filter((trans) => trans.status === true).length > 0) {
        // cập nhật trạng thái
        handleUpdateStatusBill(billDetail._id, "5", user, ghiChu);
        toast.success("nhận hàng thành công");
        setOpenModelRecieve(false);
      } else {
        if (transCode === "") {
          setErrorTransCode("Bạn cần nhập mã giao dịch");
          return;
        }

        const confirmPaymentRequest: ITransaction = {
          _id: null,
          idUser: user._id,
          idBill: billDetail._id,
          transCode: transCode,
          totalMoney: billDetail.totalPrice,
          note: ghiChu,
          status: true,
          createdAt: "",
        };

        // xác nhận nhận hàng
        try {
          await axios.post(
            "http://localhost:3001/api/trans/add",
            confirmPaymentRequest
          );
          getTransBillByIdBill(billDetail._id);
          // cập nhật trạng thái
          handleUpdateStatusBill(
            billDetail._id,
            "5",
            user,
            confirmPaymentRequest.note
          );
          handleUpdateStatusBill(
            billDetail._id,
            "6",
            user,
            confirmPaymentRequest.note
          );
          toast.success("nhận hàng thành công");
          setOpenModelRecieve(false);
        } catch (error) {
          toast.error("nhận hàng thất bại");
          setOpenModelRecieve(false);
        }
      }
      setLoadingTransBill(false);
    };

    return (
      <DialogAddUpdate
        open={openModelRecieve}
        setOpen={setOpenModelRecieve}
        title={"Xác nhận nhận hàng"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={handleConfirmPayment}
          >
            Lưu
          </Button>
        }
      >
        <div>
          {listTransaction.filter((trans) => trans.status === true).length <
            1 && (
            <div>
              <Typography.Text strong>
                Tổng tiền hóa đơn <span style={{ color: "red" }}>*</span>
              </Typography.Text>
              <Input
                size="small"
                value={
                  billDetail
                    ? formatCurrency({ money: String(billDetail.totalPrice) })
                    : formatCurrency({ money: "0" })
                }
                disabled
                style={{ marginTop: "5px", marginBottom: "10px" }}
              />

              <Typography.Text strong>
                Tiền khách trả <span style={{ color: "red" }}>*</span>
              </Typography.Text>
              <Input
                size="small"
                value={
                  billDetail
                    ? formatCurrency({ money: String(billDetail.totalPrice) })
                    : formatCurrency({ money: "0" })
                }
                disabled
                style={{ marginTop: "5px", marginBottom: "10px" }}
              />
              <Typography.Text strong>
                Mã giao dịch <span style={{ color: "red" }}>*</span>
              </Typography.Text>
              <Input
                size="small"
                value={transCode}
                onChange={(e) => {
                  setTransCode(e.target.value);
                  setErrorTransCode("");
                }}
                style={{
                  marginTop: errorTransCode === "" ? "5px" : "",
                  marginBottom: errorTransCode === "" ? "10px" : "",
                }}
                required
              />
              <div>
                {errorTransCode !== "" && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginBottom: "10px",
                    }}
                  >
                    {errorTransCode}
                  </span>
                )}
              </div>
            </div>
          )}
          <Typography.Text strong>Ghi chú</Typography.Text>
          <Input
            size="small"
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
            style={{ marginTop: "5px", marginBottom: "10px" }}
            required
          />
        </div>
      </DialogAddUpdate>
    );
  }

  // trạng thái đơn hàng
  const genBtnHandleBill = (statusBill: string) => {
    //billDetail.type: giao hàng
    if (Number(statusBill) !== 0) {
      switch (statusBill) {
        case "1":
          return (
            <div>
              <Button
                color="error"
                style={{ marginRight: "5px" }}
                onClick={() => setOpenModalCancelBill(true)}
              >
                Huỷ đơn
              </Button>
            </div>
          );
        case "4":
          return (
            <div>
              <Button
                className="them-moi"
                color="cam"
                style={{ marginRight: "5px" }}
                onClick={() => setOpenModelRecieve(true)}
              >
                Xác nhận nhận hàng
              </Button>
            </div>
          );
        default:
          return null;
      }
    }
  };

  // product size
  const [nameProduct, setNameProduct] = useState<string | null>(null);
  const [productSize, setProductSize] = useState<IProductSize | null>(null);
  const findProductSize = async (idProductSize: string | null) => {
    if (idProductSize === null) {
      toast.error("Không tìm thấy product size");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/comments/findProductSizeById",
          { _id: idProductSize }
        );
        setProductSize(response.data.data);
      } catch (error) {
        toast.error("Không tìm thấy hóa đơn");
      }
    }
  };

  // detail comment
  const [commentDetail, setCommentDetail] = useState<IComment | null>(null);
  const detailComment = async (
    user: IUser | null,
    idProductSize: string | null
  ) => {
    if (user === null || idProductSize === null) {
      toast.error("Không tìm thấy bình luận!");
      return;
    }

    const dataComment = {
      idUser: user._id,
      idProductSize: idProductSize,
    };

    try {
      // Gửi yêu cầu tạo bình luận
      const res = await axios.post(
        "http://localhost:3001/api/comments/detailByUserAndProductSize",
        dataComment
      );
      setCommentDetail(res.data.data);
    } catch (error) {
      toast.error("Không tìm thấy bình luận");
    }
  };

  // create - update comment
  const [openModelComment, setOpenModelComment] = useState(false);
  function ModalCommentProductSize() {
    const [content, setContent] = useState(
      commentDetail !== null ? commentDetail.comment : ""
    );
    const [rate, setRate] = useState(
      commentDetail !== null ? commentDetail.rate : 0
    );

    const handleCreateContent = async () => {
      if (
        rate === 0 ||
        content === "" ||
        productSize === null ||
        user === null ||
        nameProduct === null
      ) {
        toast.error("Không thể bình luận!");
        return;
      } else {
        if (productSize._id === null || !productSize.sizeName) {
          toast.error("Không thể bình luận!");
          return;
        }
        const dataComment: IComment = {
          _id: null,
          idUser: user._id,
          fullName: user.name,
          avatar: user.avatar,
          idProduct: productSize.idProduct,
          productName: nameProduct,
          idProductSize: productSize._id,
          sizeName: productSize.sizeName,
          comment: content,
          rate: rate,
          createdAt: "",
        };

        try {
          // Gửi yêu cầu tạo bình luận
          await axios.post(
            "http://localhost:3001/api/comments/add",
            dataComment
          );
          toast.success("Bình luận thành công");
          setOpenModelComment(false);
        } catch (error) {
          toast.error("Bình luận thất bại");
          setOpenModelComment(false);
        }
      }
    };

    const handleUpdateContent = async () => {
      if (rate === 0 || content === "" || commentDetail === null) {
        toast.error("Không thể bình luận!");
        return;
      } else {
        try {
          // Gửi yêu cầu tạo bình luận
          await axios.post("http://localhost:3001/api/comments/update", {
            _id: commentDetail._id,
            rate,
            comment: content,
          });
          toast.success("Bình luận thành công");
          setOpenModelComment(false);
        } catch (error) {
          toast.error("Bình luận thất bại");
          setOpenModelComment(false);
        }
      }
    };

    return (
      <DialogAddUpdate
        open={openModelComment}
        setOpen={setOpenModelComment}
        title={"Bình luận sản phẩm"}
        buttonSubmit={
          commentDetail !== null ? (
            <Button
              style={{
                boxShadow: "none",
                textTransform: "none",
                borderRadius: "8px",
              }}
              onClick={handleUpdateContent}
            >
              Cập nhật
            </Button>
          ) : (
            <Button
              style={{
                boxShadow: "none",
                textTransform: "none",
                borderRadius: "8px",
              }}
              onClick={handleCreateContent}
            >
              Bình luận
            </Button>
          )
        }
      >
        <div>
          <Card
            title="Đánh giá của bạn"
            style={{ marginTop: 16, marginBottom: 16, padding: "16px" }}
            bordered={false}
          >
            <Rate allowHalf value={rate} onChange={(e) => setRate(e)} />
          </Card>
          <Card
            title="Bình luận của bạn"
            style={{ marginTop: 16, marginBottom: 16, padding: "16px" }}
            bordered={false}
          >
            <TextArea
              rows={4}
              placeholder="Nội dung bình luận"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Card>
        </div>
      </DialogAddUpdate>
    );
  }

  // useEffect
  useEffect(() => {
    fetchDetailBill(id ? id : null);
    getBillHistoryByIdBill(id ? id : null);
    if (idCustomer !== null) {
      findUserById(idCustomer);
    }
    getTransBillByIdBill(id ? id : null);
  }, [id, idCustomer]);

  //
  const handleFindData = (row: IProductBill) => {
    detailComment(user, row?.variantId);
    findProductSize(row?.variantId);
    setNameProduct(row?.name);
    setOpenModelComment(true);
  };

  return (
    <div>
      {/* breadcrumb area start */}
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
                    <li className="breadcrumb-item active" aria-current="page">
                      <a href="/home">Trang chủ</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      <a href="/profile/bill">Đơn hàng của tôi</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      <a>{billDetail?.code}</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb area end */}

      <div
        className="container"
        style={{ marginTop: "10px", marginBottom: "10px" }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <ProfileMenu small={false} />
          </Col>
          <Col span={18}>
            {openModelRecieve && <ModalRecieve />}
            {openModalCancelBill && <ModalCancelBill />}
            {openModelComment && <ModalCommentProductSize />}

            {/* lịch sử đơn hàng */}
            <Card
              title="Lịch sử đơn hàng"
              style={{
                marginTop: 16,
                marginBottom: 16,
                paddingLeft: 16,
                paddingBottom: 16,
              }}
              bordered={false}
            >
              <Row gutter={16} align="top">
                <Col span={24}>
                  {loadingHistory ? (
                    <Spin tip="Loading..." />
                  ) : (
                    <TimeLine orderTimeLine={listHistoryBill} />
                  )}
                </Col>
              </Row>
            </Card>

            <Card
              style={{ marginTop: 16, marginBottom: 16, padding: "16px" }}
              bordered={false}
            >
              <Row justify="space-between" align="middle">
                {/* Add your logic for `genBtnHandleBill` here */}
                {!loadingBill && genBtnHandleBill(statusBill)}

                <Col>
                  <Row gutter={16}>
                    <Col>
                      <Button
                        type="default"
                        style={{ marginRight: 8 }}
                        onClick={() => setOpenDialog(true)}
                      >
                        Chi tiết lịch sử
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {loadingHistory ? (
                <div>Loading...</div>
              ) : (
                openDialog && (
                  <BillHistoryDialog
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    listOrderTimeLine={listHistoryBill}
                  />
                )
              )}
            </Card>
            {/* Thông tin đơn hàng */}
            <Card
              style={{ marginTop: 16, marginBottom: 16, padding: "16px" }}
              bordered={false}
            >
              <Row justify="space-between" align="middle">
                <Typography.Title level={4}>
                  Thông tin đơn hàng
                </Typography.Title>
              </Row>
              <Divider style={{ margin: "16px 0" }} />

              {/* Thông tin khách hàng */}
              <Space
                direction="vertical"
                style={{ width: "100%", marginBottom: "20px" }}
              >
                {loadingBill ? (
                  <div>Loading...</div>
                ) : (
                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <Typography.Text>
                        <strong>Mã:</strong> {billDetail?.code}
                      </Typography.Text>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Typography.Text>
                        <Space>
                          <strong>Loại:</strong>
                          <Tag
                            color={
                              billDetail?.paymentMethod === "COD"
                                ? "blue"
                                : "green"
                            }
                          >
                            {billDetail?.paymentMethod}
                          </Tag>
                        </Space>
                      </Typography.Text>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Typography.Text>
                        <Space>
                          <strong>Trạng thái:</strong>
                          <Tag className={styleHoaDon({ status: statusBill })}>
                            {statusHoaDon({ status: String(statusBill) })}
                          </Tag>
                        </Space>
                      </Typography.Text>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Typography.Text>
                        <strong>Tên khách hàng:</strong> {customer?.name}
                      </Typography.Text>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Typography.Text>
                        <strong>Sđt người nhận:</strong>{" "}
                        {billDetail?.phone || ""}
                      </Typography.Text>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Typography.Text>
                        <strong>Tên người nhận:</strong>{" "}
                        {billDetail?.customerName || ""}
                      </Typography.Text>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Typography.Text>
                        <strong>Địa chỉ:</strong> {billDetail?.address || ""}
                      </Typography.Text>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Typography.Text>
                        <strong>Ghi chú:</strong> {billDetail?.message || ""}
                      </Typography.Text>
                    </Col>
                  </Row>
                )}
              </Space>
            </Card>

            <Card
              style={{ marginTop: 16, marginBottom: 16, padding: "16px" }}
              bordered={false}
            >
              {/* Lịch sử nhận hàng */}
              {loadingTransBill ? (
                <div>Loading...</div>
              ) : (
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Row justify="space-between" align="middle">
                    <Typography.Title level={4}>
                      Lịch sử thanh toán
                    </Typography.Title>
                  </Row>

                  {listTransaction.length > 0 ? (
                    <div>
                      <Divider style={{ margin: "16px 0" }} />
                      <AdBillTransaction listTransaction={listTransaction} />
                    </div>
                  ) : (
                    <div>Chưa thanh toán</div>
                  )}
                </Space>
              )}
            </Card>

            {/* Hóa đơn chi tiết */}
            <Card
              style={{ marginTop: 16, marginBottom: 16, padding: "16px" }}
              bordered={false}
            >
              {/* Hoá đơn chi tiết */}
              {billDetail && billDetail.products.length > 0 && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "20px",
                    }}
                  >
                    <Typography.Title level={3}>
                      Danh sách sản phẩm
                    </Typography.Title>
                  </div>
                  <Divider
                    style={{
                      backgroundColor: "black",
                      height: 1,
                      marginTop: 10,
                    }}
                  />
                  <Table
                    dataSource={billDetail.products}
                    rowKey="id"
                    pagination={false}
                    style={{ maxHeight: 300, marginBottom: 40 }}
                    scroll={{ y: 300 }}
                  >
                    <Table.Column
                      title="Ảnh"
                      dataIndex="imgae"
                      key="image"
                      width={"15%"}
                      render={(text: string) => (
                        <Image src={text} width={100} />
                      )}
                    />
                    <Table.Column
                      title="Sản phẩm"
                      dataIndex="name"
                      key="name"
                      width={"25%"}
                      render={(name: string, record: IProductBill) => {
                        return (
                          <>
                            <p>Tên: {name}</p>
                            <p>Size: {record?.size}</p>
                          </>
                        );
                      }}
                    />
                    <Table.Column
                      title="Số lượng"
                      dataIndex="quantity"
                      key="quantity"
                      width={statusBill === "7" ? "15%" : "25%"}
                      render={(value: number) => (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Input
                            value={value}
                            type="number"
                            min={1}
                            size="small"
                            style={{ width: 60, textAlign: "center" }}
                            readOnly
                          />
                        </div>
                      )}
                    />
                    <Table.Column
                      title="Giá tiền"
                      dataIndex="price"
                      key="price"
                      width={"15%"}
                      render={(text: string) =>
                        formatCurrency({
                          money: String(text || 0),
                        })
                      }
                    />
                    <Table.Column
                      title="Thành tiền"
                      key="totalPrice"
                      width={"15%"}
                      render={(row: IProduct) => (
                        <span style={{ fontWeight: "bold", color: "red" }}>
                          {formatCurrency({
                            money: String((row.price || 0) * row.quantity),
                          })}
                        </span>
                      )}
                    />
                    {statusBill === "7" && (
                      <Table.Column
                        title=""
                        key="comment"
                        width={"10%"}
                        render={(row: IProductBill) => (
                          <CommentOutlined
                            style={{ fontSize: "20px" }}
                            onClick={() => handleFindData(row)}
                          />
                        )}
                      />
                    )}
                  </Table>
                </div>
              )}
            </Card>
            <Card
              style={{ marginTop: 16, marginBottom: 16, padding: "16px" }}
              bordered={false}
            >
              <Row justify="space-between" align="middle">
                <Typography.Title level={4}>
                  Thông tin thanh toán
                </Typography.Title>
              </Row>
              <Divider style={{ margin: "16px 0" }} />
              <Row>
                <div
                  style={{ marginRight: "auto", width: 300, paddingRight: 16 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <Typography.Title level={5}>
                      Ngày đặt hàng:
                    </Typography.Title>
                    {dayjs(billDetail?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <Typography.Title level={5}>
                      Ngày giao dự kiến:
                    </Typography.Title>
                    {dayjs(billDetail?.createdAt)
                      .add(7, "day")
                      .format("DD/MM/YYYY HH:mm:ss")}
                  </div>
                </div>
                <div
                  style={{ marginLeft: "auto", width: 300, paddingRight: 16 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    Tổng tiền hàng:
                    <span style={{ fontWeight: "bold" }}>
                      {formatCurrency({
                        money: String(billDetail?.totalPrice || 0),
                      })}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    Phí ship:
                    {billDetail && billDetail.totalPrice >= 1000000 ? (
                      <span>0 VND</span>
                    ) : (
                      <Input
                        size="middle"
                        style={{ width: "75%" }}
                        value={0}
                        disabled={billDetail && Number(statusBill) !== 1}
                      />
                    )}
                  </div>
                  {billDetail && billDetail.totalPrice >= 1000000 && (
                    <div style={{ fontSize: 12 }}>
                      Miễn phí vận chuyển với đơn hàng có tổng tiền trên
                      1.000.000 VNĐ
                    </div>
                  )}
                  <Divider
                    style={{
                      backgroundColor: "black",
                      height: 2,
                      marginTop: 10,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>Tổng tiền:</span>
                    <span style={{ fontWeight: "bold", color: "red" }}>
                      {formatCurrency({
                        money: String(billDetail?.totalPrice || 0),
                      })}
                    </span>
                  </div>
                </div>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
