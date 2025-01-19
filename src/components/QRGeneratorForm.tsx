import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "./Button";

interface QRGeneratorFormProps {
  onSubmit: (data: {
    url: string;
    foregroundColor: string;
    backgroundColor: string;
    size: string;
    logo?: File;
  }) => void;
  loading?: boolean;
}

const validationSchema = Yup.object({
  url: Yup.string().url("Please enter a valid URL").required("URL is required"),
  foregroundColor: Yup.string()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format")
    .required("Foreground color is required"),
  backgroundColor: Yup.string()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format")
    .required("Background color is required"),
  size: Yup.number()
    .min(100, "Size must be at least 100px")
    .max(500, "Size cannot exceed 500px")
    .required("Size is required"),
  logo: Yup.mixed()
    .test("fileSize", "File too large", (value) => {
      if (!value) return true;
      return value.size <= 1024 * 1024; // 1MB
    })
    .test("fileFormat", "Unsupported format", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
    }),
});

const QRGeneratorForm: React.FC<QRGeneratorFormProps> = ({
  onSubmit,
  loading,
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-gradient-text bg-clip-text">
        Generate QR Code
      </h2>
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-xl space-y-4 border border-gray-100">
        <Formik
          initialValues={{
            url: "",
            foregroundColor: "#000000",
            backgroundColor: "#FFFFFF",
            size: "200",
            logo: undefined,
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, setFieldValue, isValid, dirty }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700"
                >
                  URL for QR Code
                </label>
                <Field
                  id="url"
                  name="url"
                  type="url"
                  placeholder="Enter URL for QR code..."
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.url && touched.url
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="url"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="foregroundColor"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Foreground Color
                  </label>
                  <Field
                    id="foregroundColor"
                    name="foregroundColor"
                    type="color"
                    className="w-full p-1 h-10 border rounded-md"
                  />
                  <ErrorMessage
                    name="foregroundColor"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="backgroundColor"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Background Color
                  </label>
                  <Field
                    id="backgroundColor"
                    name="backgroundColor"
                    type="color"
                    className="w-full p-1 h-10 border rounded-md"
                  />
                  <ErrorMessage
                    name="backgroundColor"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="size"
                  className="block text-sm font-medium text-gray-700"
                >
                  QR Code Size (px)
                </label>
                <Field
                  id="size"
                  name="size"
                  type="range"
                  min="100"
                  max="500"
                  step="50"
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">
                  <Field name="size">
                    {({ field }: { field: { value: string } }) =>
                      field.value + "px"
                    }
                  </Field>
                </div>
                <ErrorMessage
                  name="size"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="logo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Logo (Optional)
                </label>
                <input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setFieldValue("logo", event.currentTarget.files?.[0]);
                  }}
                  className="w-full p-2 border rounded-md"
                />
                <ErrorMessage
                  name="logo"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-4"
                disabled={loading || !isValid || !dirty}
              >
                {loading ? "Generating..." : "Generate QR"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default QRGeneratorForm;
