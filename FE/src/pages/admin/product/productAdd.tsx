// import React, { useState } from "react";
// import { useProductMutation } from "../../../hooks/useProductMutation";
// import { Form, Input, Button } from 'antd';

// function ProductAdd() {
//   const [image, setImage] = useState<any>(null);
//   const { form, onSubmit, isPending } = useProductMutation({
//     action: "CREATE",
//     image,
//   });

//   const handleImageChange = (e: any) => {
//     const file = e.target.files[0];
//     setImage(file);
//   };

//   return (
//     <div>
//       <h1 className="text-center text-[30px]">Product Form</h1>
//       <form
//         action=""
//         className="flex flex-col items-center w-full"
//         onSubmit={form.handleSubmit(onSubmit)}
//       >
//         <div className="mb-5">
//           <label
//             htmlFor="base-input"
//             className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//           >
//             Product Name
//           </label>
//           <input
//             type="text"
//             id="base-input"
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[600px] h-[50px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//             {...form.register("name", { required: true })}
//           />
//           {form.formState.errors.name && (
//             <small className="text-red-700">
//               Trường này không được để trống
//             </small>
//           )}
//         </div>
//         <div className="mb-5">
//           <label
//             className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//             htmlFor="user_avatar"
//           >
//             Product Thumbnail
//           </label>
//           <input
//             className="block text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 w-[600px]"
//             aria-describedby="user_avatar_help"
//             id="user_avatar"
//             type="text"
//             {...form.register("thumbnail", { required: true })}
//             onChange={handleImageChange}
//           />
//           {form.formState.errors.thumbnail && (
//             <small className="text-red-700">
//               Trường này không được để trống
//             </small>
//           )}
//         </div>
//         <div className="flex gap-5">
//           <div className="mb-5">
//             <label
//               htmlFor="base-input"
//               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//             >
//               Product Price
//             </label>
//             <input
//               type="text"
//               id="base-input"
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-[50px] w-[288px]"
//               {...form.register("price", { required: true })}
//             />
//             {form.formState.errors.price && (
//               <small className="text-red-700">
//                 Trường này không được để trống
//               </small>
//             )}
//           </div>
//           <div className="mb-5">
//             <label
//               htmlFor="base-input"
//               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//             >
//               Product Quantity
//             </label>
//             <input
//               type="text"
//               id="base-input"
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-[50px] w-[288px]"
//               {...form.register("quantity", { required: true })}
//             />
//             {form.formState.errors.quantity && (
//               <small className="text-red-700">
//                 Trường này không được để trống
//               </small>
//             )}
//           </div>
//         </div>
//         <div className="mb-5">
//           <label
//             htmlFor="message"
//             className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//           >
//             Product Description
//           </label>
//           <textarea
//             id="message"
//             rows={4}
//             className="block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-[600px]"
//             placeholder="Leave a comment..."
//             defaultValue={""}
//             {...form.register("desc", { required: true })}
//           />
//           {form.formState.errors.desc && <small className="text-red-700">Trường này không được để trống</small>}
//         </div>
//         {/* <div className="mb-5">
//             <label
//               htmlFor="countries"
//               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//             >
//               Product Type-ID
//             </label>
//             <select
//               id="countries"
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-[600px] h-[50px]"
//               // {...form.register("id_type", {required: true})}
//             >
//               <option>Choose Type</option>
//               <option>Canada</option>
//               <option>France</option>
//               <option>Germany</option>
//             </select>
//         </div> */}
//         {/* <div className="mb-5">
//             <label
//               htmlFor="countries"
//               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//             >
//               Product Size
//             </label>
//             <select
//               id="countries"
//               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-[600px] h-[50px]"
//               // {...form.register("size", {required: true})}
//             >
//               <option>Choose Size</option>
//               <option>Canada</option>
//               <option>France</option>
//               <option>Germany</option>
//             </select>
//         </div> */}
//         {/* <button
//           type="submit"
//           className="px-10 py-4 mb-2 text-sm font-medium text-white bg-green-400 rounded-lg focus:outline-none hover:bg-green-800 focus:ring-4 focus:ring-green-300 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
//         >
//           {isPending ? "Đang Thêm" : "Submit Form"}
//         </button> */}
//          <Form.Item>
//         <Button type="primary" htmlType="submit">
//           {isPending ? "Đang Thêm" : "Submit Form"}
//         </Button>
//       </Form.Item>
//       </form>
//     </div>
//   );
// }

// export default ProductAdd;


// import React from 'react';
// import axios from 'axios';
// import { Button } from "antd";
// import { useNavigate } from 'react-router-dom';
// import { IProduct } from '../../../interface/Products';
// import { useForm } from 'react-hook-form';
// import { useMutation } from '@tanstack/react-query';

// const ProductAdd = () => {
//   const navigate = useNavigate();
//   const { 
//     register,
//     handleSubmit
//   } = useForm<IProduct>();
//   const { mutate } = useMutation({
//     mutationFn: async (product: IProduct) =>{
//         return await axios.post("http://localhost:3001/api/products/add", product);
        
//     }
//   })

//   const onSubmit = (product: IProduct) => {
//     mutate(product);
//     navigate("/admin/product");
//   }

//   return (
//     <>
      
//       <form onSubmit={handleSubmit(onSubmit)}>
//       <h1>Add New Product</h1>
//         <div>
//           <label>
//             Name:
//             <input
//               type="text"
//               { ...register("name", { required: true })}
//             />
//           </label>
//         </div>
//                 <div>
//           <label>
//             Ảnh:
//             <input
//               type="text"
//               {...register("image", { required: true })}
//             />
//           </label>
//         </div>
//         <div>
//           <label>
//             Price:
//             <input
//               type="number"
//               {...register("price", { required: true })}
//             />
//           </label>
//         </div>
//         <div>
//           <label>
//             Description:
//             <textarea
//               name="description"
//               required
//             />
//           </label>
//         </div>
//         <div>
//           <label>
//             Quantity:
//             <input
//               type="number"
//               {...register("quantity", { required: true })}
//             />
//           </label>
//         </div>
        
//         <Button type="primary" htmlType="submit">
//           Submit
//         </Button>
//       </form>
//     </>
//   );
// };

// export default ProductAdd;

import type { FormProps } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input } from 'antd';
import { IProduct } from '../../../interface/Products';


const ProductAdd = () => {
  const navigate = useNavigate()


  // const onSubmit: SubmitHandler<IProduct> = async (data) => {
  //   try {
  //     await axios.put(`http://localhost:3001/api/products/${id}`, data);
  //     alert('Success')
  //     navigate("/admin/product")
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  const onFinish: FormProps<IProduct>['onFinish'] = async  (values) => {
    console.log('Success:', values);
      try {
      await axios.post(`http://localhost:3001/api/products/add`, values);
      alert( 'Add product success')
      navigate("/admin/product")
    } catch (err) {
      console.log(err);
    }
  };

  const onFinishFailed: FormProps<IProduct>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<IProduct>
        label="Tên sản phẩm"
        name="name"
      >
        <Input type='text'/>
      </Form.Item>
      <Form.Item<IProduct>
        label="Giá"
        name="price"
      >
        <Input />
      </Form.Item>
      <Form.Item<IProduct>
        label="Số lượng"
        name="quantity"
      >
        <Input />
      </Form.Item>
      <Form.Item<IProduct>
        label="Ảnh"
        name="image"
      >
        <Input />
      </Form.Item>
      <Form.Item<IProduct>
        label="Mô tả"
        name="description"
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductAdd;