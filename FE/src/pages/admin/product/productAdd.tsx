import type { FormProps } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Upload, Card, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { IProduct } from "../../../interface/Products";
import { useEffect, useState, useRef } from "react";
import { ICategory } from "../../../interface/Categories";
import { toast } from "react-toastify";
import { uploadImage } from "../../../services/upload/upload";
import { UploadFile } from "antd/lib";
// import { ISize } from "../../../interface/Size";
// import { IProductSize } from "../../../interface/ProductSize";
import BreadcrumbsCustom from "../../../components/BreadcrumbsCustom";
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
import OptionFormItem from "./OptionFormItem";
import axiosInstance from "../../../config/axios";
import { IOption } from "../../../interface/Option";

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
  initialData: "",
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

const ProductAdd = () => {
  const navigate = useNavigate();
  const [cates, setCates] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [options, setOptions] = useState<IOption[]>([])

  const [form] = Form.useForm();

  const categoryId = Form.useWatch('categoryId', form);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/categories"
        );
        setCates(response.data?.data);

        const responseSizes = await axios.get(
          "http://localhost:3001/api/sizes"
        );
        setSizes(responseSizes.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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

  const dataCates = cates.map((item: ICategory) => {
    return {
      value: item._id,
      label: item.loai,
    };
  });

  // const [quantity, setQuantity] = useState<Number>(0)
  const onFinish: FormProps<IProduct>["onFinish"] = async (values: any) => {
    try {
      // Upload images
      // Lấy danh sách các file từ fileList
      const imageFiles: File[] = fileList.map(
        (file) => file.originFileObj as File
      );

      // Upload images
      const uploadedImageUrls = await uploadImage(imageFiles);

      // Update values with uploaded image URLs
      const {
        name,
        image,
        description: desc,
        categoryId,
        options,
        ...rest
      } = { ...values, image: uploadedImageUrls, description } as any;

      // Send product data to server
      const dataProduct = await axios.post(
        `http://localhost:3001/api/products/add`,
        { name, image, description, categoryId, options }
      );

      await axios.post(
        `http://localhost:3001/api/products/${dataProduct.data.data._id}/add/size`,
        { ...rest }
      );
      toast.success("Thêm sản phẩm thành công");
      navigate("/admin/product");
    } catch (err) {
      console.log(err);
    }
  };

  const onFinishFailed: FormProps<IProduct>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const onDescriptionChange = (_event: any, editor: any) => {
    const data = editor.getData();
    setDescription(data);
  };

  return (
    <div className="">
      <BreadcrumbsCustom nameHere={"Thêm sản phẩm"} listLink={[]} />
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}
      >
        <div className="d-flex flex-row px-5 py-3">
          <Card>
            <Form.Item<IProduct>
              label="Tên sản phẩm"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<IProduct>
              label="Danh mục"
              name="categoryId"
              rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
            >
              <Select
                defaultValue="Chọn danh mục"
                style={{
                  width: 150,
                }}
                options={dataCates}
              />
            </Form.Item>
          </Card>

          <Card>
            <div>
              {sizes.map((it: any) => (
                <Space
                  key={it._id}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <p>{it.name}</p>
                  <Form.Item
                    name={"quantity" + "-" + it._id}
                    rules={[
                      { required: true, message: "Vui lòng nhập số lượng" },
                    ]}
                  >
                    <Input placeholder="Số lượng" type="number" />
                  </Form.Item>
                  <Form.Item
                    name={"price" + "-" + it._id}
                    rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                  >
                    <Input placeholder="Giá" type="number" />
                  </Form.Item>
                </Space>
              ))}
            </div>
          </Card>

          <Card>
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
                // maxCount={1}
                beforeUpload={() => false}
                multiple
                accept=".jpg,.png,.jpeg"
                onChange={handleUploadChange}
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
            </Form.Item>
          </Card>
        </div>

        <Card className="mb-3">
          <p>Phụ kiện</p>

          <Form.Item name='options'>
            <OptionFormItem options={options} />
          </Form.Item>
        </Card>

        <div>
          <Card>
            <div
              className="editor-container editor-container_classic-editor"
              ref={editorContainerRef}
            >
              <div className="editor-container__editor">
                <div ref={editorRef}>
                  {isLayoutReady && (
                    <CKEditor
                      editor={ClassicEditor}
                      config={editorConfig as any}
                      data={description}
                      onChange={onDescriptionChange}
                    />
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-5">
          <Form.Item
            wrapperCol={{ offset: 8, span: 16 }}
            style={{ float: "right", paddingRight: "25px" }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default ProductAdd;
