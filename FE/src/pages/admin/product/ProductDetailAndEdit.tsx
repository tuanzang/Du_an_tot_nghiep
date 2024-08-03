import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useRef } from "react";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
import { Button, Card, Form, Input, Select, Space, Switch, Upload } from "antd";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/lib";
import { IProduct } from "../../../interface/Products";
import { IProductSize } from "../../../interface/ProductSize";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  AccessibilityHelp,
  Alignment,
  Autosave,
  Bold,
  Essentials,
  GeneralHtmlSupport,
  Highlight,
  Italic,
  Link,
  Paragraph,
  SelectAll,
  SpecialCharacters,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextPartLanguage,
  Title,
  Underline,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { uploadImage } from "../../../services/upload/upload";
import { toast } from "react-toastify";
import OptionFormItem from "./OptionFormItem";
import axiosInstance from "../../../config/axios";
import { ICategory } from "../../../interface/Categories";
import { IOption } from "../../../interface/Option";

export default function ProductDetailAndEdit() {
  const { id } = useParams<{ id: string }>(); // Lấy ID sản phẩm từ URL
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [name, setName] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [productSizes, setProductSizes] = useState<IProductSize[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isChanged1, setIsChanged1] = useState(false);
  const [isChanged2, setIsChanged2] = useState(false);
  const [productSizeForm] = Form.useForm();
  const [form] = Form.useForm()
  const [categories, setCategories] = useState<ICategory[]>([])
  const [options, setOptions] = useState<IOption[]>([])

  const categoryId = Form.useWatch('categoryId', form);

  useEffect(() => {
    // Gọi API để lấy chi tiết sản phẩm
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/products/${id}`
        );
        form.setFieldValue('categoryId', data.data.categoryId[0]);
        form.setFieldValue('options', data.data.options);
        setProduct(data.data);
        setName(data.data.name);
        setPrice(data.data.price);
        setDescription(data.data.description);
        if (data.data.image) {
          setFileList(
            data.data.image.map((url: string) => ({
              uid: url,
              name: url.split("/").pop() || "",
              status: "done",
              url,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    // Gọi API để lấy số lượng sản phẩm theo kích cỡ
    const fetchProductSizes = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/products/productSize/${id}`
        );
        setProductSizes(data.data);

        data?.data?.forEach((it) => {
          productSizeForm.setFieldValue(`price-${it.idSize}`, it.price);
          productSizeForm.setFieldValue(`quantity-${it.idSize}`, it.quantity);
        });
      } catch (error) {
        console.error("Error fetching product sizes:", error);
      }
    };

    fetchProductDetails();
    fetchProductSizes();
  }, [id]);

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    categoryId && fetchOptions(categoryId);
  }, [categoryId])

  const fetchOptions = async (categoryId: string) => {
    try {
      const {data} = await axiosInstance.get(`/options/${categoryId}`);
      setOptions(data.data);
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get('/categories');
      setCategories(data.data);
    } catch (error) {
      console.log(error)
    }
  }

  const onFieldsChange = () => {
    setIsChanged1(true);
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
    setIsChanged(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setIsChanged(true);
  };

  const handleDescriptionChange = (_event: any, editor: any) => {
    const data = editor.getData();
    setDescription(data);
    setIsChanged2(true);
  };

  const handleUpdateProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name || "");
      formData.append("description", description || "");
      let image: any = fileList.map((it) => it.url);

      // Nối fileList vào formData
      const newFileList = fileList.filter((it) => !it.status);
      if (newFileList.length) {
        const imageFiles: File[] = newFileList.map(
          (file) => file.originFileObj as File
        );

        image = await uploadImage(imageFiles);
      }

      // Cập nhật thông tin sản phẩm
      await axios.put(`http://localhost:3001/api/products/${id}`, {
        name,
        description,
        image,
      });
      toast.success("Cập nhật sản phẩm thành công");
      navigate("/admin/product");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Cập nhật sản phẩm thất bại");
    }
  };

  const handleUpdateProductSize = async (values: any) => {
    try {
      await axios.put(
        `http://localhost:3001/api/products/productSize/${id}`,
        values
      );
      toast.success("Cập nhật sản phẩm thành công");
      navigate("/admin/product");
    } catch (error) {
      console.error("Error updating product sizes:", error);
      toast.error("Cập nhật sản phẩm thất bại");
    }
  };

  const handleStatusChange = (checked, idSize) => {
    // Cập nhật trạng thái cho sản phẩm theo kích thước
    // Ví dụ, bạn có thể cập nhật trạng thái trong `productSizes` hoặc gọi một API để cập nhật trạng thái trên server
    console.log(`Status changed for size ${idSize}: ${checked}`);
  };

  useEffect(() => {
    setIsLayoutReady(true);
    return () => setIsLayoutReady(false);
  }, []);

  const editorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "selectAll",
        "textPartLanguage",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "specialCharacters",
        "link",
        "insertTable",
        "highlight",
        "|",
        "alignment",
        "|",
        "accessibilityHelp",
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      Autosave,
      Bold,
      Essentials,
      GeneralHtmlSupport,
      Highlight,
      Italic,
      Link,
      Paragraph,
      SelectAll,
      SpecialCharacters,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextPartLanguage,
      Title,
      Underline,
      Undo,
    ],
    htmlSupport: {
      allow: [
        {
          name: /^.*$/,
          styles: true,
          attributes: true,
          classes: true,
        },
      ],
    },
    initialData: description || "Mô tả sản phẩm",
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    placeholder: "Type or paste your content here!",
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
  };

  const onFinish = async (values: any) => {
    try {
      await axiosInstance.put(`/products/${id}`, values);
      toast.success("Cập nhật sản phẩm thành công");
      navigate("/admin/product");
    } catch (error) {
      console.log(error)      
    }
  }

  return (
    <div>
      <BreadcrumbsCustom
        listLink={[{ link: "/admin/product", name: "Sản phẩm" }]}
        nameHere={`${name}`}
      />
      <div className="w-50 mx-auto">
        <Card style={{ padding: "10px", marginBottom: "10px" }}>
          <form>
            <div className="form-group">
              <label htmlFor="">Tên sản phẩm</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Tên sản phẩm"
              />
            </div>

            <div className="mt-3">
              <Form.Item
                label="Ảnh"
                name="image"
                rules={[
                  { required: true, message: "Vui lòng tải lên ảnh sản phẩm!" },
                ]}
              >
                <Upload
                  name="image"
                  listType="picture"
                  beforeUpload={() => false}
                  multiple
                  accept=".jpg,.png,.jpeg"
                  fileList={fileList}
                  onChange={handleUploadChange}
                >
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                </Upload>
              </Form.Item>
            </div>

            {isChanged && (
              <Button
                type="primary"
                onClick={handleUpdateProduct}
                className="mt-2"
              >
                <EditOutlined />
                Cập nhật
              </Button>
            )}
          </form>
        </Card>

        <Card style={{ padding: "10px", marginBottom: "10px" }}>
          <Form
            form={productSizeForm}
            onFinish={handleUpdateProductSize}
            onFieldsChange={onFieldsChange}
          >
            {productSizes.map((it) => (
              <Space
                key={it._id}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <p>{it.sizeName}</p>
                <Form.Item
                  name={"quantity" + "-" + it.idSize}
                  rules={[
                    { required: true, message: "Vui lòng nhập số lượng" },
                  ]}
                >
                  <Input placeholder="Số lượng" type="number" />
                </Form.Item>
                <Form.Item
                  name={"price" + "-" + it.idSize}
                  rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                >
                  <Input placeholder="Giá" type="number" />
                </Form.Item>

                <Switch
                  checked={it.status === "active"}
                  onChange={(checked) => handleStatusChange(checked, it.idSize)}
                />
              </Space>
            ))}

            {isChanged1 && (
              <Button
                type="primary"
                className="mt-4"
                onClick={productSizeForm.submit}
              >
                <EditOutlined />
                Cập nhật
              </Button>
            )}
          </Form>
        </Card>

        <Card className="my-3">
          <Form form={form} layout='vertical' onFinish={onFinish}>
            <Form.Item name='categoryId' label="Danh mục SP">
              <Select onChange={() => form.setFieldValue('options', [])} options={categories.map(it => ({ label: it.loai, value: it._id }))} />
            </Form.Item>

            <Form.Item name='options'>
              <OptionFormItem options={options} />
            </Form.Item>

            <Button type='primary' htmlType='submit'>Update</Button>
          </Form>
        </Card>

        <Card style={{ padding: "10px", marginBottom: "10px" }}>
          <label style={{ fontSize: "20px" }} className="mb-2">
            Mô tả sản phẩm
          </label>
          <div
            className="editor-container editor-container_classic-editor"
            ref={editorContainerRef}
          >
            <div className="editor-container__editor">
              <div ref={editorRef}>
                {isLayoutReady && (
                  <CKEditor
                    editor={ClassicEditor}
                    config={editorConfig}
                    data={description || ""}
                    onChange={handleDescriptionChange}
                    name="description"
                  />
                )}
              </div>
            </div>
          </div>
          {isChanged2 && (
            <Button
              type="primary"
              onClick={handleUpdateProduct}
              className="mt-4"
            >
              <EditOutlined />
              Cập nhật
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
