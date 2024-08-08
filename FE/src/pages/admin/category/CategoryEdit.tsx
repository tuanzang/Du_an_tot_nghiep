import type { FormProps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Form, Input, InputNumber, Row } from "antd";
import { ICategory } from "../../../interface/Categories";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import { toast } from "react-toastify";

const listHis = [{ link: "/admin/category", name: "Danh mục" }];

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [nameCate, setNameCate] = useState<string>("");
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `http://localhost:3001/api/categories/${id}`
      );
      form.setFieldsValue(data.data);
      setNameCate(data ? data.data.loai : "");
      return data;
    })();
  }, [id]);
  const onFinish: FormProps<ICategory>["onFinish"] = async (values) => {
    try {
      await axios.put(`http://localhost:3001/api/categories/${id}`, values);
      toast("Cập nhật thành công");
      navigate("/admin/category");
    } catch (err) {
      toast.error("Error");
    }
  };

  const onFinishFailed: FormProps<ICategory>["onFinishFailed"] = (
    errorInfo
  ) => {
    toast.error("Failed: " + errorInfo);
  };

  return (
    <div>
      <BreadcrumbsCustom nameHere={nameCate} listLink={listHis} />
      <Card bordered={false}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<ICategory> label="Loại" name="loai">
            <Input type="text" />
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
                        key={key}
                        align={"middle"}
                        justify={"space-between"}
                        style={{ marginBottom: 12 }}
                        gutter={[12, 12]}
                        wrap={false}
                      >
                        <Col>
                          <Form.Item
                            {...restField}
                            name={[name, "name"]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập tên phụ kiện",
                              },
                            ]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input placeholder="Tên phụ kiện" />
                          </Form.Item>
                        </Col>

                        <Col>
                          <Form.Item
                            {...restField}
                            name={[name, "price"]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập giá phụ kiện",
                              },
                            ]}
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber placeholder="Giá phụ kiện" />
                          </Form.Item>
                        </Col>

                        <Col>
                          <Form.Item
                            {...restField}
                            name={[name, "quantity"]}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập số lượng phụ kiện",
                              },
                            ]}
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber placeholder="Số lượng phụ kiện" />
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

export default CategoryEdit;
