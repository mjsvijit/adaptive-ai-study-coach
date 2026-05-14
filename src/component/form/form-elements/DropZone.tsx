"use client";
import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import ComponentCard from "../../common/ComponentCard";
import { useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";

interface DropZoneProps {
  label?: string | undefined;
  onChange?: (selected: File[]) => void;
  placeholder?: string | undefined;
  previewUrl?: string | undefined;
  icon?: string | undefined;
  allowedExtensions?: string[];
  size?: "default" | "small";
  multiple?: boolean;
  existingFiles?: any[] | undefined;
  onDeleteExisting?: (file: any) => void;
  onDownloadExisting?: (file: any) => void;
}

export interface DropzoneComponentRef {
  clearSelectedFiles: () => void;
}

const extensionToMime: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
  mkv: "video/x-matroska",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

import { Modal } from "../../ui/modal";
import { Dropdown } from "../../ui/dropdown/Dropdown";
import { DropdownItem } from "../../ui/dropdown/DropdownItem";
import {
  FiTrash2,
  FiEye,
  FiX,
  FiMoreVertical,
  FiDownload,
} from "react-icons/fi";
import Image from "next/image";

const DropzoneComponent = forwardRef<DropzoneComponentRef, DropZoneProps>(
  (
    {
      label,
      onChange,
      placeholder = "Drag and drop your PNG, JPG, WebP images or Videos here or browse",
      previewUrl,
      icon,
      allowedExtensions = ["png", "jpg", "jpeg", "webp", "mp4"],
      size = "default",
      multiple = false,
      existingFiles = [],
      onDeleteExisting,
      onDownloadExisting,
    },
    ref,
  ) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    useImperativeHandle(ref, () => ({
      clearSelectedFiles: () => {
        setSelectedFiles([]);
      },
    }));

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentPreviewFile, setCurrentPreviewFile] = useState<{
      file?: File;
      url: string;
      index?: number;
      isExisting?: boolean;
    } | null>(null);
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
      null,
    );
    const [openExistingDropdownIndex, setOpenExistingDropdownIndex] = useState<
      number | null
    >(null);

    const onDrop = (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        toast.error(
          `Some files were rejected. Only ${allowedExtensions.join(", ")} files are allowed`,
        );
        return;
      }

      const validFiles = acceptedFiles.filter((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase();
        return (
          ext && allowedExtensions.map((e) => e.toLowerCase()).includes(ext)
        );
      });

      if (validFiles.length === 0) return;

      let updatedFiles;
      if (multiple) {
        updatedFiles = [...selectedFiles, ...validFiles];
      } else {
        updatedFiles = validFiles.length > 0 ? [validFiles[0] as File] : [];
      }

      setSelectedFiles(updatedFiles);
      onChange?.(updatedFiles);
    };

    const removeFile = (index: number) => {
      const updatedFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(updatedFiles);
      onChange?.(updatedFiles);
      if (currentPreviewFile?.index === index) {
        setIsPreviewOpen(false);
        setCurrentPreviewFile(null);
      }
    };

    const openPreview = (file: File, index: number) => {
      const url = URL.createObjectURL(file);
      setCurrentPreviewFile({ file, url, index, isExisting: false });
      setIsPreviewOpen(true);
    };

    const openExistingPreview = (file: any) => {
      const isImage =
        file.mime_type?.startsWith("image/") ||
        file.file_name?.match(/\.(jpg|jpeg|png|webp|gif)$/i);
      const fullUrl = `${process.env["NEXT_PUBLIC_IMAGE_BACKEND_URL"]}${file.url}`;

      if (isImage) {
        setCurrentPreviewFile({
          url: fullUrl,
          isExisting: true,
          file: file, // Store original file info for delete etc
        });
        setIsPreviewOpen(true);
      } else {
        window.open(fullUrl, "_blank");
      }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: allowedExtensions.reduce(
        (acc, ext) => {
          const mime = extensionToMime[ext.toLowerCase()];
          if (mime) {
            acc[mime] = [...(acc[mime] || []), `.${ext.toLowerCase()}`];
          }
          return acc;
        },
        {} as Record<string, string[]>,
      ),
    });
    const renderTitle = () => {
      if (selectedFiles.length > 0) {
        return selectedFiles.map((file) => file.name).join(", ");
      }
      return isDragActive ? "Drop Files Here" : "Drag & Drop Files Here";
    };

    const isSmall = size === "small";
    const firstFile = selectedFiles?.[0];
    const dropzoneContent = (
      <div className="space-y-4">
        <div
          className={`transition border-2 border-dashed cursor-pointer rounded-2xl
        ${
          isDragActive
            ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10"
            : "border-brand-300 bg-transparent dark:border-gray-700 dark:bg-transparent hover:border-brand-500"
        }
      `}
        >
          <div
            {...getRootProps()}
            className={`dropzone rounded-2xl flex flex-col items-center justify-center ${
              isSmall ? "p-4" : "p-8"
            }`}
            id="demo-upload"
          >
            <input {...getInputProps()} />

            <div className="dz-message flex flex-col items-center !m-0">
              <div
                className={`${isSmall ? "mb-2" : "mb-4"} flex justify-center`}
              >
                <div
                  className={`flex items-center justify-center rounded-full
                ${isSmall ? "h-10 w-10" : "h-12 w-12"}
                ${
                  selectedFiles.length > 0
                    ? "bg-brand-50 text-brand-500"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                }
              `}
                >
                  <svg
                    width={isSmall ? "20" : "24"}
                    height={isSmall ? "20" : "24"}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
              </div>

              <h4
                className={`font-bold text-gray-900 dark:text-white mb-1 text-center ${
                  isSmall ? "text-sm" : "text-base"
                }`}
              >
                {isDragActive ? "Drop Files Here" : "Drag & Drop Files"}
              </h4>

              <p
                className={`text-center block w-full text-gray-500 dark:text-gray-400 mb-2 ${
                  isSmall ? "text-[10px]" : "text-xs"
                }`}
              >
                {placeholder}
              </p>

              <span
                className={`font-semibold underline text-brand-500 hover:text-brand-600 transition-colors ${
                  isSmall ? "text-xs" : "text-sm"
                }`}
              >
                Browse File
              </span>
            </div>
          </div>
        </div>

        {/* Preview Grid */}
        {(selectedFiles.length > 0 || existingFiles.length > 0) && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {/* Existing Files */}
            {existingFiles.map((file, index) => {
              const isImage =
                file.mime_type?.startsWith("image/") ||
                file.file_name?.match(/\.(jpg|jpeg|png|webp|gif)$/i);
              const fileUrl = `${process.env["NEXT_PUBLIC_IMAGE_BACKEND_URL"]}${file.url}`;

              return (
                <div
                  key={file.id || index}
                  className={`group relative aspect-square ${openExistingDropdownIndex === index ? "z-[100]" : "z-0"}`}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                    {isImage ? (
                      <Image
                        src={fileUrl}
                        alt={file.file_name}
                        width={100}
                        height={100}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center p-2 text-center">
                        {file.mime_type === "application/pdf" ||
                        file.file_name?.endsWith(".pdf") ? (
                          <svg
                            className="mb-1 h-10 w-10 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11.363 2c4.155 0 2.637 6 2.637 6s6-1.518 6 2.638v11.362c0 .552-.448 1-1 1h-13c-.552 0-1-.448-1-1v-20c0-.552.448-1 1-1h6.363zm.637-2h-8c-1.104 0-2 .896-2 2v20c0 1.104.896 2 2 2h14c1.104 0 2-.896 2-2v-13l-8-9z" />
                          </svg>
                        ) : file.mime_type?.includes("spreadsheet") ||
                          file.file_name?.match(/\.(xls|xlsx|csv)$/i) ? (
                          <svg
                            className="mb-1 h-10 w-10 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14.722 3L22 10.278V21a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h10.722a1 1 0 0 1 .722.3L14.722 3zm-.722 1H4v16h16V11.278L14 5.278V9a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V5h5zm-1 0v4h-2V5h2z" />
                          </svg>
                        ) : (
                          <svg
                            className="mb-1 h-8 w-8 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                        <span className="line-clamp-1 text-[10px] text-gray-500">
                          {file.file_name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute right-2 top-2 z-10">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenExistingDropdownIndex(
                            openExistingDropdownIndex === index ? null : index,
                          );
                        }}
                        className="dropdown-toggle flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-brand-500"
                      >
                        <FiMoreVertical size={16} />
                      </button>

                      <Dropdown
                        isOpen={openExistingDropdownIndex === index}
                        onClose={() => setOpenExistingDropdownIndex(null)}
                        className="mt-1 min-w-[124px] overflow-hidden p-1 z-[9999]"
                      >
                        <DropdownItem
                          onItemClick={(e: any) => {
                            e.stopPropagation();
                            openExistingPreview(file);
                            setOpenExistingDropdownIndex(null);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                        >
                          <FiEye size={14} className="text-gray-500" />
                          View
                        </DropdownItem>
                        <DropdownItem
                          onItemClick={(e: any) => {
                            e.stopPropagation();
                            onDownloadExisting?.(file);
                            setOpenExistingDropdownIndex(null);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs text-green-600 hover:bg-green-50"
                        >
                          <FiDownload size={14} />
                          Download
                        </DropdownItem>
                        <DropdownItem
                          onItemClick={(e: any) => {
                            e.stopPropagation();
                            onDeleteExisting?.(file);
                            setOpenExistingDropdownIndex(null);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                        >
                          <FiTrash2 size={14} />
                          Delete
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Newly Selected Files */}
            {selectedFiles.map((file, index) => {
              const isImage = file.type.startsWith("image/");
              const isVideo = file.type.startsWith("video/");
              const fileUrl = URL.createObjectURL(file);

              return (
                <div
                  key={`${file.name}-${index}`}
                  className={`group relative aspect-square ${openDropdownIndex === index ? "z-[100]" : "z-0"}`}
                >
                  {/* Media Content Wrapper with overflow hidden */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                    {isImage ? (
                      <img
                        src={fileUrl}
                        alt={file.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                      />
                    ) : isVideo ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <svg
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center p-2 text-center">
                        <svg
                          className="mb-1 h-8 w-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="line-clamp-1 text-[10px] text-gray-500">
                          {file.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Overlay with 3-dot menu */}
                  <div className="absolute right-2 top-2 z-10">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownIndex(
                            openDropdownIndex === index ? null : index,
                          );
                        }}
                        className="dropdown-toggle flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-brand-500 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <FiMoreVertical size={16} />
                      </button>

                      <Dropdown
                        isOpen={openDropdownIndex === index}
                        onClose={() => setOpenDropdownIndex(null)}
                        className="mt-1 min-w-[124px] overflow-hidden p-1 z-[9999]"
                      >
                        {isImage && (
                          <DropdownItem
                            onClick={() => {
                              openPreview(file, index);
                              setOpenDropdownIndex(null);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                          >
                            <FiEye size={14} className="text-gray-500" />
                            View
                          </DropdownItem>
                        )}
                        <DropdownItem
                          onClick={() => {
                            removeFile(index);
                            setOpenDropdownIndex(null);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <FiTrash2 size={14} />
                          Delete
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Image Preview Modal */}
        {currentPreviewFile && (
          <Modal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            className="max-w-4xl p-0 overflow-hidden"
          >
            <div className="relative bg-black h-[70vh] flex items-center justify-center">
              <Image
                src={currentPreviewFile.url}
                alt="Preview"
                width={500}
                height={500}
                className="max-h-full max-w-full object-contain"
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
                {currentPreviewFile.isExisting && (
                  <button
                    type="button"
                    onClick={() => {
                      onDownloadExisting?.(currentPreviewFile.file);
                    }}
                    className="flex items-center gap-2 text-green-500 hover:text-green-400 transition font-medium"
                  >
                    <FiDownload size={18} />
                    Download
                  </button>
                )}
                {!currentPreviewFile.isExisting ? (
                  <button
                    type="button"
                    onClick={() => removeFile(currentPreviewFile.index!)}
                    className="flex items-center gap-2 text-white hover:text-red-400 transition font-medium"
                  >
                    <FiTrash2 size={18} />
                    Delete
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteExisting?.(currentPreviewFile.file);
                      setIsPreviewOpen(false);
                    }}
                    className="flex items-center gap-2 text-white hover:text-red-400 transition font-medium"
                  >
                    <FiTrash2 size={18} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    );

    if (!label) return dropzoneContent;

    return <ComponentCard title={label}>{dropzoneContent}</ComponentCard>;
  },
);

export default DropzoneComponent;
