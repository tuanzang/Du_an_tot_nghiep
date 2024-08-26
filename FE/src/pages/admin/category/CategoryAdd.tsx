import type { FormProps } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Form, Input, InputNumber, Row, message } from "antd";
import { ICategory } from "../../../interface/Categories";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import FormImageItem from "./FormImageItem";

import { uploadImage } from "../../../services/upload/upload";

const listHis = [{ link: "/admin/category", name: "Danh mục" }];
const CategoryAdd = () => {
  const navigate = useNavigate();

  const onFinish: FormProps<ICategory>["onFinish"] = async (values) => {
    try {
      let options = [];

      if (values?.options) {
        options = await Promise.all(
          values?.options?.map(async (it) => {
            if (typeof it.image === "string") return it;
  
            const imageUploaded = await uploadImage([it.image]);
  
            return {
              ...it,
              image: imageUploaded[0],
            };
          })
        );
      }
      

      await axios.post(`http://localhost:3001/api/categories/add`, {
        ...values,
        options,
      });
      alert("Add category success");
      navigate("/admin/category");
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại');
      console.log(err);
    }
  };

  const onFinishFailed: FormProps<ICategory>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <BreadcrumbsCustom nameHere={"Tạo mới Danh mục"} listLink={listHis} />
      <Card bordered={false}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          style={{ maxWidth: 800 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<ICategory>
            label="Loại"
            name="loai"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên danh mục",
              },
            ]}
          >
            <Input type="text" placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Row gutter={12}>
            <Col span={8} style={{ textAlign: "right" }}>
              <p>Phụ kiện:</p>
            </Col>

            <Col span={16}>
              <Form.List name="options">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Row
                        gutter={24}
                        key={key}
                        align="middle"
                        style={{
                          borderBottom: "1px solid #ccc",
                          marginBottom: 24,
                        }}
                      >
                        <Col span={20}>
                          <Form.Item
                            {...restField}
                            name={[name, "name"]}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: "Vui lòng nhập tên phụ kiện",
                            //   },
                            // ]}
                          >
                            <Input placeholder="Tên phụ kiện" />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, "price"]}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: "Vui lòng nhập giá phụ kiện",
                            //   },
                            // ]}
                          >
                            <InputNumber
                              placeholder="Giá phụ kiện"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, "quantity"]}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: "Vui lòng nhập số lượng phụ kiện",
                            //   },
                            // ]}
                          >
                            <InputNumber
                              placeholder="Số lượng phụ kiện"
                              style={{ width: "100%" }}
                            />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, "image"]}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: "Vui lòng chọn ảnh phụ kiện",
                            //   },
                            // ]}
                          >
                            <FormImageItem />
                          </Form.Item>
                        </Col>

                        <Col>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Col>
                      </Row>
                    ))}

                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Thêm
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
          </Row>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CategoryAdd;
