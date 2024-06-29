import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Divider,
  Image,
  Input,
  Modal,
  notification,
  Radio,
  Row,
  Space,
  Spin,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import type { RadioChangeEvent } from "antd";
import confirmStatus from "./confirmStatus";
import DialogAddUpdate from "./DialogAddUpdateProps ";
import axios from "axios";
import printJS from "print-js";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import TimeLine from "./TimeLine";
import { IoReturnUpBack } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import BillHistoryDialog from "./BillHistoryDialog";
import statusHoaDon from "../../../services/constants/statusHoaDon";
import AdBillTransaction from "./AdBillTransaction";
import formatCurrency from "../../../services/common/formatCurrency";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { CiCircleRemove } from "react-icons/ci";
import { TbTruckReturn } from "react-icons/tb";

const { TextArea } = Input;

interface IBill {
  id: string | null;
  billCode: string | null;
  fullName: string | null;
  statusBill: number | 0;
  totalMoney: number | 0;
  moneyAfter: number | 0;
  receivingMethod: number | 0;
  recipientPhoneNumber: string | null;
  recipientName: string | null;
  createdAt: string | null;
}

interface IBillDetail {
  id: string;
  productImg: string;
  productName: string;
  price: number | null;
  size: string;
  quantity: number;
  status: number;
  note: string;
}

interface ITransaction {
  id: number;
  totalMoney: number;
  createdAt: string;
  type: number;
  paymentMethod: number;
  status: number;
  note: string;
  fullName: string;
}

interface IUpdateStatusBill {
  noteBillHistory: string;
  status: number;
}

interface IOrderTimeline {
  id: string;
  role: number;
  fullName: string;
  codeAccount: string;
  note: string;
  statusBill: number | null;
  createdAt: string;
}

