import { Storage } from "@google-cloud/storage";
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

const cr: Credentials = process.env.GOOGLE_BUCKE_CREDENTIALS


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
