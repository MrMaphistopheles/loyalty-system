import { Storage, UploadOptions } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import { Buffer } from "buffer";

interface Credentials {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

interface FileOptions {
  public: boolean;
  resumable: boolean;
  validation: boolean;
}

const fileOptions: FileOptions = {
  public: true,
  resumable: false,
  validation: false,
};

const cr: Credentials = {
  type: "service_account",
  project_id: "bonuslite-400810",
  private_key_id: "d66f3ed2eefb6d3fcd6283fe114f0b3f011caf96",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDNizrlKeMR6NxE\n3akTvSAdjTlsrpfR1tlFXjfKIwDWEGchmYcm/uc4k4ya7jnwjLgubMYcG1hPZfCu\npGPGGEtLyA2v3Bza4legBX0NtZWXh/yRzqWyYP76yJl0uVdbtfZP7SE4EvMDbG3+\nScXg8cbTWYxKCWv9F2/Rjl3Arj26pStmThNZI/TUt+G1T7mYuQsUGWL63mBaNgCw\nsk8u5fLVMkzVnGdnSOYpwF4EDDt5IuY3PVzAMsZ/wxejorP8iW6g4HvTAdtRhMpV\n9K9AvY8elZ3MRNj94b/bnx86xtySPZeLlDN9Q5R3h8r1XQcwW41qI/pUXp+hfISA\nOsbrQzpbAgMBAAECggEAIlDb6NWY7O0JFVBCgaKiIXzp+OyfOS/a/1tPCibU5WhA\np5nnuAl3lfkAUP9z2ebMeye63YdtM3hL+gRFChYVQBYqvtELWjnOsk8oRSkrS+yu\nrLMo88KA32KtSBEHdi7HbCmlUaTMQKaSKJGtgTQsYy3An7258zu99ekEWv5cHPRY\n02YpyFrsW+YulEdfGnVSMYKOvbUU+pUKipo365PXNyAceMBpeHJouZTYuvli/r0Z\nlft8dcqRTmqhzhM1XkQ5Y64+LC+hkg4EuW2KZkLcowOO4VH65+MpxghyOXzvyAtF\nHYfDV4B3qQnPYEvT7QUZJw6h5nDoe6Qh4XDZTPJPaQKBgQDpAaOUdDB7H/beXe43\nc3Miq9hCzu93wcU9B9fTVlAEVpRu69+9gzI7xE/kd8UeEu8APvWhNjvtyGpO2lZh\nWeZ2q/FgW4dwvUHh8iKDdtayrArSUzUgIKLl0CGtbcajaEyCsHxcdA9fH/NRY6tP\nl68kVoJpg8bbW7A3L0tjoTx3cwKBgQDh09CAB1cPdrcm0vRCE5MsZEJiHDzmDZPw\nZD81P/i7IH50Mjldg6X1HYPLJlVpRfWPifABm17/KHk4I+c/lzF3H1+Us2Ql3nmd\nkSuQXbIOXkCU3eUNV8Bc6YwbyF1NdhkoNb+NxfQJsc/S4qHETfo8sEq0aXBzFVb/\n9qPeLQLneQKBgQDQ7fxM6GZ0cPP+7oDlTetGgoqXVVDatHB0yiyXvwRe73eHgo+M\nMjD/8Iam2VJyJg4SzWGZHbVdAOF6NUNRZbhGXuVAPrJSwBFsVZ7m/M+FRMkrURsI\n5NrMcPVRumZsLeC1KyVIDXWfGVond9SruNp+HegwTs4n8a4vvYO/IVvDywKBgQCn\nwj84bLt7DFjAqaO0VnBVYOGDmrCOwfVtdjsSZsRy1o+55/l/g6XMcjGOv5phiwwB\nppm5x98JM9rhHqLSNZIUiSTrBVzXWO8FY2t2YnQ8gj39mN1oTRDktMZVeUH+okXL\n/imfuzcv4Hyfj6ZWewry/I9yeIWFqIupuGJBUTTAGQKBgAi01Gll0ZPy3OvfmW09\nxvqymIN1Uw+XtaQxjXa59ewHM/rtxwGicaj6CsfWnSlSW6Fq7tFRkLN4T+Hw09wk\nEjHhMqJh6eBvlSlE9/Nkzc4i3kyn5uvcL35Lc0xgdb0d2B4SdNodc5jfRwsv43Rv\nvV+8Nx4Vi1ERf3ZW8bxA/jAR\n-----END PRIVATE KEY-----\n",
  client_email: "bonuslite1@bonuslite-400810.iam.gserviceaccount.com",
  client_id: "115710493396317302816",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/bonuslite1%40bonuslite-400810.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};


export function googleBucket(name: string, data?: string) {
  const bucketname = "bonuslite1";
  const credentials = cr;
  const options = fileOptions;

  const storage = new Storage({
    credentials,
  });

  return {
    async uploadImageToBucket() {
      try {
        if (!data) return { error: "data don't exist" };

        const fileName = `${uuidv4()}.${name}`;
        const file = storage.bucket(bucketname).file(fileName);
        const base64encodedString: string = data.replace(
          /^data:image\/\w+;base64,/,
          "",
        );
        const buffer = Buffer.from(base64encodedString, "base64");
        await file.save(buffer, options);
        const path: string = `https://storage.googleapis.com/bonuslite1/${fileName}`;
        return path;
      } catch (error) {
        return { error };
      }
    },

    async deleteImageFromBuckets() {
      try {
        const parts = name.split("/");
        const filename = parts[parts.length - 1];

        if (!filename) return { error: "file name don't exist" };
        if (filename !== undefined) {
          const file = await storage.bucket(bucketname).file(filename).delete();
          console.log(file);
          return { success: "Image deleted" };
        }
      } catch (error) {
        return { error };
      }
    },
  };
}
