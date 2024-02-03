"use client";
import { useFilePicker } from "use-file-picker";
import {
  FileAmountLimitValidator,
  FileTypeValidator,
  FileSizeValidator,
  ImageDimensionsValidator,
} from "use-file-picker/validators";
import { Button } from "@nextui-org/react";
export default function UploadIcon({
  pathKey,
}: {
  pathKey: string | undefined;
}) {
  const { openFilePicker, filesContent, loading, errors } = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileTypeValidator(["jpg", "png"]),
      new FileSizeValidator({ maxFileSize: 50 * 1024 * 1024 /* 50 MB */ }),
      new ImageDimensionsValidator({
        maxHeight: 512, // in pixels
        maxWidth: 512,
      }),
    ],
  });

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        size="lg"
        className="w-2/3 bg-black text-white dark:bg-white dark:text-black"
        onClick={openFilePicker}
      >
        Вибрати
      </Button>
      <Button isIconOnly className="bg-black  dark:bg-white " size="lg">
        <svg
          className="h-6 w-6 text-white dark:text-black"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M12 3c.3 0 .6.1.8.4l4 5a1 1 0 1 1-1.6 1.2L13 7v7a1 1 0 1 1-2 0V6.9L8.8 9.6a1 1 0 1 1-1.6-1.2l4-5c.2-.3.5-.4.8-.4ZM9 14v-1H5a2 2 0 0 0-2 2v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2 1 1 0 1 0 0-2Z"
            clipRule="evenodd"
          />
        </svg>
      </Button>
    </div>
  );
}
