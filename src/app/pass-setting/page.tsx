"use client";
import { useEffect, useRef, useState } from "react";
import { Pass } from "../_components/user/Card";
import { type ColorResult, TwitterPicker } from "react-color";
import { useFilePicker } from "use-file-picker";
import {
  FileAmountLimitValidator,
  FileTypeValidator,
  FileSizeValidator,
  ImageDimensionsValidator,
} from "use-file-picker/validators";
import { Button } from "@nextui-org/react";
import { api } from "@/trpc/react";
import Authoraised from "../_components/app/Authoraised";

export default function page() {
  const [color, setColor] = useState<string>("");
  const [image, setImage] = useState<string | null>("");

  const removeHashtag = (hex: string) => {
    return hex.replace("#", "");
  };
  const { data, isLoading, refetch, isSuccess } =
    api.manager.loadTheme.useQuery();

  console.log(data);

  const { mutate, isLoading: upLoading } = api.manager.updateTheme.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const { mutate: mutateColor, isLoading: colorLoading } =
    api.manager.updateOnlyColorTheme.useMutation({
      onSuccess: () => {
        void refetch();
      },
    });

  const { openFilePicker, filesContent, loading, errors } = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileTypeValidator(["jpg", "png"]),
      new FileSizeValidator({ maxFileSize: 50 * 1024 * 1024 /* 50 MB */ }),
      new ImageDimensionsValidator({
        maxHeight: 1600, // in pixels
        maxWidth: 2600,
      }),
    ],
  });

  useEffect(() => {
    if (data && data.color) {
      data.image;
      setColor(data.color);
      setImage(data.image);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (filesContent[0]?.content !== undefined) {
      setImage(filesContent[0].content);
    }
  }, [filesContent]);

  const handleUpdate = () => {
    if (filesContent[0]?.content !== undefined) {
      mutate({
        name: filesContent[0].name,
        image: filesContent[0].content,
        color: color,
      });
    } else {
      if (color.length > 0) {
        mutateColor({
          color: color,
        });
      }
    }
  };

  return (
    <Authoraised role="MANAGER">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <Pass
          z={1}
          t={0}
          name={"Comany Name"}
          translate={0}
          show={true}
          visble={false}
          userName={"User name"}
          countOf={5}
          color={color}
          icon={image}
          linkToGoogleW="/"
          linkToMenu="/"
          qrVal={color}
          position="relative"
          onClick={openFilePicker}
        />
        <TwitterPicker
          color={`#${color}`}
          onChange={(color: ColorResult): void =>
            setColor(removeHashtag(color.hex))
          }
        />
      </div>
      <br />
      <br />
      <Button
        size="lg"
        className="w-10/12 bg-black text-white dark:bg-white dark:text-black"
        isLoading={upLoading || colorLoading}
        onClick={handleUpdate}
      >
        <svg
          className="h-6 w-6 text-white dark:text-black"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="m14.707 4.793-4-4a1 1 0 0 0-1.416 0l-4 4a1 1 0 1 0 1.416 1.414L9 3.914V12.5a1 1 0 0 0 2 0V3.914l2.293 2.293a1 1 0 0 0 1.414-1.414Z" />
          <path d="M18 12h-5v.5a3 3 0 0 1-6 0V12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
        </svg>
        Update
      </Button>
    </Authoraised>
  );
}
