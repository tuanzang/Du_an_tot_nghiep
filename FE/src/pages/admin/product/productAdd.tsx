import {
  Card,
  Typography,
  Space,
  AutoComplete,
  Input,
  InputNumber,
  Row,
  Col,
  Button,
  Modal,
  Select,
  Table,
  Image,
  Tooltip,
} from "antd";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import { useEffect, useState } from "react";
import {
  CloseOutlined,
  DeleteOutlined,
  PictureOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";
interface IProduct {
  id: number;
  name: string;
}

interface ISize {
  id: number;
  name: string;
}

interface ICategory {
  id: number;
  name: string;
}

interface INewProducts {
  key: string | null;
  product: IProduct | null;
  price: number | null;
  amount: number | null;
  weight: number | null;
  size: ISize | null;
  image: string[];
  description: string | null;
  quantity: number | null;
  category: ICategory | null;
}

interface IProductDetail {
  product: IProduct | null;
  price: number | null;
  size: ISize[];
  image: string[];
  description: string | null;
  quantity: number | null;
  category: ICategory | null;
}

interface IError {
  key: string;
  message: string;
}

export default function ProductAdd() {
  const [newProductDetails, setNewProductDetails] = useState<INewProducts[]>(
    []
  );
  const [productsCheck, setProductsCheck] = useState<INewProducts[]>([]);
  const [productDelete, setProductDelete] = useState<INewProducts[]>([]);
  const [selectSize, setSelectSize] = useState<ISize[]>([]);
  const [openModalSize, setOpenModalSize] = useState(false);
  const [listErr, setListErr] = useState<IError[]>([]);
  const [newProducts, setNewProducts] = useState<IProductDetail>({
    product: null,
    price: 0,
    size: [],
    image: [],
    description: "",
    quantity: 0,
    category: null,
  });

  const newProductIsUndefined = (newProducts: IProductDetail) => {
    return (
      newProducts.product !== null &&
      newProducts.price !== null &&
      newProducts.size !== null &&
      newProducts.quantity !== null &&
      newProducts.category !== null
    );
  };

  const products = [{ id: 1, name: "1" }];
  const sizes = [
    { id: 1, name: "X" },
    { id: 2, name: "M" },
    { id: 3, name: "L" },
  ];
  const [cates, setCates] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/categories");
        setCates(response.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

    function removeErrorByKey(key: string) {
      setListErr((prevErrors: IError[]) =>
        prevErrors.filter((error: IError) => error.key !== key)
      );
    }

    const updateNewProductDetail = (productDetail: INewProducts) => {
      if (productDetail?.key) {
        removeErrorByKey(productDetail?.key);
        setNewProductDetails((prevDetails) => {
          return prevDetails.map((detail) => {
            if (detail.key === productDetail.key) {
              return productDetail;
            }
            return detail;
          });
        });
      } else {
        return;
      }
    };

    function deleteNewProduct(productDetail: INewProducts) {
      const preNewProductDetails = [...newProductDetails];
      preNewProductDetails.splice(preNewProductDetails.indexOf(productDetail), 1);
      setNewProductDetails(preNewProductDetails);

      const preProductChecks = [...productsCheck];
      preProductChecks.splice(preProductChecks.indexOf(productDetail), 1);
      setProductsCheck(preProductChecks);

      setProductDelete([...productDelete, productDetail]);
    }

    const genNewProductDetail = (newProducts: IProductDetail) => {
      setNewProducts(newProducts);
      console.log(newProducts);

      if (newProductIsUndefined(newProducts)) {
        const preNewProductDetails: INewProducts[] = [];

        newProducts.size.forEach((siz, index) => {
          preNewProductDetails.push({
          key: `${index}`,
          product: newProducts?.product,
          price: 100000,
          amount: 100,
          weight: 500,
          size: siz,
          image: [],
          description: newProducts?.description,
          quantity: 0,
          category: newProducts?.category,
        });
      });

      if (newProducts.product?.id) {
        // sanPhamApi.filter(newProducts.product.id).then((response) => {
        //   if (response.status === 200) {
        //     const filterData = response.data ? response.data : [];
        //     setNewProductDetails(
        //       preNewProductDetails
        //         .filter((e) => !filterData.includes(e.key))
        //         .map((productDetail) => {
        //           const checkExists = newProductDetails.find(
        //             (pd) => pd.key === productDetail.key
        //           );
        //           if (checkExists)
        //             return {
        //               ...checkExists,
        //               product: newProducts.product,
        //               description: newProducts.description,
        //             };
        //           return {
        //             ...productDetail,
        //             product: newProducts.product,
        //             description: newProducts.description,
        //           };
        //         })
        //     );
        //   } else {
        //     alert("Lỗi hệ thống vui lòng thử lại!");
        //   }
        // });
      } else {
        setNewProductDetails(
          preNewProductDetails.map((productDetail) => {
            const checkExists = newProductDetails.find(
              (pd) => pd.key === productDetail.key
            );
            if (checkExists)
              return {
                ...checkExists,
                product: newProducts.product,
                description: newProducts.description,
              };
            return {
              ...productDetail,
              product: newProducts.product,
              description: newProducts.description,
            };
          })
        );
      }
    }
  };

  // const filterOptions = (options: IProduct[], params: FilterOption) => {
  //   const filtered: IProduct[] = options.filter((option) =>
  //     option.name.toLowerCase().includes(params.inputValue.trim().toLowerCase())
  //   );
  //   if (params.inputValue.trim() !== "") {
  //     filtered.push(newProducts);
  //   }
  //   return filtered;
  // };

  const handleSelectCategory = (value: number) => {
    const lable =
      value !== undefined && value != null
        ? categorys.find((c) => c.value === value)?.label
        : null;
    return {
      id: value,
      name: String(lable),
    };
  };

  const handleSelectSize = ({ id, name }: ISize) => {
    const selectedIndex = selectSize.findIndex((s) => s.id === id);
    let newSelectedIds = [];

    if (selectedIndex === -1) {
      newSelectedIds = [...selectSize, { id, name }];
    } else {
      newSelectedIds = [
        ...selectSize.slice(0, selectedIndex),
        ...selectSize.slice(selectedIndex + 1),
      ];
    }
    setSelectSize(newSelectedIds);
    genNewProductDetail({ ...newProducts, size: newSelectedIds });
    setProductDelete([
      ...productDelete.filter((product) => product.size?.name !== name),
    ]);
    setProductsCheck([
      ...productsCheck.filter((product) => product.size?.name !== name),
    ]);
  };
  return (
    <div>
      <BreadcrumbsCustom
        listLink={[{ link: "/admin/product", name: "Sản phẩm" }]}
        nameHere="Thêm sản phẩm"
      />
      <Card style={{ padding: "16px" }}>
        <div className="container">
          <Typography.Title
            level={4}
            style={{ textAlign: "center", fontWeight: 600, color: "#888" }}
          >
            Thông tin sản phẩm
          </Typography.Title>
          <Space direction="vertical" style={{ width: "100%" }}>
            <div className="mb-3">
              <b>
                <span style={{ color: "red" }}>*</span>Tên sản phẩm
              </b>
              <AutoComplete
                size="small"
                style={{ width: "100%" }}
                onChange={(value: IProduct) => {
                  genNewProductDetail({ ...newProducts, product: value });
                }}
              >
                <Input
                  onChange={(e) => {
                    const foundProduct = products.find(
                      (product) =>
                        product.name.toLowerCase() ===
                        e.target.value.toLowerCase().trim()
                    );

                    if (foundProduct) {
                      genNewProductDetail({
                        ...newProducts,
                        product: foundProduct,
                      });
                    } else {
                      genNewProductDetail({
                        ...newProducts,
                        product: {
                          id: 0,
                          name: e.target.value,
                        },
                      });
                    }
                  }}
                  placeholder="Nhập tên sản phẩm"
                />
              </AutoComplete>
            </div>
            <div className="mb-3">
              <b>
                <span style={{ color: "red" }}>*</span>Danh mục sản phẩm
              </b>
              <Select
                style={{ width: "100%" }}
                allowClear
                options={categorys}
                onChange={(e) => {
                  genNewProductDetail({
                    ...newProducts,
                    category: handleSelectCategory(Number(e)) || null,
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <b>
                <span style={{ color: "red" }}>*</span>Giá sản phẩm
              </b>
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                value={newProducts?.price}
                onChange={(value) =>
                  genNewProductDetail({ ...newProducts, price: Number(value) })
                }
                placeholder="Nhập giá sản phẩm"
              />
            </div>
            <div>
              <b>Mô tả sản phẩm</b>
              <Input.TextArea
                onChange={(e) => {
                  genNewProductDetail({
                    ...newProducts,
                    description: e.target.value,
                  });
                }}
                placeholder="Nhập mô tả sản phẩm"
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            </div>
            <div className="mb-3">
              <Row gutter={16} style={{ marginTop: "16px" }}>
                <Col span={4}>
                  <b>
                    <span style={{ color: "red" }}>*</span>Kích cỡ :
                  </b>
                </Col>
                <Col span={20}>
                  <Row gutter={16}>
                    {selectSize.map((s) => (
                      <Col span={4} key={s.id}>
                        <div style={{ position: "relative" }}>
                          <Button
                            disabled
                            style={{
                              width: "90%",
                              height: "30px",
                              backgroundColor: "white",
                              border: "1px solid black",
                            }}
                          >
                            <span style={{ color: "black" }}>{s.name}</span>
                          </Button>
                          <CloseOutlined
                            onClick={() => handleSelectSize(s)}
                            style={{
                              cursor: "pointer",
                              position: "absolute",
                              right: "5px",
                              top: "-6px",
                              backgroundColor: "red",
                              color: "white",
                              fontWeight: "bold",
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              textAlign: "center",
                              lineHeight: "20px",
                            }}
                          />
                        </div>
                      </Col>
                    ))}
                    <Col span={4}>
                      <Button
                        className="button-category-size"
                        onClick={() => setOpenModalSize(true)}
                        icon={<PlusOutlined />}
                      ></Button>
                    </Col>
                  </Row>
                </Col>

                <Modal
                  title="Chọn kích cỡ"
                  open={openModalSize}
                  onCancel={() => setOpenModalSize(false)}
                  onOk={() => {
                    genNewProductDetail(newProducts), setOpenModalSize(false);
                  }}
                >
                  <Row gutter={16}>
                    {sizes.map((s) => (
                      <Col span={6} key={s.id}>
                        <div style={{ position: "relative" }}>
                          <Button
                            style={{
                              backgroundColor: selectSize.some(
                                (sz) => sz.id === s.id
                              )
                                ? "gray"
                                : "white",
                              border: "1px solid #000000",
                              height: "30px",
                            }}
                            onClick={() => handleSelectSize(s)}
                          >
                            <span
                              style={{
                                fontSize: "10px",
                                color: "black",
                              }}
                            >
                              {s.name}
                            </span>
                          </Button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Modal>
              </Row>
            </div>
          </Space>
        </div>
      </Card>
      {newProductIsUndefined(newProducts) &&
        newProducts.size.map((size, sizeIndex) => (
          <Card style={{ padding: "16px", marginTop: "16px" }}>
            <div
              key={`papaerNewProduct${sizeIndex}`}
              style={{
                padding: "16px",
                marginTop: "16px",
                backgroundColor: "#f5f5f5",
              }}
            >
              <div>
                <Space direction="vertical">
                  <Typography.Text style={{ fontWeight: 600, color: "gray" }}>
                    {`${newProducts.category?.name} ${newProducts.product?.name} ${size.name}`}
                  </Typography.Text>
                  {newProductDetails.filter(
                    (productDetail) => productDetail.size?.name === size.name
                  ).length > 0 ? (
                    <Table
                      style={{ marginTop: "16px", marginBottom: "16px" }}
                      pagination={false}
                      rowKey="key"
                      dataSource={newProductDetails.filter(
                        (productDetail) =>
                          productDetail.size?.name === size.name
                      )}
                    >
                      {/* <Table.Column
                        title=""
                        render={() => (
                          <Checkbox
                            checked={
                              newProductDetails.filter(
                                (productDetail) =>
                                  productDetail.size?.name === size.name
                              ).length ===
                              productsCheck.filter(
                                (productDetail) =>
                                  productDetail.size?.name === size.name
                              ).length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProductsCheck([
                                  ...productsCheck.filter(
                                    (pd) =>
                                      !newProductDetails
                                        .filter(
                                          (productDetail) =>
                                            productDetail.size?.name ===
                                            size.name
                                        )
                                        .some(
                                          (product) => product.key === pd.key
                                        )
                                  ),
                                  ...newProductDetails.filter(
                                    (productDetail) =>
                                      productDetail.size?.name === size.name
                                  ),
                                ]);
                              } else {
                                setProductsCheck([
                                  ...productsCheck.filter(
                                    (pd) =>
                                      !newProductDetails
                                        .filter(
                                          (productDetail) =>
                                            productDetail.size?.name ===
                                            size.name
                                        )
                                        .some(
                                          (product) => product.key === pd.key
                                        )
                                  ),
                                ]);
                              }
                            }}
                          />
                        )}
                      /> */}
                      <Table.Column
                        title="Sản phẩm"
                        render={() => (
                          <Typography.Text>
                            {newProducts.product?.name}
                          </Typography.Text>
                        )}
                      />
                      <Table.Column
                        title="Kích cỡ"
                        render={(_, record: INewProducts) => (
                          <Typography.Text>{record.size?.name}</Typography.Text>
                        )}
                      />
                      <Table.Column
                        title="Cân nặng"
                        render={(_, record: INewProducts) => (
                          <Input
                            value={Number(record.weight)}
                            onChange={(e) =>
                              updateNewProductDetail({
                                ...record,
                                weight: Number(e.target.value),
                              })
                            }
                            suffix="g"
                            style={{ textAlign: "center" }}
                          />
                        )}
                      />
                      <Table.Column
                        title="Số lượng"
                        render={(_, record: INewProducts) => (
                          <Input
                            value={Number(record.amount)}
                            onChange={(e) =>
                              updateNewProductDetail({
                                ...record,
                                amount: Number(e.target.value),
                              })
                            }
                            style={{ textAlign: "center" }}
                          />
                        )}
                      />
                      <Table.Column
                        title="Giá"
                        render={(_, record: INewProducts) => (
                          <Input
                            value={Number(record.price)}
                            onChange={(e) =>
                              updateNewProductDetail({
                                ...record,
                                price: Number(e.target.value),
                              })
                            }
                            style={{ textAlign: "center" }}
                          />
                        )}
                      />
                      <Table.Column
                        render={(_, record: INewProducts) => (
                          <DeleteOutlined
                            onClick={() => {
                              removeErrorByKey(String(record.key));
                              deleteNewProduct(record);
                            }}
                            style={{
                              cursor: "pointer",
                              fontSize: "20px",
                              color: "#da0722",
                            }}
                          />
                        )}
                      />
                      <Table.Column
                        title="Ảnh"
                        render={(_, record: INewProducts) => (
                          <Space direction="horizontal" align="center">
                            {record.image.length > 0 ? (
                              record.image.map((ima: string, index: number) => (
                                <Image
                                  key={`showImage${index}`}
                                  width={100}
                                  height={100}
                                  src={ima}
                                  alt="anh-san-pham"
                                  style={{ border: "1px dashed #ccc" }}
                                />
                              ))
                            ) : (
                              <Tooltip title="Chỉnh sửa ảnh">
                                <div
                                  style={{
                                    cursor: "pointer",
                                    border: "1px dashed #ccc",
                                    width: "100px",
                                    height: "100px",
                                    textAlign: "center",
                                    lineHeight: "100px",
                                  }}
                                >
                                  <PictureOutlined
                                    style={{
                                      fontSize: "20px",
                                      marginRight: "5px",
                                    }}
                                  />
                                  Ảnh
                                </div>
                              </Tooltip>
                            )}
                          </Space>
                        )}
                      />
                    </Table>
                  ) : (
                    <img
                      height={"200px"}
                      width={"100%"}
                      src={"../../src/assets/image/404-page.gif"}
                      alt="no-data"
                    />
                  )}
                </Space>
              </div>
            </div>
          </Card>
        ))}
      {newProductDetails.length > 0 && (
        <Button style={{ float: "right" }}>Lưu thay đổi</Button>
      )}
    </div>
  );
}
