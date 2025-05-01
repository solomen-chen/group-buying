//src/conponents//group-form.tsx

"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import ImageUpload from "@/components/image-upload";

type PickupOption = {
  time: string;
  location: string;
};

type Product = {
  name: string;
  spec: string;
  price: string;
  supply: string;
  imageUrl: string;
};

const formSchema = z.object({
  groupname: z.string().min(1, "請填寫團名"),
  deadline: z.string().min(1, "請選擇結單日期"),
  pickupOptions: z
    .array(z.object({ time: z.string(), location: z.string() }))
    .min(1, "至少一個取貨選項"),
  products: z
    .array(
      z.object({
        name: z.string(),
        spec: z.string(),
        price: z.string(),
        supply: z.string(),
        imageUrl: z.string(),
      })
    )
    .min(1, "至少一個商品"),
});

type GroupFormSchema = z.infer<typeof formSchema>;

type GroupFormProps = {
  mode: "create" | "edit";
  groupId?: string;
  defaultValues?: GroupFormSchema;
};

export function GroupForm({ mode, groupId, defaultValues }: GroupFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<GroupFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const {
    fields: pickupFields,
    append: appendPickup,
    remove: removePickup,
  } = useFieldArray({ control, name: "pickupOptions" });

  const {
    fields: productFields,
    append: appendProduct,
    remove: removeProduct,
  } = useFieldArray({ control, name: "products" });

  const onSubmit = (data: GroupFormSchema) => {
    console.log(mode === "edit" ? "更新團單：" : "建立團單：", data);
    // TODO: 傳送到 API /group/create 或 /group/edit
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 團名 */}
      <div>
        <label className="block font-bold mb-1">團名</label>
        <input {...register("groupname")} className="border px-2 py-1 w-full" />
        {errors.groupname && <p className="text-red-500">{errors.groupname.message}</p>}
      </div>

      {/* 結單日期 */}
      <div>
        <label className="block font-bold mb-1">結單日期</label>
        <input type="date" {...register("deadline")} className="border px-2 py-1 w-full" />
        {errors.deadline && <p className="text-red-500">{errors.deadline.message}</p>}
      </div>

      {/* 取貨時間與地點 */}
      <div>
        <label className="block font-bold mb-2">取貨時間與地點</label>
        {pickupFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2 mb-2">
            <input
              {...register(`pickupOptions.${index}.time`)}
              placeholder="時間"
              className="border px-2 py-1 w-1/3"
            />
            <input
              {...register(`pickupOptions.${index}.location`)}
              placeholder="地點"
              className="border px-2 py-1 w-1/2"
            />
            <button type="button" onClick={() => removePickup(index)} className="text-red-500">
              移除
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendPickup({ time: "", location: "" })}
          className="text-blue-500 underline"
        >
          + 新增取貨選項
        </button>
        {errors.pickupOptions && <p className="text-red-500">{errors.pickupOptions.message as string}</p>}
      </div>

      {/* 商品清單 */}
      <div>
        <label className="block font-bold mb-2">商品列表</label>
        {productFields.map((field, index) => (
          <div key={field.id} className="border p-4 mb-4 rounded space-y-2">
            <div className="flex gap-2">
              <input
                {...register(`products.${index}.name`)}
                placeholder="商品名稱"
                className="border px-2 py-1 w-1/2"
              />
              <input
                {...register(`products.${index}.spec`)}
                placeholder="規格"
                className="border px-2 py-1 w-1/2"
              />
            </div>
            <div className="flex gap-2">
              <input
                {...register(`products.${index}.price`)}
                placeholder="價格"
                className="border px-2 py-1 w-1/2"
              />
              <input
                {...register(`products.${index}.supply`)}
                placeholder="供應數量 (0=不限)"
                className="border px-2 py-1 w-1/2"
              />
            </div>
            <div>
              <ImageUpload
                initialImage={watch(`products.${index}.imageUrl`)}
                onImageUploaded={(url) => setValue(`products.${index}.imageUrl`, url)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeProduct(index)}
              className="text-red-500 mt-2"
            >
              移除商品
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            appendProduct({ name: "", spec: "", price: "", supply: "", imageUrl: "" })
          }
          className="text-blue-500 underline"
        >
          + 新增商品
        </button>
        {errors.products && <p className="text-red-500">{errors.products.message as string}</p>}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {mode === "edit" ? "更新" : "建立"} 團單
      </button>
    </form>
  );
}
