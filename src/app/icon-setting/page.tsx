import { Button } from "@nextui-org/react";

export default function page() {
  return (
    <>
      <h1 className="text-lg">Додайте іконку для вашого застусунку</h1>
      <div className="flex h-52 w-full flex-col items-center justify-center rounded-lg border-4 border-dashed border-gray-300">
        <div>
          <svg
            className="h-14 w-14 text-gray-300 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm11-4.2a1 1 0 1 0-2 0V11H7.8a1 1 0 1 0 0 2H11v3.2a1 1 0 1 0 2 0V13h3.2a1 1 0 1 0 0-2H13V7.8Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <Button
        size="lg"
        className="w-2/3 bg-black text-white dark:bg-white dark:text-white"
      >
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
        Завантажити
      </Button>
    </>
  );
}