const listHis = [{ link: "/admin/bill", name: "Quản lý đơn hàng" }];
export default function BillDetail() {
  const { id } = useParams();
  const [listBillDetail, setListBillDetail] = useState<IBillDetail[]>([]);
  const [billDetail, setBillDetail] = useState<IBill>({
    id: id ? id : null,
    billCode: "HD01",
    fullName: null,
    statusBill: 2,
    totalMoney: 0,
    moneyAfter: 0,
    receivingMethod: 1,
    recipientPhoneNumber: "0123456789",
    recipientName: "Khách hàng",
    createdAt: null,
  });
  const [listTransaction, setListTransaction] = useState<ITransaction[]>([]);
  const [listOrderTimeLine, setListOrderTimeLine] = useState<IOrderTimeline[]>(
    []
  );
  const [updateStatusBill, setUpdateStatusBill] = useState<IUpdateStatusBill>({
    noteBillHistory: "",
    status: 0,
  });
  const [loadingTimeline, setLoadingTimeline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingTransaction, setLoadinTransaction] = useState(true);
  const [loadingListBillDetail, setLoadingListBillDetail] = useState(true);

  const getBillHistoryByIdBill = (id: string) => {
    setLoadingTimeline(true);
    setListOrderTimeLine([
      {
        id: "0",
        role: 0,
        fullName: "",
        codeAccount: "",
        note: "",
        statusBill: 0,
        createdAt: "01/01/1010",
      },
      {
        id: "0",
        role: 0,
        fullName: "",
        codeAccount: "",
        note: "",
        statusBill: 1,
        createdAt: "01/01/1010",
      },
      {
        id: "0",
        role: 0,
        fullName: "",
        codeAccount: "",
        note: "",
        statusBill: 2,
        createdAt: "01/01/1010",
      },
      {
        id: "0",
        role: 0,
        fullName: "",
        codeAccount: "",
        note: "",
        statusBill: 3,
        createdAt: "01/01/1010",
      },
      {
        id: "0",
        role: 0,
        fullName: "",
        codeAccount: "",
        note: "",
        statusBill: 4,
        createdAt: "01/01/1010",
      },
      {
        id: "0",
        role: 0,
        fullName: "",
        codeAccount: "",
        note: "",
        statusBill: 5,
        createdAt: "01/01/1010",
      },
      {
        id: "0",
        role: 0,
        fullName: "",
        codeAccount: "",
        note: "",
        statusBill: 6,
        createdAt: "01/01/1010",
      },
      {
        id: "0",
        role: 0,
        fullName: "",
        codeAccount: "",
        note: "",
        statusBill: 7,
        createdAt: "01/01/1010",
      },
      {
        id: "0",
        role: 0,
        fullName: "",
        codeAccount: "",
        note: "",
        statusBill: 6,
        createdAt: "01/01/1010",
      },
      {
        id: "0",
        role: 0,
        fullName: "",
        codeAccount: "",
        note: "",
        statusBill: 5,
        createdAt: "01/01/1010",
      },
      {
        id: "0",
        role: 0,
        fullName: "",
        codeAccount: "",
        note: "",
        statusBill: 4,
        createdAt: "01/01/1010",
      },
      {
        id: "0",
        role: 0,
        fullName: "",
        codeAccount: "",
        note: "",
        statusBill: 3,
        createdAt: "01/01/1010",
      },
    ]);
    console.log(id);
    setLoadingTimeline(false);
    setLoading(false);
    setLoadinTransaction(false);
    setLoadingListBillDetail(false);
  };

  const getBillDetailtByIdBill = (id: string) => {
    setLoadingListBillDetail(true);
    setListBillDetail([
      {
        id: "0",
        productImg: "../../../../src/assets/image/product/product-1.jpg",
        productName: "Sản phẩm 1",
        price: 10000,
        size: "M",
        quantity: 1,
        status: 0,
        note: "",
      },
      {
        id: "1",
        productImg: "../../../../src/assets/image/product/product-10.jpg",
        productName: "Sản phẩm 10",
        price: 100000,
        size: "L",
        quantity: 2,
        status: 0,
        note: "",
      },
      {
        id: "2",
        productImg: "../../../../src/assets/image/product/product-11.jpg",
        productName: "Sản phẩm 11",
        price: 110000,
        size: "S",
        quantity: 3,
        status: 0,
        note: "",
      },
    ]);
    console.log(id);
    setLoadingListBillDetail(false);
  };

  // State variables for controlling modal visibility
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalConfirmDelive, setOpenModalConfirmDelive] = useState(false);
  const [openModalConfirmPayment, setOpenModalConfirmPayment] = useState(false);
  const [openModalConfirmComplete, setOpenModalConfirmComplete] =
    useState(false);
  const [openModalCancelBill, setOpenModalCancelBill] = useState(false);
  const [openCodalConfirmReceived, setOpenCodalConfirmReceived] =
    useState(false);
  const [openmodalReturnStt, setOpenModalReturnStt] = useState(false);
  const [openPDFView, setOpenPDFView] = useState(false);

  // xác nhận đơn hàng
  function ModalConfirmBill() {
    const [ghiChu, setGhiChu] = useState("");

    const handleConfirmOrder = () => {
      confirmStatus({ title: "Xác nhận", text: "Xác nhận hoá đơn?" }).then(
        (result) => {
          if (result) {
            console.log(result);
          }
        }
      );
    };

    return (
      <DialogAddUpdate
        open={openModalConfirm}
        setOpen={setOpenModalConfirm}
        title={"Xác nhận hoá đơn"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={handleConfirmOrder}
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
      </DialogAddUpdate>
    );
  }

  // xác nhận giao hàng
  function ModalConfirmDeliver() {
    const [ghiChu, setGhiChu] = useState("");
    setUpdateStatusBill({ noteBillHistory: ghiChu, status: 3 });
    return (
      <DialogAddUpdate
        open={openModalConfirmDelive}
        setOpen={setOpenModalConfirmDelive}
        title={"Xác nhận giao hàng"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
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
      </DialogAddUpdate>
    );
  }

  // thanh toán
  function ModalConfirmPayment() {
    const totalMoneyTrans = listTransaction
      .filter((transaction) => transaction.type === 0)
      .reduce((total, transaction) => total + transaction.totalMoney, 0);

    let tienCanHoanTra = 0;
    if (billDetail) {
      tienCanHoanTra = totalMoneyTrans - billDetail.moneyAfter;
    }

    const [ghiChu, setGhiChu] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("0");
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [transactionCode, setTransactionCode] = useState("");
    const [isRefundMode, setIsRefundMode] = useState(false);

    const handleConfirmPayment = () => {
      const confirmPaymentRequest = {
        noteBillHistory: ghiChu,
        type: isRefundMode ? 1 : 0,
        status: 0,
        paymentMethod: paymentMethod,
        paymentAmount: paymentAmount,
        transactionCode: transactionCode,
      };

      if (!isRefundMode) {
        if (paymentAmount < billDetail.totalMoney) {
          notification.open({
            message: "Không đủ tiền để xác nhận thanh toán",
          });
          return;
        }

        if (paymentMethod === "0" && transactionCode.trim() === "") {
          notification.open({
            message: "Vui lòng nhập mã giao dịch",
          });
          return;
        }
      }

      // TODO: API xác nhận hóa đơn
    };

    return (
      <DialogAddUpdate
        open={openModalConfirmPayment}
        setOpen={setOpenModalConfirmPayment}
        title={"Xác nhận thanh toán"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Lưu
          </Button>
        }
      >
        <div>
          <div style={{ float: "right", marginRight: 5 }}>
            <Typography.Text strong>Hoàn tiền</Typography.Text>
            <Switch
              checkedChildren="Có"
              unCheckedChildren="Không"
              size="small"
              checked={isRefundMode}
              onChange={(checked) => setIsRefundMode(checked)}
              disabled={tienCanHoanTra <= 0}
            />
          </div>

          {isRefundMode ? (
            <>
              <Input
                size="small"
                placeholder="Số tiền cần hoàn trả"
                value={tienCanHoanTra}
                disabled
                style={{ marginBottom: "10px" }}
              />

              <Input
                size="small"
                placeholder="Tiền hoàn trả"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                style={{ marginBottom: "10px" }}
              />

              <TextArea
                placeholder="Ghi chú"
                rows={4}
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                style={{ marginBottom: "10px" }}
              />

              <Radio.Group
                onChange={(e: RadioChangeEvent) =>
                  setPaymentMethod(e.target.value)
                }
                value={paymentMethod}
                style={{ marginBottom: "10px" }}
              >
                <Radio value="0">Chuyển khoản</Radio>
                <Radio value="1">Tiền mặt</Radio>
              </Radio.Group>

              <Input
                size="small"
                placeholder="Mã giao dịch"
                value={transactionCode}
                onChange={(e) => setTransactionCode(e.target.value)}
                style={{ marginTop: "10px" }}
                required
              />
            </>
          ) : (
            <>
              <Input
                size="small"
                placeholder="Số tiền cần trả"
                value={billDetail.moneyAfter}
                disabled
                style={{ marginBottom: "10px" }}
              />

              <Input
                size="small"
                placeholder="Số tiền khách trả"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                style={{ marginBottom: "10px" }}
              />

              <Input
                size="small"
                placeholder="Tiền thối lại"
                value={paymentAmount - billDetail.moneyAfter}
                disabled
                style={{ marginBottom: "10px" }}
              />

              <Radio.Group
                onChange={(e: RadioChangeEvent) =>
                  setPaymentMethod(e.target.value)
                }
                value={paymentMethod}
                style={{ marginBottom: "10px" }}
              >
                <Radio value="0">Chuyển khoản</Radio>
                <Radio value="1">Tiền mặt</Radio>
              </Radio.Group>

              <Input
                size="small"
                placeholder="Mã giao dịch"
                value={transactionCode}
                onChange={(e) => setTransactionCode(e.target.value)}
                style={{ marginTop: "10px" }}
                required
              />
            </>
          )}
        </div>
      </DialogAddUpdate>
    );
  }

  // hoàn thành
  function ModalConfirmComplete() {
    const [ghiChu, setGhiChu] = useState("");

    const updateStatusBillRequest = {
      noteBillHistory: ghiChu,
      status: 4,
    };

    const handleConfirmComplete = (
      id: string | null,
      updateStatusBillRequest: IUpdateStatusBill | null
    ) => {
      // TODO: API hoàn thành đơn hàng
      console.log(id + "===" + updateStatusBillRequest);
    };

    return (
      <DialogAddUpdate
        open={openModalConfirmComplete}
        setOpen={setOpenModalConfirmComplete}
        title={"Xác nhận hoàn thành đơn hàng"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
            onClick={() =>
              handleConfirmComplete(id ? id : null, updateStatusBillRequest)
            }
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
      </DialogAddUpdate>
    );
  }

  // return trạng thái đơn hàng
  function ModalReturnSttBill() {
    const [ghiChu, setGhiChu] = useState("");

    //TODO: API return trạng thái đơn hàng
    return (
      <DialogAddUpdate
        open={openmodalReturnStt}
        setOpen={setOpenModalReturnStt}
        title={"Quay lại trạng thái trước"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
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
      </DialogAddUpdate>
    );
  }

  // hủy đơn hàng
  function ModalCancelBill() {
    const [ghiChu, setGhiChu] = useState("");
    //TODO: API hủy đơn hàng
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
      </DialogAddUpdate>
    );
  }

  // xác nhận đã nhận hàng
  function ModalConfirmReceived() {
    const [ghiChu, setGhiChu] = useState("");
    // TODO: API xác nhận đã nhận hàng

    return (
      <DialogAddUpdate
        open={openCodalConfirmReceived}
        setOpen={setOpenCodalConfirmReceived}
        title={"Xác nhận đã giao hàng"}
        buttonSubmit={
          <Button
            style={{
              boxShadow: "none",
              textTransform: "none",
              borderRadius: "8px",
            }}
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
      </DialogAddUpdate>
    );
  }

  // trạng thái đơn hàng
  const genBtnHandleBill = () => {
    if (
      listTransaction.filter((item) => item.type === 0).length > 0 &&
      billDetail.statusBill > 3 &&
      billDetail.statusBill < 7 &&
      billDetail.statusBill !== 0
    ) {
      return (
        <Button
          color="cam"
          style={{ marginRight: "5px" }}
          onClick={() => setOpenModalConfirmComplete(true)}
        >
          Hoàn thành
        </Button>
      );
    }
    //billDetail.type: giao hàng
    if (billDetail.receivingMethod === 1) {
      if (billDetail.statusBill !== 0) {
        switch (billDetail.statusBill) {
          case 1:
            return (
              <div>
                <Button
                  color="cam"
                  style={{ marginRight: "5px" }}
                  onClick={() => setOpenModalConfirm(true)}
                >
                  Xác nhận đơn hàng
                </Button>
                <Button
                  color="error"
                  style={{ marginRight: "5px" }}
                  onClick={() => setOpenModalCancelBill(true)}
                >
                  Huỷ đơn
                </Button>
              </div>
            );
          case 2:
            return (
              <div>
                <Button
                  color="cam"
                  style={{ marginRight: "5px" }}
                  onClick={() => setOpenModalConfirmDelive(true)}
                >
                  Xác nhận giao hàng
                </Button>
                <Button
                  color="error"
                  style={{ marginRight: "5px" }}
                  onClick={() => setOpenModalCancelBill(true)}
                >
                  Huỷ đơn
                </Button>
              </div>
            );
          case 3:
            return (
              <div>
                <Button
                  className="them-moi"
                  color="cam"
                  style={{ marginRight: "5px" }}
                  onClick={() => setOpenCodalConfirmReceived(true)}
                >
                  Xác nhận lấy hàng
                </Button>
                <Button
                  className="them-moi"
                  color="error"
                  style={{ marginRight: "5px" }}
                  onClick={() => setOpenModalCancelBill(true)}
                >
                  Huỷ đơn
                </Button>
              </div>
            );
          default:
            return null;
        }
      }
    } else {
      switch (billDetail.statusBill) {
        case 2:
          return null;
        default:
          return null;
      }
    }
  };

  // xác nhận và in bill
  const [pdfContent, setPdfContent] = useState("");
  const handleOpenPDF = (pdfContent: string) => {
    setPdfContent(pdfContent);
    setOpenPDFView(true);
  };

  const confirmPrintBill = async (idBill: string) => {
    const comfirm = await confirmStatus({
      title: "Xác nhận in hoá đơn",
      text: "Bạn có chắc chắn muốn in hoá đơn này?",
    });
    if (comfirm) {
      try {
        const response = await axios.get(
          "http://localhost:5173" + "/in-hoa-don/" + idBill,
          {
            responseType: "blob",
          }
        );
        const pdfContent = await new Response(response.data).blob();

        // Tạo URL từ Blob
        const pdfUrl = URL.createObjectURL(pdfContent);

        // In PDF khi lấy được nội dung
        printJS({
          printable: pdfUrl,
          type: "pdf",
          header: "Header for the PDF",
        });

        // Đảm bảo giải phóng tài nguyên khi không cần thiết
        URL.revokeObjectURL(pdfUrl);
        handleOpenPDF(String(pdfContent));
      } catch (error) {
        console.error("Error fetching or printing PDF:", error);
      }
    }
  };

  const confirmPrintBillGiaoHang = async (idBill: string) => {
    try {
      const response = await axios.get(
        "http://localhost:5173" + "/in-hoa-don/hd-giao-hang/" + idBill,
        {
          responseType: "blob",
        }
      );
      const pdfContent = await new Response(response.data).blob();

      // Tạo URL từ Blob
      const pdfUrl = URL.createObjectURL(pdfContent);

      // In PDF khi lấy được nội dung
      printJS({ printable: pdfUrl, type: "pdf", header: "Header for the PDF" });

      // Đảm bảo giải phóng tài nguyên khi không cần thiết
      URL.revokeObjectURL(pdfUrl);
      handleOpenPDF(String(pdfContent));
    } catch (error) {
      console.error("Error fetching or printing PDF:", error);
    }
  };

  const PDFViewerModal = () => {
    const pdfBlob = new Blob([pdfContent], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    return (
      <Modal
        open={openPDFView}
        onCancel={() => setOpenPDFView(false)}
        footer={null} // Remove footer if not needed
        width="80%" // Set the width of the modal
        style={{ padding: 0 }} // Remove padding from body
      >
        <iframe
          style={{ border: "none", width: "100%", height: "80vh" }}
          src={pdfUrl}
          title="PDF Viewer"
        />
      </Modal>
    );
  };

  const handleOpenModalChonNhanVien = () => {
    //TODO: call api danh sách nhân viên và chọn nhân viên => 2 api
  };

  // useEffects
  useEffect(() => {
    getBillHistoryByIdBill(id ? id : "");
    getBillDetailtByIdBill(id ? id : "");
  }, [id]);

  const userAdmin = { role: 1 };
  return (
    <div>
      {openPDFView && <PDFViewerModal />}
      {openModalConfirm && <ModalConfirmBill />}
      {openModalConfirmDelive && <ModalConfirmDeliver />}
      {openModalConfirmPayment && <ModalConfirmPayment />}
      {openModalConfirmComplete && <ModalConfirmComplete />}
      {openModalCancelBill && <ModalCancelBill />}
      {openCodalConfirmReceived && <ModalConfirmReceived />}
      {openmodalReturnStt && <ModalReturnSttBill />}

      <BreadcrumbsCustom
        listLink={listHis}
        nameHere={billDetail.billCode ? billDetail.billCode : ""}
      />

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
            {loadingTimeline ? (
              <Spin tip="Loading..." />
            ) : (
              <TimeLine orderTimeLine={listOrderTimeLine} />
            )}
          </Col>
        </Row>
        <Row justify="end" style={{ marginTop: 16 }}>
          <Col>
            {billDetail &&
              billDetail.statusBill > 1 &&
              billDetail.receivingMethod === 1 &&
              billDetail.statusBill <= 7 && (
                <Button
                  type="default"
                  className="them-moi"
                  style={{
                    marginRight: 5,
                    cursor:
                      billDetail.statusBill === 1 ? "not-allowed" : "pointer",
                    opacity: billDetail.statusBill === 1 ? 0.5 : 1,
                  }}
                  onClick={() => {
                    if (billDetail.statusBill !== 1) {
                      setOpenModalReturnStt(true);
                    }
                  }}
                  disabled={billDetail.statusBill === 1}
                >
                  <IoReturnUpBack style={{ fontSize: 20 }} />
                  Quay lại trạng thái trước
                </Button>
              )}
          </Col>

          <Col>
            {userAdmin &&
              userAdmin.role === 1 &&
              billDetail &&
              billDetail.statusBill < 7 &&
              billDetail.statusBill > 1 && (
                <Button
                  type="default"
                  className="them-moi"
                  style={{ marginLeft: 5 }}
                  onClick={handleOpenModalChonNhanVien}
                >
                  <IoIosAdd style={{ fontSize: 20 }} />
                  Thêm nhân viên tiếp nhận
                </Button>
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
          {!loading && genBtnHandleBill()}

          <Col>
            <Row gutter={16}>
              <Col>
                <Button
                  type="default"
                  style={{ marginRight: 8 }}
                  onClick={() => setOpenDialog(true)}
                >
                  Chi tiết
                </Button>
                {billDetail && billDetail.statusBill === 7 && (
                  <Button
                    type="default"
                    style={{ marginRight: 8 }}
                    onClick={() =>
                      confirmPrintBill(billDetail.id ? billDetail.id : "")
                    }
                  >
                    In hoá đơn
                  </Button>
                )}
              </Col>
            </Row>
          </Col>
        </Row>

        {loading ? (
          <div>Loading...</div>
        ) : (
          openDialog && (
            <BillHistoryDialog
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              listOrderTimeLine={listOrderTimeLine}
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
          <Typography.Title level={4}>Thông tin đơn hàng</Typography.Title>
          {/* {billDetail &&
                (billDetail.statusBill === 1 ||
                  billDetail.statusBill === 2) && (
                  <Button
                    type="primary"
                    onClick={() => setOpenModalUpdateAdd(true)}
                  >
                    Cập nhật
                  </Button>
                )} */}
        </Row>
        <Divider style={{ margin: "16px 0" }} />

        {/* Thông tin khách hàng */}
        <Space
          direction="vertical"
          style={{ width: "100%", marginBottom: "20px" }}
        >
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <strong>Mã:</strong> {billDetail?.billCode}
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <strong>Tên khách hàng:</strong>{" "}
                  {billDetail?.fullName || "Khách lẻ"}
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <Space>
                    <strong>Trạng thái:</strong>
                    <Tag>
                      {statusHoaDon({ status: billDetail?.statusBill })}
                    </Tag>
                  </Space>
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <strong>Sđt người nhận:</strong>{" "}
                  {billDetail?.recipientPhoneNumber || ""}
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <Space>
                    <strong>Loại:</strong>
                    <Tag
                      color={
                        billDetail?.receivingMethod === 1 ? "blue" : "green"
                      }
                    >
                      {billDetail?.receivingMethod === 1
                        ? "Giao hàng"
                        : "Tại quầy"}
                    </Tag>
                  </Space>
                </Typography.Text>
              </Col>
              <Col xs={24} sm={8}>
                <Typography.Text>
                  <strong>Tên người nhận:</strong>{" "}
                  {billDetail?.recipientName || ""}
                </Typography.Text>
              </Col>
            </Row>
          )}
        </Space>
        <Divider style={{ margin: "16px 0" }} />

        {/* Lịch sử thanh toán */}
        {loadingTransaction ? (
          <div>Loading...</div>
        ) : (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Row justify="space-between" align="middle">
              <Typography.Title level={4}>Lịch sử thanh toán</Typography.Title>
              {billDetail?.statusBill > 3 &&
                billDetail?.statusBill < 7 &&
                listTransaction.filter((item) => item.type === 0).length ===
                  0 && (
                  <Button
                    type="primary"
                    onClick={() => setOpenModalConfirmPayment(true)}
                  >
                    Xác nhận thanh toán
                  </Button>
                )}
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
        {listBillDetail.filter((row) => row.status === 0).length > 0 && (
          <div>
            {billDetail &&
              listBillDetail.filter((row) => row.status === 0).length > 0 && (
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
                    {/* {billDetail &&
                          listTransaction.filter((item) => item.type === 0)
                            .length === 0 &&
                          (billDetail.statusBill === 1 ||
                            billDetail.statusBill === 2 ||
                            billDetail.statusBill === 6) && (
                            <Button
                              type="primary"
                              style={{ marginRight: 5 }}
                              onClick={() => setOpenModalThemSP(true)}
                            >
                              Thêm sản phẩm
                            </Button>
                          )} */}
                  </div>

                  <Divider
                    style={{
                      backgroundColor: "black",
                      height: 1,
                      marginTop: 10,
                    }}
                  />
                  {loadingListBillDetail ? (
                    <div>Loading BillDetail...</div>
                  ) : (
                    <Table
                      dataSource={listBillDetail.filter(
                        (row) => row.status === 0
                      )}
                      rowKey="id"
                      pagination={false}
                      style={{ maxHeight: 300, marginBottom: 40 }}
                      scroll={{ y: 300 }}
                    >
                      <Table.Column
                        title="Ảnh"
                        dataIndex="productImg"
                        key="productImg"
                        render={(text: string) => (
                          <Image src={text} width={100} />
                        )}
                      />
                      <Table.Column
                        title="Tên sản phẩm"
                        dataIndex="productName"
                        key="productName"
                        render={(text: string, row: IBillDetail) => (
                          <>
                            {text} <br />
                            <span style={{ color: "red" }}>
                              {formatCurrency({
                                money: String(row.price || 0),
                              })}
                            </span>
                            <br />
                            Size: {row.size} <br />x{row.quantity}
                          </>
                        )}
                      />
                      <Table.Column
                        title="Số lượng"
                        key="quantity"
                        render={(row: IBillDetail) => (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              icon={<DeleteOutlined />}
                              // onClick={() =>
                              //   handleDecrementQuantity(row, index)
                              // }
                              disabled={
                                (billDetail &&
                                  listTransaction.filter(
                                    (item) => item.type === 0
                                  ).length > 0) ||
                                (billDetail.statusBill !== 6 &&
                                  billDetail.statusBill > 2) ||
                                billDetail.statusBill === 0 ||
                                row.quantity - 1 === 0
                              }
                              style={{ marginRight: 8 }}
                            />
                            <Input
                              value={row.quantity}
                              type="number"
                              min={1}
                              size="small"
                              style={{ width: 60, textAlign: "center" }}
                              // onChange={(e) =>
                              //   handleTextFieldQuantityChange(
                              //     row,
                              //     index,
                              //     e.target.value
                              //   )
                              // }
                              // onFocus={(e) =>
                              //   handleTextFieldQuanityFocus(e, index)
                              // }
                              disabled={
                                (billDetail &&
                                  listTransaction.filter(
                                    (item) => item.type === 0
                                  ).length > 0) ||
                                (billDetail.statusBill !== 6 &&
                                  billDetail.statusBill > 2) ||
                                billDetail.statusBill === 0
                              }
                            />
                            <Button
                              icon={<PlusOutlined />}
                              // onClick={() =>
                              //   handleIncrementQuantity(row, index)
                              // }
                              disabled={
                                (billDetail &&
                                  listTransaction.filter(
                                    (item) => item.type === 0
                                  ).length > 0) ||
                                (billDetail.statusBill !== 6 &&
                                  billDetail.statusBill > 2) ||
                                billDetail.statusBill === 0 ||
                                row.quantity + 1 > 5
                              }
                              style={{ marginLeft: 8 }}
                            />
                          </div>
                        )}
                      />
                      <Table.Column
                        title="Thành tiền"
                        key="totalPrice"
                        render={(row: IBillDetail) => (
                          <span style={{ fontWeight: "bold", color: "red" }}>
                            {formatCurrency({
                              money: String((row.price || 0) * row.quantity),
                            })}
                          </span>
                        )}
                      />
                      <Table.Column
                        title="Thao tác"
                        key="actions"
                        render={() => (
                          <div>
                            {billDetail &&
                              listBillDetail.length > 1 &&
                              billDetail.statusBill !== 0 &&
                              billDetail.statusBill < 3 && (
                                <Tooltip title="Xoá sản phẩm">
                                  <Button
                                    icon={<CiCircleRemove />}
                                    // onClick={() =>
                                    //   handleDeleteSPConfirmation(row)
                                    // }
                                  />
                                </Tooltip>
                              )}
                            {billDetail &&
                              listTransaction.length < 1 &&
                              listBillDetail.length > 1 &&
                              billDetail.statusBill === 3 && (
                                <Tooltip title="Hoàn hàng">
                                  <Button
                                    icon={<TbTruckReturn />}
                                    // onClick={() => handleReturnProduct(row)}
                                  />
                                </Tooltip>
                              )}
                          </div>
                        )}
                      />
                    </Table>
                  )}
                </div>
              )}
          </div>
        )}
      </Card>
      <Card
        style={{ marginTop: 16, marginBottom: 16, padding: "16px" }}
        bordered={false}
      >
        <Row justify="space-between" align="middle">
          <Typography.Title level={4}>Thông tin thanh toán</Typography.Title>
        </Row>
        <Divider style={{ margin: "16px 0" }} />
        <Row>
          <div style={{ marginLeft: "auto", width: 300, paddingRight: 16 }}>
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
                  money: String(billDetail?.totalMoney || 0),
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
              Phí vận chuyển:
              {billDetail && billDetail.totalMoney >= 1000000 ? (
                <span>0 VND</span>
              ) : (
                <Input
                  size="small"
                  value={0}
                  disabled={
                    (billDetail && billDetail.statusBill > 2) ||
                    (billDetail && billDetail.statusBill <= 0)
                  }
                />
              )}
            </div>
            {billDetail && billDetail.totalMoney >= 1000000 && (
              <div style={{ fontSize: 12 }}>
                Miễn phí vận chuyển với đơn hàng có tổng tiền trên 1.000.000 VNĐ
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
                  money: String(billDetail.moneyAfter || 0),
                })}
              </span>
            </div>
          </div>
        </Row>
      </Card>
    </div>
  );
}
