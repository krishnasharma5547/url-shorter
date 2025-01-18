import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "./Button";

interface URLShortenerFormProps {
  onSubmit: (data: {
    url: string;
    customAlias?: string;
    expiryDate?: string;
  }) => void;
  loading?: boolean;
  result?: {
    shortUrl: string;
    originalUrl: string;
    expireAt: string;
  } | null;
}

const validationSchema = Yup.object({
  url: Yup.string().url("Please enter a valid URL").required("URL is required"),
  customAlias: Yup.string()
    .min(3, "Alias must be at least 3 characters")
    .matches(
      /^[a-zA-Z0-9-_]+$/,
      "Only letters, numbers, hyphen and underscore allowed"
    )
    .optional(),
  expiryDate: Yup.date()
    .min(new Date(), "Expiry date must be in the future")
    .optional(),
});

const URLShortenerForm: React.FC<URLShortenerFormProps> = ({
  onSubmit,
  loading,
  result,
}) => {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-gradient-text bg-clip-text">
        Shorten Your URL
      </h2>
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-xl space-y-4 border border-gray-100">
        <Formik
          initialValues={{
            url: "",
            customAlias: "",
            expiryDate: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            onSubmit(values);
            if (!loading) {
              resetForm();
            }
          }}
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700"
                >
                  Long URL
                </label>
                <Field
                  id="url"
                  name="url"
                  type="url"
                  placeholder="Paste your long URL here..."
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

              <div className="space-y-2">
                <label
                  htmlFor="customAlias"
                  className="block text-sm font-medium text-gray-700"
                >
                  Custom Alias (Optional)
                </label>
                <Field
                  id="customAlias"
                  name="customAlias"
                  type="text"
                  placeholder="Enter custom alias"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.customAlias && touched.customAlias
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="customAlias"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expiry Date (Optional)
                </label>
                <Field
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.expiryDate && touched.expiryDate
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="expiryDate"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {result && (
                <div className="mt-4 p-4 bg-green-50 rounded-md">
                  <p className="text-green-700 font-medium">
                    URL Shortened Successfully!
                  </p>
                  <a
                    href={result.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {result.shortUrl}
                  </a>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-4"
                disabled={loading || !isValid || !dirty}
              >
                {loading ? "Shortening..." : "Shorten It!"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default URLShortenerForm;
