import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  Modal,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import ProfileMenu from "./ProfileMenu";
import { USER_INFO_STORAGE_KEY } from "../../../services/constants";
import { IUser } from "../../../interface/Users";
import { useEffect, useState } from "react";
import {
  IAddress,
  IDistrict,
  IPronvince,
  IWard,
} from "../../../interface/Address";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import confirmStatus from "../../admin/bill/confirmStatus";

export default function ProfileAddress() {
  // lấy thông tin user đăng nhập
  const isLogged = localStorage.getItem(USER_INFO_STORAGE_KEY);
  const user: IUser | null = isLogged ? JSON.parse(isLogged) : null;

  // token ghn
  const token = "e7731d72-569c-11ee-af43-6ead57e9219a";

  // Api ghn lấy tỉnh/thành phố
  const [province, setProvince] = useState<IPronvince[]>([]);
  const getProvinces = async () => {
    try {
      const response = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/province`,
        {
          headers: {
            Token: token,
          },
        }
      );
      setProvince(response.data.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  // api gnh lấy quận/huyện
  const [district, setDistrict] = useState<IDistrict[]>([]);
  const getDistricts = async (provinceId: number) => {
    try {
      const response = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
        {
          headers: {
            Token: token,
          },
          params: {
            province_id: provinceId,
          },
        }
      );
      setDistrict(response.data.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  // api ghn lấy xã/phường
  const [ward, setWard] = useState<IWard[]>([]);
  const getWard = async (districtId: number) => {
    try {
      const response = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
        {
          headers: {
            Token: token,
          },
          params: {
            district_id: districtId,
          },
        }
      );
      setWard(response.data.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  // api lấy tất cả địa chỉ của 1 user
  const [address, setAddress] = useState<IAddress[]>([]);
  const fetchAddress = async () => {
    if (user === null) {
      return;
    } else {
      try {
        const response = await axios.post("http://localhost:3001/api/address", {
          idUser: user._id,
        });
        setAddress(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  // tạo address mặc định dùng cho cả add và update
  const defaultAddress: IAddress = {
    _id: null,
    idUser: user ? user._id : null,
    fullName: "",
    phoneNumber: "",
    provinceId: 0,
    provinceName: "",
    districtId: 0,
    districtName: "",
    wardId: 0,
    wardName: "",
    specifically: "",
    isDefault: false,
  };

  // khởi tạo address mới
  const [newAddress, setNewAddress] = useState<IAddress>(defaultAddress);

  // open button tạo mới
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const openModelCreateAddress = () => {
    getProvinces();
    setOpenCreate(true);
  };

  // api tạo mới 1 address
  const handleCreateAddress = async (
    user: IUser | null,
    newAddress: IAddress
  ) => {
    if (user === null) {
      return;
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/address/add",
          {
            ...newAddress,
            idUser: user._id,
          }
        );
        if (response.data.success) {
          toast.success(response.data.message);
          fetchAddress();
          setNewAddress(defaultAddress);
          setOpenCreate(false);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        return;
      }
    }
  };

  // gán lại dữ liệu khi chọn tỉnh/thành phố dưới select
  const changeProvinceCreate = (provinceId: number) => {
    const provinceData = province.find((p) => p.ProvinceID === provinceId);
    if (provinceData) {
      setNewAddress({
        ...newAddress,
        provinceId: provinceData.ProvinceID,
        provinceName: provinceData.ProvinceName,
      });
      getDistricts(provinceData.ProvinceID);
    } else {
      toast.error("Không thể chọn Tỉnh/Thành phố");
    }
  };

  // gán lại dữ liệu khi chọn quận/huyện dưới select
  const changeDistricCreate = (districtId: number) => {
    const districtData = district.find((d) => d.DistrictID === districtId);
    if (districtData) {
      setNewAddress({
        ...newAddress,
        districtId: districtData.DistrictID,
        districtName: districtData.DistrictName,
      });
      getWard(districtData.DistrictID);
    } else {
      toast.error("Không thể chọn Quận/Huyện");
    }
  };

  // gán lại dữ liệu khi chọn xã/phường dưới select
  const changeWardCreate = (wardId: number) => {
    const wardData = ward.find((w) => w.WardCode === String(wardId));
    if (wardData) {
      setNewAddress({
        ...newAddress,
        wardId: Number(wardData.WardCode),
        wardName: wardData.WardName,
      });
    } else {
      toast.error("Không thể chọn Xã/Phường");
    }
  };

  // open button cập nhật
  const [idAddress, setIdAddress] = useState<string | null>(null);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const openModelUpdateAddress = (id: string | null) => {
    handleFindAddress(id);
    setIdAddress(id);
  };

  // khởi tạo address cập nhật
  const [editAddress, setEditAddress] = useState<IAddress>(defaultAddress);

  // api xem chi tiết 1 address
  const handleFindAddress = async (id: string | null) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/address/${id}`
      );
      if (response.data.success) {
        setEditAddress(response.data.data);
        getProvinces();
        getDistricts(response.data.data.provinceId);
        getWard(response.data.data.districtId);
        setOpenUpdate(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      return;
    }
  };

  // api tạo mới 1 address
  const handleUpdateAddress = async (
    id: string | null,
    user: IUser | null,
    editAddress: IAddress
  ) => {
    if (user === null) {
      return;
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/address/update",
          {
            ...editAddress,
            _id: id,
            idUser: user._id,
          }
        );
        if (response.data.success) {
          toast.success(response.data.message);
          fetchAddress();
          setEditAddress(defaultAddress);
          setIdAddress(null);
          setOpenUpdate(false);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        return;
      }
    }
  };

  // gán lại dữ liệu khi chọn tỉnh/thành phố dưới select
  const changeProvinceUpdate = (provinceId: number) => {
    const provinceData = province.find((p) => p.ProvinceID === provinceId);
    if (provinceData) {
      setEditAddress({
        ...editAddress,
        provinceId: provinceData.ProvinceID,
        provinceName: provinceData.ProvinceName,
        districtId: 0,
        districtName: "",
        wardId: 0,
        wardName: "",
        specifically: "",
      });
      getDistricts(provinceData.ProvinceID);
    } else {
      toast.error("Không thể chọn Tỉnh/Thành phố");
    }
  };

  // gán lại dữ liệu khi chọn quận/huyện dưới select
  const changeDistricUpdate = (districtId: number) => {
    const districtData = district.find((d) => d.DistrictID === districtId);
    if (districtData) {
      setEditAddress({
        ...editAddress,
        districtId: districtData.DistrictID,
        districtName: districtData.DistrictName,
        wardId: 0,
        wardName: "",
        specifically: "",
      });
      getWard(districtData.DistrictID);
    } else {
      toast.error("Không thể chọn Quận/Huyện");
    }
  };

  // gán lại dữ liệu khi chọn xã/phường dưới select
  const changeWardUpdate = (wardId: number) => {
    const wardData = ward.find((w) => w.WardCode === String(wardId));

    if (wardData) {
      setEditAddress({
        ...editAddress,
        wardId: Number(wardData.WardCode),
        wardName: wardData.WardName,
        specifically: "",
      });
    } else {
      toast.error("Không thể chọn Xã/Phường");
    }
  };

  const modelDeleteAddress = (id: string | null) => {
    confirmStatus({
      title: "Xác nhận",
      text: "Xác nhận xóa địa chỉ ?",
    }).then((result) => {
      if (result) {
        handleDeleteAddress(id);
      }
    });
  };

  // api xóa địa chỉ
  const handleDeleteAddress = async (id: string | null) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/address/delete/${id}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchAddress();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    fetchAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                      Tài khoản của tôi
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* breadcrumb area end */}

      {user && address.length > 0 ? (
        <div
          className="container"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <ProfileMenu small={false} />
            </Col>
            <Col span={18}>
              <Typography.Title
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#c29957",
                }}
                level={3}
              >
                Địa chỉ của tôi
              </Typography.Title>
              <Row
                style={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Button
                  icon={<PlusSquareOutlined />}
                  style={{
                    float: "right",
                    borderColor: "#c29957",
                    color: "#c29957",
                  }}
                  onClick={openModelCreateAddress}
                >
                  Thêm địa chỉ
                </Button>
              </Row>
              <Row style={{ marginTop: "20px" }}>
                {address.map((address) => (
                  <Card
                    style={{
                      width: "100%",
                      marginBottom: "20px",
                      borderColor: "#c29957",
                    }}
                  >
                    <Card type="inner">
                      <Typography.Title level={5}>
                        {`${address.fullName} | ${address.phoneNumber}`}
                        <span
                          style={{
                            marginLeft: "10px",
                            border: address.isDefault
                              ? "1px solid #c29957"
                              : "",
                            fontWeight: 500,
                            fontSize: "10px",
                            color: "#c29957",
                            padding: "5px",
                          }}
                        >
                          {address.isDefault ? "Mặc đinh" : ""}
                        </span>
                        <Button
                          icon={<DeleteOutlined style={{ color: "red" }} />}
                          style={{
                            float: "right",
                            marginLeft: "10px",
                          }}
                          onClick={() => modelDeleteAddress(address._id)}
                        />
                        <Button
                          icon={<EditOutlined style={{ color: "orange" }} />}
                          style={{
                            float: "right",
                          }}
                          onClick={() => openModelUpdateAddress(address._id)}
                        />
                      </Typography.Title>
                    </Card>
                    <Card type="inner">
                      <Row gutter={16}>
                        <Col span={8}>
                          <Typography.Title level={5}>
                            Tỉnh/Thành phố
                          </Typography.Title>
                          <Input readOnly value={address.provinceName} />
                        </Col>
                        <Col span={8}>
                          <Typography.Title level={5}>
                            Quận/Huyện
                          </Typography.Title>
                          <Input readOnly value={address.districtName} />
                        </Col>
                        <Col span={8}>
                          <Typography.Title level={5}>
                            Xã/Phường
                          </Typography.Title>
                          <Input readOnly value={address.wardName} />
                        </Col>
                      </Row>
                      <Row style={{ marginTop: "20px" }}>
                        <Typography.Title level={5}>
                          Địa chỉ cụ thể
                        </Typography.Title>
                        <Input readOnly value={address.specifically} />
                      </Row>
                    </Card>
                  </Card>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      ) : (
        <div className="container">
          <Row gutter={16}>
            <Col span={6}>
              <ProfileMenu small={false} />
            </Col>
            <Col span={18}>
              <Typography.Title
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#c29957",
                }}
                level={3}
              >
                Địa chỉ của tôi
              </Typography.Title>
              <Button
                icon={<PlusSquareOutlined />}
                style={{
                  float: "right",
                  borderColor: "#c29957",
                  color: "#c29957",
                }}
                onClick={openModelCreateAddress}
              >
                Thêm địa chỉ
              </Button>
              <Empty />
            </Col>
          </Row>
        </div>
      )}

      {/* Modal tạo mới */}
      <Modal
        title="Thêm địa chỉ"
        open={openCreate}
        onOk={() => handleCreateAddress(user, newAddress)}
        onCancel={() => setOpenCreate(false)}
      >
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text>
            <strong>Họ và tên</strong>
            <span style={{ color: "red", marginLeft: "5px" }}>*</span>
          </Typography.Text>
          <Input
            value={newAddress.fullName}
            onChange={(e) =>
              setNewAddress({ ...newAddress, fullName: e.target.value })
            }
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text>
            <strong>Số điện thoại</strong>
            <span style={{ color: "red", marginLeft: "5px" }}>*</span>
          </Typography.Text>
          <Input
            value={newAddress.phoneNumber}
            onChange={(e) =>
              setNewAddress({ ...newAddress, phoneNumber: e.target.value })
            }
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text>
            <strong>Tỉnh/Thành phố</strong>
            <span style={{ color: "red", marginLeft: "5px" }}>*</span>
          </Typography.Text>
          <Select
            style={{ width: "100%" }}
            value={newAddress.provinceId}
            onChange={(e) => changeProvinceCreate(e)}
          >
            <Select.Option value={0}>Chọn Tỉnh/Thành phố</Select.Option>
            {province.map((province: IPronvince) => (
              <Select.Option
                key={province.ProvinceID}
                value={province.ProvinceID}
              >
                {province.ProvinceName}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text>
            <strong>Quận/Huyện</strong>
            <span style={{ color: "red", marginLeft: "5px" }}>*</span>
          </Typography.Text>
          <Select
            style={{ width: "100%" }}
            value={newAddress.districtId}
            onChange={(e) => changeDistricCreate(e)}
            disabled={newAddress.provinceId === 0}
          >
            <Select.Option value={0}>Chọn Quận/Huyện</Select.Option>
            {district.map((district: IDistrict) => (
              <Select.Option
                key={district.DistrictID}
                value={district.DistrictID}
              >
                {district.DistrictName}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text>
            <strong>Xã/Phường</strong>
            <span style={{ color: "red", marginLeft: "5px" }}>*</span>
          </Typography.Text>
          <Select
            style={{ width: "100%" }}
            value={newAddress.wardId}
            onChange={(e) => changeWardCreate(e)}
            disabled={newAddress.districtId === 0}
          >
            <Select.Option value={0}>Xã/Phường</Select.Option>
            {ward.map((ward: IWard) => (
              <Select.Option
                key={Number(ward.WardCode)}
                value={Number(ward.WardCode)}
              >
                {ward.WardName}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text>
            <strong>Địa chỉ cụ thể</strong>
            <span style={{ color: "red", marginLeft: "5px" }}>*</span>
          </Typography.Text>
          <Input
            disabled={newAddress.wardId === 0}
            value={newAddress.specifically}
            onChange={(e) =>
              setNewAddress({ ...newAddress, specifically: e.target.value })
            }
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text>
            <strong>Đặt làm mặc định</strong>
          </Typography.Text>
          <Switch
            style={{ marginLeft: "30px" }}
            checked={newAddress.isDefault}
            value={newAddress.isDefault}
            onChange={(e) => setNewAddress({ ...newAddress, isDefault: e })}
          />
        </div>
      </Modal>

      {/* Modal cập nhật */}
      <Modal
        title="Thêm địa chỉ"
        open={openUpdate}
        onOk={() => handleUpdateAddress(idAddress, user, editAddress)}
        onCancel={() => setOpenUpdate(false)}
      >
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text>
            <strong>Họ và tên</strong>
            <span style={{ color: "red", marginLeft: "5px" }}>*</span>
          </Typography.Text>
          <Input
            value={editAddress.fullName}
            onChange={(e) =>
              setEditAddress({ ...editAddress, fullName: e.target.value })
            }
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text>
            <strong>Số điện thoại</strong>
            <span style={{ color: "red", marginLeft: "5px" }}>*</span>
          </Typography.Text>
          <Input
            value={editAddress.phoneNumber}
            onChange={(e) =>
              setEditAddress({ ...editAddress, phoneNumber: e.target.value })
            }
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text>
            <strong>Tỉnh/Thành phố</strong>
            <span style={{ color: "red", marginLeft: "5px" }}>*</span>
          </Typography.Text>
          <Select
            style={{ width: "100%" }}
            value={editAddress.provinceId}
            onChange={(e) => changeProvinceUpdate(e)}
          >
            <Select.Option value={0}>Chọn Tỉnh/Thành phố</Select.Option>
            {province.map((province: IPronvince) => (
              <Select.Option
                key={province.ProvinceID}
                value={province.ProvinceID}
              >
                {province.ProvinceName}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text>
            <strong>Quận/Huyện</strong>
            <span style={{ color: "red", marginLeft: "5px" }}>*</span>
          </Typography.Text>
          <Select
            style={{ width: "100%" }}
            value={editAddress.districtId}
            onChange={(e) => changeDistricUpdate(e)}
            disabled={editAddress.provinceId === 0}
          >
            <Select.Option value={0}>Chọn Quận/Huyện</Select.Option>
            {district.map((district: IDistrict) => (
              <Select.Option
                key={district.DistrictID}
                value={district.DistrictID}
              >
                {district.DistrictName}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text>
            <strong>Xã/Phường</strong>
            <span style={{ color: "red", marginLeft: "5px" }}>*</span>
          </Typography.Text>
          <Select
            style={{ width: "100%" }}
            value={editAddress.wardId}
            onChange={(e) => changeWardUpdate(e)}
            disabled={editAddress.districtId === 0}
          >
            <Select.Option value={0}>Xã/Phường</Select.Option>
            {ward.map((ward: IWard) => (
              <Select.Option
                key={Number(ward.WardCode)}
                value={Number(ward.WardCode)}
              >
                {ward.WardName}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text>
            <strong>Địa chỉ cụ thể</strong>
            <span style={{ color: "red", marginLeft: "5px" }}>*</span>
          </Typography.Text>
          <Input
            disabled={editAddress.wardId === 0}
            value={editAddress.specifically}
            onChange={(e) =>
              setEditAddress({ ...editAddress, specifically: e.target.value })
            }
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Typography.Text>
            <strong>Đặt làm mặc định</strong>
          </Typography.Text>
          <Switch
            style={{ marginLeft: "30px" }}
            checked={editAddress.isDefault}
            onChange={(e) => setEditAddress({ ...editAddress, isDefault: e })}
          />
        </div>
      </Modal>
    </div>
  );
}
